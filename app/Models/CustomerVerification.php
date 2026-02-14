<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerVerification extends Model
{
    protected $fillable = [
        'customer_id',
        'verification_type', // AGE, RUT, EMAIL
        'verification_data',
        'is_approved',
        'verified_at',
    ];

    protected $casts = [
        'verification_data' => 'array',
        'is_approved' => 'boolean',
        'verified_at' => 'datetime',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
