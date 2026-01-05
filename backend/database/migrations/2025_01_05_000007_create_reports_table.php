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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->constrained('users')->onUpdate('cascade')->onDelete('restrict');
            $table->foreignId('target_user_id')->nullable()->constrained('users')->onUpdate('cascade')->onDelete('set null');
            $table->foreignId('target_item_id')->nullable()->constrained('items')->onUpdate('cascade')->onDelete('set null');
            $table->foreignId('target_listing_id')->nullable()->constrained('listings')->onUpdate('cascade')->onDelete('set null');
            $table->foreignId('target_loan_id')->nullable()->constrained('loans')->onUpdate('cascade')->onDelete('set null');
            $table->enum('type', ['user', 'item', 'listing', 'loan']);
            $table->text('description')->nullable();
            $table->json('evidence_json')->nullable();
            $table->enum('status', ['pending', 'reviewed', 'dismissed'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};

