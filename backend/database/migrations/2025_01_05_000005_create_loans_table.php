<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained('listings')->onUpdate('cascade')->onDelete('restrict');
            $table->foreignId('borrower_id')->constrained('users')->onUpdate('cascade')->onDelete('restrict');
            $table->dateTime('request_date')->useCurrent();
            $table->dateTime('approval_date')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->date('return_date')->nullable();
            $table->enum('status', ['requested', 'approved', 'rejected', 'borrowed', 'returned', 'cancelled'])->default('requested');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};

