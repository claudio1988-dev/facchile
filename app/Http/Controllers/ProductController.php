<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display the specified product.
     */
    public function show(string $slug): Response
    {
        $product = Product::where('slug', $slug)->firstOrFail();
        
        // Load relationships
        $product->load(['category', 'brand', 'shippingClass', 'variants']);

        return Inertia::render('catalog/ProductDetail', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'short_description' => $product->short_description,
                'base_price' => $product->base_price,
                'is_active' => $product->is_active,
                'is_restricted' => $product->is_restricted,
                'age_verification_required' => $product->age_verification_required,
                'main_image_url' => $product->main_image_url,
                'stock' => $product->variants->sum('stock_quantity'),
                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                    'slug' => $product->category->slug,
                ] : null,
                'brand' => $product->brand ? [
                    'id' => $product->brand->id,
                    'name' => $product->brand->name,
                    'slug' => $product->brand->slug,
                ] : null,
                'shipping_class' => $product->shippingClass ? [
                    'id' => $product->shippingClass->id,
                    'name' => $product->shippingClass->name,
                    'code' => $product->shippingClass->code,
                ] : null,
                'variants' => $product->variants->map(function ($variant) {
                    return [
                        'id' => $variant->id,
                        'sku' => $variant->sku,
                        'price' => $variant->price,
                        'stock_quantity' => $variant->stock_quantity,
                        'is_active' => $variant->is_active,
                        'attributes' => $variant->variant_attributes,
                    ];
                }),
            ],
        ]);
    }
}
