<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kit extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'discount_percentage',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function items()
    {
        return $this->hasMany(KitItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Helper to calculate total value of items without discount
    public function calculateItemsTotal(): float
    {
        return $this->items->sum(function ($item) {
            return $item->productVariant->price * $item->quantity;
        });
    }
}
