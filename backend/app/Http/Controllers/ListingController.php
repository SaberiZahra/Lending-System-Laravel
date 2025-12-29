<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Item;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    /**
     * Display listings of the authenticated user's items.
     */
    public function index(Request $request)
    {
        $listings = $request->user()->items()->with('listings')->get()->pluck('listings')->flatten();
        return response()->json($listings);
    }

    /**
     * Store a new listing for an item owned by the user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id'          => 'required|exists:items,id',
            'title'            => 'required|string|max:200',
            'description'      => 'nullable|string',
            'daily_fee'        => 'required|numeric|min:0',
            'deposit_amount'   => 'required|numeric|min:0',
            'available_from'   => 'required|date',
            'available_until'  => 'required|date|after_or_equal:available_from',
            'status'           => 'sometimes|in:active,paused,expired',
        ]);

        $item = Item::findOrFail($validated['item_id']);

        if ($item->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'You can only create listings for your own items'], 403);
        }

        $listing = $item->listings()->create([
            'title'           => $validated['title'],
            'description'     => $validated['description'],
            'daily_fee'       => $validated['daily_fee'],
            'deposit_amount'  => $validated['deposit_amount'],
            'available_from'  => $validated['available_from'],
            'available_until' => $validated['available_until'],
            'status'          => $validated['status'] ?? 'active',
        ]);

        return response()->json($listing->load('item'), 201);
    }

    /**
     * Display a specific listing (only if item belongs to user).
     */
    public function show(Request $request, Listing $listing)
    {
        if ($listing->item->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($listing->load('item'));
    }

    /**
     * Update the listing.
     */
    public function update(Request $request, Listing $listing)
    {
        if ($listing->item->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title'            => 'sometimes|required|string|max:200',
            'description'      => 'nullable|string',
            'daily_fee'        => 'sometimes|required|numeric|min:0',
            'deposit_amount'   => 'sometimes|required|numeric|min:0',
            'available_from'   => 'sometimes|required|date',
            'available_until'  => 'sometimes|required|date|after_or_equal:available_from',
            'status'           => 'sometimes|in:active,paused,expired',
        ]);

        $listing->update($validated);

        return response()->json($listing->load('item'));
    }

    /**
     * Soft delete the listing.
     */
    public function destroy(Request $request, Listing $listing)
    {
        if ($listing->item->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $listing->delete();

        return response()->json(['message' => 'Listing deleted successfully']);
    }
}
