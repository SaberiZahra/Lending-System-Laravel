<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Listing;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    /**
     * Loans related to authenticated user
     */
    public function myLoans(Request $request)
    {
        $user = $request->user();

        $loans = Loan::with(['listing.item.owner', 'borrower'])
            ->where('borrower_id', $user->id)
            ->orWhereHas('listing.item', function ($q) use ($user) {
                $q->where('owner_id', $user->id);
            })
            ->orderBy('request_date', 'desc')
            ->get();

        return response()->json($loans);
    }

    /**
     * Create loan request
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'listing_id' => 'required|exists:listings,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date'   => 'required|date|after:start_date',
        ]);

        $listing = Listing::with('item')->findOrFail($data['listing_id']);

        // Check if listing is expired
        if ($listing->available_until && now()->greaterThan($listing->available_until)) {
            return response()->json([
                'message' => 'This product is no longer available. The availability period has ended.'
            ], 422);
        }

        // Listing must be active
        if ($listing->status !== 'active') {
            return response()->json([
                'message' => 'Listing is not available'
            ], 422);
        }

        // Validate dates are within available range
        $startDate = \Carbon\Carbon::parse($data['start_date']);
        $endDate = \Carbon\Carbon::parse($data['end_date']);

        if ($listing->available_from && $startDate->lessThan($listing->available_from)) {
            return response()->json([
                'message' => 'Start date must be on or after ' . $listing->available_from->format('Y-m-d')
            ], 422);
        }

        if ($listing->available_until && $endDate->greaterThan($listing->available_until)) {
            return response()->json([
                'message' => 'End date must be on or before ' . $listing->available_until->format('Y-m-d')
            ], 422);
        }

        // Cannot borrow own item
        if ($listing->item->owner_id === $request->user()->id) {
            return response()->json([
                'message' => 'You cannot borrow your own item'
            ], 403);
        }

        // Prevent duplicate active requests
        $exists = Loan::where('listing_id', $listing->id)
            ->where('borrower_id', $request->user()->id)
            ->whereIn('status', ['requested', 'approved', 'borrowed'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'You already have an active request for this listing'
            ], 422);
        }

        $loan = Loan::create([
            'listing_id'   => $listing->id,
            'borrower_id'  => $request->user()->id,
            'start_date'   => $data['start_date'],
            'end_date'     => $data['end_date'],
            'status'       => 'requested',
            'request_date' => now(),
        ]);

        return response()->json(
            $loan->load('listing.item'),
            201
        );
    }

    /**
     * Approve loan
     */
    public function approve(Request $request, Loan $loan)
    {
        if ($loan->listing->item->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($loan->status !== 'requested') {
            return response()->json(['message' => 'Invalid state'], 422);
        }

        $loan->update([
            'status' => 'approved',
            'approval_date' => now(),
        ]);

        $loan->listing->update(['status' => 'paused']);

        return response()->json($loan->load('listing.item', 'borrower'));
    }

    /**
     * Reject loan
     */
    public function reject(Request $request, Loan $loan)
    {
        if ($loan->listing->item->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($loan->status !== 'requested') {
            return response()->json(['message' => 'Invalid state'], 422);
        }

        $loan->update(['status' => 'rejected']);

        return response()->json($loan->load('listing.item', 'borrower'));
    }

    public function show(Request $request, Loan $loan)
    {
        $user = $request->user();

        // Only borrower or item owner can view
        if (
            $loan->borrower_id !== $user->id &&
            $loan->listing->item->owner_id !== $user->id
        ) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(
            $loan->load('listing.item.owner', 'borrower')
        );
    }

}
