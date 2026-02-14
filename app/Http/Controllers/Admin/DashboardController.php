<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(): \Inertia\Response
    {
        $stats = [
            'total_products' => \App\Models\Product::count(),
            'active_products' => \App\Models\Product::where('is_active', true)->count(),
            'total_categories' => \App\Models\Category::count(),
            'total_brands' => \App\Models\Brand::count(),
            'recent_products' => \App\Models\Product::with(['category', 'brand'])
                ->latest()
                ->take(5)
                ->get()
                ->map(fn ($product) => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category?->name,
                    'brand' => $product->brand?->name,
                    'price' => $product->base_price,
                    'is_active' => $product->is_active,
                    'created_at' => $product->created_at->format('d/m/Y'),
                ]),
        ];

        return \Inertia\Inertia::render('admin/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
