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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('full_name', 150);
            $table->string('username', 100)->unique();
            $table->string('email', 150)->nullable()->unique();
            $table->string('phone', 30)->nullable();
            $table->string('password_hash', 255);
            $table->string('profile_image', 255)->nullable();
            $table->float('trust_score')->default(0);
            $table->tinyInteger('role')->default(0)->comment('0=user, 1=admin');
            $table->text('address')->nullable();
            $table->enum('status', ['active', 'suspended', 'banned'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

