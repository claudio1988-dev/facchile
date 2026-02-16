<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'email',
        'rut',
        'first_name',
        'last_name',
        'birth_date',
        'phone',
        'is_active',
        'is_verified',
        'email_verified_at',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'is_active' => 'boolean',
        'is_verified' => 'boolean',
        'email_verified_at' => 'datetime',
    ];

    public function addresses()
    {
        return $this->hasMany(CustomerAddress::class);
    }

    public function verifications()
    {
        return $this->hasMany(CustomerVerification::class);
    }

    public function restrictionApprovals()
    {
        return $this->hasMany(CustomerRestrictionApproval::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function defaultShippingAddress()
    {
        return $this->hasOne(CustomerAddress::class)->where('is_default_shipping', true);
    }

    public function shippingAddress()
    {
        return $this->defaultShippingAddress();
    }

    public function defaultBillingAddress()
    {
        return $this->hasOne(CustomerAddress::class)->where('is_default_billing', true);
    }
}
