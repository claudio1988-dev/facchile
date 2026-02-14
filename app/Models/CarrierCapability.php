<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarrierCapability extends Model
{
    protected $fillable = [
        'carrier_id',
        'shipping_class_id',
        'is_supported',
    ];

    protected $casts = [
        'is_supported' => 'boolean',
    ];

    public function carrier()
    {
        return $this->belongsTo(Carrier::class);
    }

    public function shippingClass()
    {
        return $this->belongsTo(ShippingClass::class);
    }
}
