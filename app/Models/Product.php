<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'brand_id',
        'shipping_class_id',
        'name',
        'slug',
        'description',
        'short_description',
        'is_active',
        'is_restricted',
        'age_verification_required',
        'base_price',
        'main_image_url',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_restricted' => 'boolean',
        'age_verification_required' => 'boolean',
        'base_price' => 'decimal:2',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function shippingClass()
    {
        return $this->belongsTo(ShippingClass::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function attributes()
    {
        return $this->hasOne(ProductAttribute::class);
    }

    public function restrictions()
    {
        return $this->belongsToMany(RestrictionType::class, 'product_restrictions')
            ->withPivot('compliance_notes')
            ->withTimestamps();
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRestricted($query)
    {
        return $query->where('is_restricted', true);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    // Helper methods
    public function requiresAgeVerification(): bool
    {
        return $this->age_verification_required || $this->is_restricted;
    }

    public function getMinimumPrice(): float
    {
        $minVariantPrice = $this->variants()->min('price');
        return $minVariantPrice ?? $this->base_price;
    }

    public function getMaximumPrice(): float
    {
        $maxVariantPrice = $this->variants()->max('price');
        return $maxVariantPrice ?? $this->base_price;
    }

    public function isInStock(): bool
    {
        return $this->variants()->where('is_active', true)->sum('stock_quantity') > 0;
    }
}
