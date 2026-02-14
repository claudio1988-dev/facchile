<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RestrictionType extends Model
{
    protected $fillable = [
        'code',
        'name',
        'description',
        'minimum_age',
        'requires_rut_validation',
    ];

    protected $casts = [
        'minimum_age' => 'integer',
        'requires_rut_validation' => 'boolean',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_restrictions')
            ->withPivot('compliance_notes')
            ->withTimestamps();
    }
}
