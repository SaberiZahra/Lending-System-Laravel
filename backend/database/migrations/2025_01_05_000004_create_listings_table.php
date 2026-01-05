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
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained('items')->onUpdate('cascade')->onDelete('restrict');
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->decimal('daily_fee', 10, 2)->default(0);
            $table->decimal('deposit_amount', 10, 2)->default(0);
            $table->date('available_from')->nullable();
            $table->date('available_until')->nullable();
            $table->enum('status', ['active', 'paused', 'expired'])->default('active');
            $table->unsignedBigInteger('view_count')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};

