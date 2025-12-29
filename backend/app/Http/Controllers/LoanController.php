<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Listing;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    /**
     * Display all loans related to the authenticated user
     * (either as borrower or as item owner/lender).
     */
    public function myLoans(Request $request)
    {
        $user = $request->user();

        $loans = Loan::with(['listing.item.owner', 'borrower'])
            ->where('borrower_id', $user->id) // Loans where user is borrower
            ->orWhereHas('listing.item', function ($query) use ($user) {
                $query->where('owner_id', $user->id); // Loans for items user owns
            })
            ->latest()
            ->get();

        return response()->json($loans);
    }

    /**
     * Create a new loan request (user acts as borrower).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        // Load listing with item and owner to avoid N+1 queries
        $listing = Listing::with('item.owner')->findOrFail($validated['listing_id']);

        // 1. Listing must be active to accept new requests
        if ($listing->status !== 'active') {
            return response()->json([
                'message' => "This listing is not available for new requests (current status: {$listing->status})"
            ], 422);
        }

        // 2. Prevent user from borrowing their own item
        if ($listing->item->owner_id === $request->user()->id) {
            return response()->json([
                'message' => 'You cannot request to borrow your own item'
            ], 422);
        }

        // 3. Prevent duplicate active requests from the same user
        $hasActiveRequest = Loan::where('listing_id', $listing->id)
            ->where('borrower_id', $request->user()->id)
            ->whereIn('status', ['requested', 'approved', 'borrowed'])
            ->exists();

        if ($hasActiveRequest) {
            return response()->json([
                'message' => 'You already have an active request or ongoing loan for this item'
            ], 422);
        }

        // 4. Create the new loan request
        $loan = $request->user()->loans()->create([
            'listing_id'   => $listing->id,
            'start_date'   => $validated['start_date'],
            'end_date'     => $validated['end_date'],
            'status'       => 'requested',
            'request_date' => now(),
        ]);

        return response()->json($loan->load('listing.item'), 201);
    }

    /**
     * Approve a loan request (only the item owner can do this).
     */
    public function approve(Request $request, Loan $loan)
    {
        // Only the owner of the item can approve
        if ($loan->listing->item->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized: You are not the owner of this item'], 403);
        }

        // Loan must be in 'requested' state
        if ($loan->status !== 'requested') {
            return response()->json(['message' => 'This loan request cannot be approved (not in requested state)'], 422);
        }

        // Approve the loan and pause the listing to prevent new requests
        $loan->update([
            'status'        => 'approved',
            'approval_date' => now(),
        ]);

        $loan->listing->update(['status' => 'paused']); // Prevent further requests

        return response()->json($loan->load('listing.item', 'borrower'));
    }

    /**
     * Reject a loan request (only the item owner can do this).
     */
    public function reject(Request $request, Loan $loan)
    {
        // Only the owner of the item can reject
        if ($loan->listing->item->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized: You are not the owner of this item'], 403);
        }

        // Loan must be in 'requested' state
        if ($loan->status !== 'requested') {
            return response()->json(['message' => 'This loan request cannot be rejected (not in requested state)'], 422);
        }

        $loan->update(['status' => 'rejected']);

        return response()->json($loan->load('listing.item', 'borrower'));
    }
}
