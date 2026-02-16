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
            'total_orders' => \App\Models\Order::count(),
            'total_revenue' => \App\Models\Order::where('payment_status', 'paid')->sum('total'), // Assuming 'paid' status exists or adjust logic
            'low_stock_products' => \App\Models\Product::whereHas('variants', function ($query) {
                $query->where('stock_quantity', '<=', 5);
            })->with(['variants' => function ($query) {
                $query->where('stock_quantity', '<=', 5);
            }])->take(5)->get()->map(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'variants' => $product->variants->map(fn ($v) => [
                    'name' => $v->name,
                    'stock' => $v->stock_quantity,
                ]),
            ]),
            'recent_orders' => \App\Models\Order::with('customer')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn ($order) => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer' => $order->customer ? $order->customer->first_name . ' ' . $order->customer->last_name : 'Invitado',
                    'total' => $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at->format('d/m/Y H:i'),
                ]),
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
