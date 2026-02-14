<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commune extends Model
{
    protected $fillable = [
        'region_id',
        'name',
        'code',
        'is_extreme_zone',
    ];

    protected $casts = [
        'is_extreme_zone' => 'boolean',
    ];

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function shippingZones()
    {
        return $this->hasMany(ShippingZone::class);
    }

    public function customerAddresses()
    {
        return $this->hasMany(CustomerAddress::class);
    }
}
