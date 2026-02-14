<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingClass extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'requires_special_handling',
    ];

    protected $casts = [
        'requires_special_handling' => 'boolean',
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
