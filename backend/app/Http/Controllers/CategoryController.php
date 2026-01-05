<?php


namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display all categories (with children for tree structure).
     */
    public function index()
    {
        $categories = Category::with('children')->whereNull('parent_id')->get();
        return response()->json($categories);
    }

    /**
     * Display a single category with its items.
     */
    public function show($id)
    {
        $category = Category::with(['children', 'items.listings' => function ($query) {
            $query->where('status', 'active');
        }])->findOrFail($id);
        
        return response()->json($category);
    }

    /**
     * Store a new category (Admin only)
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:150',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        $category = Category::create($data);

        return response()->json($category, 201);
    }

    /**
     * Update a category (Admin only)
     */
    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:150',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        $category->update($data);

        return response()->json($category);
    }

    /**
     * Delete a category (Admin only)
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
