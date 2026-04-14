<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductVariantController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'sku' => 'nullable|string|max:100|unique:product_variants,sku',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'attributes' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $variant = $product->variants()->create($validated);

        // Auto-sync base_price to minimum variant price
        $minPrice = $product->variants()->min('price');
        if ($minPrice !== null) {
            $product->update(['base_price' => $minPrice]);
        }

        return back()->with('success', 'Variante creada exitosamente.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product, ProductVariant $variant)
    {
        $validated = $request->validate([
            'sku' => 'nullable|string|max:100|unique:product_variants,sku,' . $variant->id,
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'attributes' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $variant->update($validated);

        // Auto-sync base_price to minimum variant price
        $minPrice = $product->variants()->min('price');
        if ($minPrice !== null) {
            $product->update(['base_price' => $minPrice]);
        }

        return back()->with('success', 'Variante actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product, ProductVariant $variant)
    {
        $variant->delete();

        // Auto-sync base_price to minimum variant price (or keep current if no variants remain)
        $minPrice = $product->variants()->min('price');
        if ($minPrice !== null) {
            $product->update(['base_price' => $minPrice]);
        }

        return back()->with('success', 'Variante eliminada exitosamente.');
    }
}
