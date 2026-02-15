<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingClass extends Model
{
    protected $fillable = [
        'name',
        'code',
        'description',
        'allows_home_delivery',
        'requires_special_carrier',
    ];

    protected $casts = [
        'allows_home_delivery' => 'boolean',
        'requires_special_carrier' => 'boolean',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function carrierCapabilities()
    {
        return $this->hasMany(CarrierCapability::class);
    }

    public function carriers()
    {
        return $this->belongsToMany(Carrier::class, 'carrier_capabilities')
            ->withPivot('is_supported')
            ->withTimestamps();
    }
}
