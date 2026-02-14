<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingZone extends Model
{
    protected $fillable = [
        'commune_id',
        'carrier_id',
        'base_rate',
        'per_kg_rate',
        'extreme_zone_surcharge',
        'estimated_days_min',
        'estimated_days_max',
    ];

    protected $casts = [
        'base_rate' => 'decimal:2',
        'per_kg_rate' => 'decimal:2',
        'extreme_zone_surcharge' => 'decimal:2',
        'estimated_days_min' => 'integer',
        'estimated_days_max' => 'integer',
    ];

    public function commune()
    {
        return $this->belongsTo(Commune::class);
    }

    public function carrier()
    {
        return $this->belongsTo(Carrier::class);
    }
}
