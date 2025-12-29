<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function profile(Request $request)
    {
        $user = $request->user();

        $user->load([
            'items',
            'loans.listing.item'
        ]);

        return response()->json([
            'id' => $user->id,
            'full_name' => $user->full_name,
            'username' => $user->username,
            'email' => $user->email,
            'profile_image' => $user->profile_image,
            'trust_score' => $user->trust_score,
            'status' => $user->status,
            'items' => $user->items,
            'loans' => $user->loans,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'full_name' => 'sometimes|string|max:150',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string|max:30',
            'address' => 'sometimes|string',
        ]);
        $user->update($data);
        return response()->json($user);
    }

}
