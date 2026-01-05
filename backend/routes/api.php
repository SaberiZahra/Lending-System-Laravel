<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\CategoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes defined here are automatically prefixed with "/api"
| and have the "api" middleware group applied.
|
*/

/* ========== PUBLIC ROUTES (No authentication required) ========== */
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public endpoints
Route::get('/public/items', [ItemController::class, 'publicIndex']);
Route::get('/public/listings', [ListingController::class, 'publicIndex']);
Route::get('/public/listings/newest', [ListingController::class, 'newest']);
Route::get('/public/listings/most-viewed', [ListingController::class, 'mostViewed']);
Route::get('/public/listings/most-borrowed', [ListingController::class, 'mostBorrowed']);
Route::get('/public/listings/{id}', [ListingController::class, 'publicShow']);
Route::get('/public/categories', [CategoryController::class, 'index']);

/* ========== PROTECTED ROUTES (Authentication required) ========== */
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Profile
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'update']);

    // Items
    Route::apiResource('items', ItemController::class);

    // Listings
    Route::apiResource('listings', ListingController::class);

    // Loans
    Route::get('/my-loans', [LoanController::class, 'myLoans']);
    Route::post('/loans/{loan}/approve', [LoanController::class, 'approve']);
    Route::post('/loans/{loan}/reject', [LoanController::class, 'reject']);
    Route::apiResource('loans', LoanController::class);

    // Messages
    Route::get('/conversations', [MessageController::class, 'conversations']);
    Route::get('/messages/{conversation}', [MessageController::class, 'messages']);
    Route::post('/messages', [MessageController::class, 'send']);

    /* ========== ADMIN ROUTES ========== */
    Route::middleware('admin')->group(function () {
        Route::get('/admin/users', [UserController::class, 'index']);
        Route::get('/admin/users/{user}', [UserController::class, 'show']);
        Route::apiResource('admin/categories', CategoryController::class);
        // If you have ReportController:
        // Route::get('/admin/reports', [ReportController::class, 'index']);
        // Route::get('/admin/reports/{report}', [ReportController::class, 'show']);
        // Route::patch('/admin/reports/{report}', [ReportController::class, 'updateStatus']);
    });
});
