<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    use HasFactory;

    public $timestamps = false; // Disable timestamps since table doesn't have updated_at

    protected $fillable = [
        'listing_id',
        'borrower_id',
        'request_date',
        'approval_date',
        'start_date',
        'end_date',
        'return_date',
        'status',
    ];

    protected $casts = [
        'request_date'  => 'datetime',
        'approval_date' => 'datetime',
        'start_date'    => 'date',
        'end_date'      => 'date',
        'return_date'   => 'date',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    public function borrower()
    {
        return $this->belongsTo(User::class, 'borrower_id');
    }
}
