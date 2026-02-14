<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerRestrictionApproval extends Model
{
    protected $fillable = [
        'customer_id',
        'product_restriction_id',
        'is_approved',
        'approved_at',
        'approved_by_user_id',
        'notes',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // This refers to the pivot ID in 'product_restrictions' table as per migration
    // However, it might be more useful to link to the RestrictionType in logic
    public function productRestriction()
    {
        // Since product_restrictions is a pivot table, we can't easily model it unless we make a Pivot Model
        // For now, we assume we might need a ProductRestriction model if we want to meaningfuly link this.
        // Or we treat it as an ID.
        return $this->belongsTo(ProductRestriction::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by_user_id');
    }
}
