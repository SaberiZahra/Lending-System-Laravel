<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $table = 'users';

    protected $fillable = [
        'full_name',
        'username',
        'email',
        'phone',
        'password_hash',
        'profile_image',
        'trust_score',
        'role',
        'address',
        'status',
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    protected $visible = [];

    protected $casts = [
        'trust_score' => 'float',
        'role' => 'integer',
    ];

    /* ===================== RELATIONS ===================== */

    public function items()
    {
        return $this->hasMany(Item::class, 'owner_id');
    }

    public function loans()
    {
        return $this->hasMany(Loan::class, 'borrower_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /* ===================== HELPERS ===================== */

    public function isAdmin(): bool
    {
        return $this->role === 1;
    }

    public function conversations()
    {
        return $this->belongsToMany(Conversation::class, 'conversation_participants');
    }
}
