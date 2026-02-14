<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carrier extends Model
{
    protected $fillable = [
        'name',
        'code',
        'api_endpoint',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function shippingZones()
    {
        return $this->hasMany(ShippingZone::class);
    }

    public function capabilities()
    {
        return $this->hasMany(CarrierCapability::class);
    }

    public function shippingClasses()
    {
        return $this->belongsToMany(ShippingClass::class, 'carrier_capabilities')
            ->withPivot('is_supported')
            ->withTimestamps();
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
