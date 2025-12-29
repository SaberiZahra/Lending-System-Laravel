<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ItemController extends Controller
{
    /**
     * Display a listing of the authenticated user's items.
     */
    public function index(Request $request)
    {
        $items = $request->user()->items()->with('category')->get();
        return response()->json($items);
    }

    /**
     * Store a newly created item for the authenticated user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id'     => 'required|exists:categories,id',
            'title'           => 'required|string|max:200',
            'description'     => 'nullable|string',
            'item_condition'  => 'required|in:new,like_new,used,old',
            'images_json'     => 'nullable|string', // Should be JSON string like '["url1","url2"]'
        ]);

        $item = $request->user()->items()->create([
            'category_id'    => $validated['category_id'],
            'title'          => $validated['title'],
            'description'    => $validated['description'],
            'item_condition' => $validated['item_condition'],
            'images_json'    => $validated['images_json'] ?? null,
        ]);

        return response()->json($item->load('category'), 201);
    }

    /**
     * Display the specified item (only if belongs to user).
     */
    public function show(Request $request, Item $item)
    {
        if ($item->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($item->load('category', 'listings'));
    }

    /**
     * Update the specified item (only if belongs to user).
     */
    public function update(Request $request, Item $item)
    {
        if ($item->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title'           => 'sometimes|required|string|max:200',
            'description'     => 'nullable|string',
            'item_condition'  => 'sometimes|required|in:new,like_new,used,old',
            'images_json'     => 'nullable|string',
        ]);

        $item->update($validated);

        return response()->json($item->load('category'));
    }

    /**
     * Remove the specified item (soft delete).
     */
    public function destroy(Request $request, Item $item)
    {
        if ($item->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $item->delete();

        return response()->json(['message' => 'Item deleted successfully']);
    }
}
