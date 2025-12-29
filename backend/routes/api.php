<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\MessageController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes defined here are automatically prefixed with "/api"
| and have the "api" middleware group applied.
|
*/

// Simple test route to return the authenticated user (useful for debugging auth)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

/* ========== PUBLIC ROUTES (No authentication required) ========== */

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/* ========== PROTECTED ROUTES (Require Sanctum authentication) ========== */
Route::middleware('auth:sanctum')->group(function () {

    /* ----- Authentication ----- */
    Route::post('/logout', [AuthController::class, 'logout']);     // Logout and revoke all tokens
    Route::get('/me', [AuthController::class, 'me']);             // Get current authenticated user details

    /* ----- User Profile ----- */
    Route::get('/profile', [UserController::class, 'profile']);   // Get authenticated user's profile
    Route::put('/profile', [UserController::class, 'update']);    // Update authenticated user's profile

    /* ----- Items Resource (RESTful) ----- */
    // GET    /api/items           → index
    // POST   /api/items           → store
    // GET    /api/items/{item}    → show
    // PUT    /api/items/{item}    → update
    // DELETE /api/items/{item}    → destroy
    Route::apiResource('items', ItemController::class);

    /* ----- Listings Resource (RESTful) ----- */
    Route::apiResource('listings', ListingController::class);

    /* ----- Loans ----- */
    Route::get('/my-loans', [LoanController::class, 'myLoans']);                    // Get loans where user is borrower or lender
    Route::post('/loans/{loan}/approve', [LoanController::class, 'approve']);       // Owner approves a loan request
    Route::post('/loans/{loan}/reject', [LoanController::class, 'reject']);         // Owner rejects a loan request

    // Standard RESTful routes for loans (must be defined AFTER custom routes to avoid conflicts)
    Route::apiResource('loans', LoanController::class);

    /* ----- Conversations & Messages ----- */
    Route::get('/conversations', [MessageController::class, 'conversations']);      // Get all conversations for authenticated user
    Route::get('/messages/{conversation}', [MessageController::class, 'messages']); // Get messages in a specific conversation
    Route::post('/messages', [MessageController::class, 'send']);                   // Send a new message
});
