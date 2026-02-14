<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'customer_id',
        'shipping_address_id',
        'carrier_id',
        'status',
        'subtotal',
        'shipping_cost',
        'tax',
        'total',
        'actual_weight_kg',
        'volumetric_weight_kg',
        'age_verification_completed',
        'payment_gateway_id',
        'payment_status',
        'metadata',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
        'actual_weight_kg' => 'decimal:3',
        'volumetric_weight_kg' => 'decimal:3',
        'age_verification_completed' => 'boolean',
        'metadata' => 'array',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function shippingAddress()
    {
        return $this->belongsTo(CustomerAddress::class, 'shipping_address_id');
    }

    public function carrier()
    {
        return $this->belongsTo(Carrier::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
