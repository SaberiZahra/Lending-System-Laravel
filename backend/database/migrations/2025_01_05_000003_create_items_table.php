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
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->onUpdate('cascade')->onDelete('restrict');
            $table->foreignId('category_id')->constrained('categories')->onUpdate('cascade')->onDelete('restrict');
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->enum('item_condition', ['new', 'like_new', 'used', 'old'])->nullable();
            $table->text('images_json')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};

