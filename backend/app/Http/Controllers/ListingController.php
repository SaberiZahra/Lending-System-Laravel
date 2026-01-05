<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class ListingController extends Controller
{
    /**
     * Display listings of the authenticated user's items.
     * For admin users, return all listings.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // If user is admin, return all listings
        if ($user->role === 1) {
            $listings = Listing::with(['item.category', 'item.owner'])->get();
            return response()->json($listings);
        }
        
        // Otherwise, return only user's listings
        $listings = $user->items()->with('listings')->get()->pluck('listings')->flatten();
        return response()->json($listings);
    }

    /**
     * Display all active listings for public/guest users (homepage).
     */
    public function publicIndex()
    {
        $query = Listing::with(['item.category', 'item.owner'])
            ->where('status', 'active');
        
        // Check if view_count column exists before ordering by it
        if (Schema::hasColumn('listings', 'view_count')) {
            $query->orderBy('view_count', 'desc');
        }
        
        $listings = $query->latest()->get();

        return response()->json($listings);
    }

    /**
     * Get newest listings (ordered by created_at desc)
     */
    public function newest()
    {
        $listings = Listing::with(['item.category', 'item.owner'])
            ->where('status', 'active')
            ->latest('created_at')
            ->limit(15)
            ->get();

        return response()->json($listings);
    }

    /**
     * Get most viewed listings (ordered by view_count desc)
     */
    public function mostViewed()
    {
        $query = Listing::with(['item.category', 'item.owner'])
            ->where('status', 'active');
        
        // Check if view_count column exists before ordering by it
        if (Schema::hasColumn('listings', 'view_count')) {
            $query->orderBy('view_count', 'desc');
        }
        
        $listings = $query->latest('created_at')->limit(15)->get();

        return response()->json($listings);
    }

    /**
     * Get most borrowed listings (ordered by loans count)
     */
    public function mostBorrowed()
    {
        $listings = Listing::with(['item.category', 'item.owner'])
            ->where('status', 'active')
            ->withCount('loans')
            ->orderBy('loans_count', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(15)
            ->get();

        return response()->json($listings);
    }

    /**
     * Display a specific listing for public/guest users.
     */
    public function publicShow($id)
    {
        // Return listing even if expired, so users can see it
        $listing = Listing::with(['item.category', 'item.owner'])
            ->findOrFail($id);

        // Increment view count
        $listing->increment('view_count');

        return response()->json($listing);
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
