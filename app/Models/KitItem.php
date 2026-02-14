<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KitItem extends Model
{
    protected $fillable = [
        'kit_id',
        'product_variant_id',
        'quantity',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    public function kit()
    {
        return $this->belongsTo(Kit::class);
    }

    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class);
    }
}
