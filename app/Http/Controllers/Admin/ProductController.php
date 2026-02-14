<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\RestrictionType;
use App\Models\ShippingClass;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::query()->with(['category', 'brand']);

        if ($request->has('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $products = $query->latest()
            ->paginate(15)
            ->through(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'category' => $product->category?->name,
                'brand' => $product->brand?->name,
                'base_price' => $product->base_price,
                'is_active' => $product->is_active,
                'is_restricted' => $product->is_restricted,
                'main_image_url' => $product->main_image_url,
                'created_at' => $product->created_at->format('d/m/Y H:i'),
            ]);

        return Inertia::render('admin/products/Index', [
            'products' => $products,
            'filters' => $request->only(['search', 'category_id', 'brand_id', 'is_active']),
            'categories' => Category::select('id', 'name')->get(),
            'brands' => Brand::select('id', 'name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/products/Create', [
            'categories' => Category::select('id', 'name')->get(),
            'brands' => Brand::select('id', 'name')->get(),
            'shippingClasses' => ShippingClass::select('id', 'name')->get(),
            'restrictionTypes' => RestrictionType::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:500',
            'slug' => 'required|string|max:500|unique:products,slug',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'shipping_class_id' => 'required|exists:shipping_classes,id',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'is_restricted' => 'boolean',
            'age_verification_required' => 'boolean',
            'main_image_url' => 'nullable|string|max:500',
            'restriction_type_ids' => 'nullable|array',
            'restriction_type_ids.*' => 'exists:restriction_types,id',
        ]);

        $product = Product::create($validated);

        if ($request->has('restriction_type_ids')) {
            $product->restrictions()->sync($request->restriction_type_ids);
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Producto creado exitosamente.');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('admin/products/Edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'category_id' => $product->category_id,
                'brand_id' => $product->brand_id,
                'shipping_class_id' => $product->shipping_class_id,
                'description' => $product->description,
                'short_description' => $product->short_description,
                'base_price' => $product->base_price,
                'is_active' => $product->is_active,
                'is_restricted' => $product->is_restricted,
                'age_verification_required' => $product->age_verification_required,
                'main_image_url' => $product->main_image_url,
                'restriction_type_ids' => $product->restrictions->pluck('id'),
                'variants' => $product->variants, // Eager loading should tackle this if 'with' was used, else implicit lazy load
            ],
            'categories' => Category::select('id', 'name')->get(),
            'brands' => Brand::select('id', 'name')->get(),
            'shippingClasses' => ShippingClass::select('id', 'name')->get(),
            'restrictionTypes' => RestrictionType::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Product $product): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:500',
            'slug' => 'required|string|max:500|unique:products,slug,'.$product->id,
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'shipping_class_id' => 'required|exists:shipping_classes,id',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'is_restricted' => 'boolean',
            'age_verification_required' => 'boolean',
            'main_image_url' => 'nullable|string|max:500',
            'restriction_type_ids' => 'nullable|array',
            'restriction_type_ids.*' => 'exists:restriction_types,id',
        ]);

        $product->update($validated);

        if ($request->has('restriction_type_ids')) {
            $product->restrictions()->sync($request->restriction_type_ids);
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Producto actualizado exitosamente.');
    }

    public function destroy(Product $product): \Illuminate\Http\RedirectResponse
    {
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Producto eliminado exitosamente.');
    }
}
