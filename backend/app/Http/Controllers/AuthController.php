<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        // Validate incoming data
        $validated = $request->validate([
            'full_name' => 'required|string|max:150',
            'username'  => 'required|string|max:100|unique:users,username',
            'email'     => 'required|email|max:150|unique:users,email',
            'password'  => 'required|string|min:6', // Client sends "password", not "password_hash"
        ]);

        // Create user with hashed password
        $user = User::create([
            'full_name'    => $validated['full_name'],
            'username'     => $validated['username'],
            'email'        => $validated['email'],
            'password_hash'=> Hash::make($validated['password']),
        ]);

        // Generate Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return success response
        return response()->json([
            'message'      => 'User registered successfully',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user,
        ], 201);
    }

    /**
     * Get authenticated user details
     */
    public function me(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json([
            'id'         => $user->id,
            'full_name'  => $user->full_name,
            'username'   => $user->username,
            'email'      => $user->email,
            'phone'      => $user->phone,
            'trust_score'=> $user->trust_score,
            'role'       => $user->role,
            'status'     => $user->status,
            'created_at' => $user->created_at,
        ]);
    }

    /**
     * Login user (supports login with either username or email)
     */
    public function login(Request $request)
    {
        // Validate input
        $request->validate([
            'login'    => 'required|string', // Can be username or email
            'password' => 'required|string',
        ]);

        $login    = $request->input('login');
        $password = $request->input('password');

        // Find user by username or email
        $user = User::where('username', $login)
            ->orWhere('email', $login)
            ->first();

        // Check if user exists and password is correct
        if (!$user || !Hash::check($password, $user->password_hash)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Login successful',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user
        ]);
    }

    /**
     * Logout user (revoke all tokens)
     */
    public function logout(Request $request)
    {
        // Revoke all tokens for the authenticated user
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
