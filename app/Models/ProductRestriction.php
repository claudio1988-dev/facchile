<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ProductRestriction extends Pivot
{
    protected $table = 'product_restrictions';

    public $incrementing = true;

    protected $fillable = [
        'product_id',
        'restriction_type_id',
        'compliance_notes',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function restrictionType()
    {
        return $this->belongsTo(RestrictionType::class);
    }
}
