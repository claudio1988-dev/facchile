<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function index(): Response
    {
        $brands = Brand::withCount('products')
            ->latest()
            ->get()
            ->map(fn ($brand) => [
                'id' => $brand->id,
                'name' => $brand->name,
                'slug' => $brand->slug,
                'products_count' => $brand->products_count,
                'created_at' => $brand->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('admin/brands/Index', [
            'brands' => $brands,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/brands/Create');
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:brands,slug',
        ]);

        Brand::create($validated);

        return redirect()->route('admin.brands.index')
            ->with('success', 'Marca creada exitosamente.');
    }

    public function edit(Brand $brand): Response
    {
        return Inertia::render('admin/brands/Edit', [
            'brand' => [
                'id' => $brand->id,
                'name' => $brand->name,
                'slug' => $brand->slug,
            ],
        ]);
    }

    public function update(Request $request, Brand $brand): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:brands,slug,'.$brand->id,
        ]);

        $brand->update($validated);

        return redirect()->route('admin.brands.index')
            ->with('success', 'Marca actualizada exitosamente.');
    }

    public function destroy(Brand $brand): \Illuminate\Http\RedirectResponse
    {
        if ($brand->products()->count() > 0) {
            return redirect()->route('admin.brands.index')
                ->with('error', 'No se puede eliminar una marca con productos asociados.');
        }

        $brand->delete();

        return redirect()->route('admin.brands.index')
            ->with('success', 'Marca eliminada exitosamente.');
    }
}
