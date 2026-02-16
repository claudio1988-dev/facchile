<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;

class CustomerController extends Controller
{
    public function orders()
    {
        $user = auth()->user();
        $customer = \App\Models\Customer::where('email', $user->email)->first();

        if (!$customer) {
            return Inertia::render('customer/Orders', [
                'orders' => []
            ]);
        }

        $orders = Order::where('customer_id', $customer->id)
            ->latest()
            ->get()
            ->map(fn($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'total' => (float) $order->total,
                'created_at' => $order->created_at->format('d/m/Y H:i'),
                'items_count' => $order->items()->count(),
            ]);

        return Inertia::render('customer/Orders', [
            'orders' => $orders
        ]);
    }

    public function orderDetail(Order $order)
    {
        // Authenticate ownership
        $user = auth()->user();
        $customer = \App\Models\Customer::where('email', $user->email)->first();

        if (!$customer || $order->customer_id !== $customer->id) {
            abort(403);
        }

        $order->load(['items.product', 'shippingAddress.commune.region']);

        return Inertia::render('customer/OrderDetail', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'total' => (float) $order->total,
                'subtotal' => (float) $order->subtotal,
                'tax' => (float) $order->tax,
                'shipping_cost' => (float) $order->shipping_cost,
                'created_at' => $order->created_at->format('d/m/Y H:i'),
                'payment_status' => $order->payment_status,
                'items' => $order->items->map(fn($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'sku' => $item->sku,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'subtotal' => (float) $item->subtotal,
                    'main_image_url' => $item->product?->main_image_url,
                ]),
                'shipping_address' => [
                    'line1' => $order->shippingAddress->address_line1,
                    'line2' => $order->shippingAddress->address_line2,
                    'commune' => $order->shippingAddress->commune->name,
                    'region' => $order->shippingAddress->commune->region->name,
                ]
            ]
        ]);
    }

    public function addresses()
    {
        // For now, return empty or mock data until Address model/table is fully functional for customers
        return Inertia::render('customer/Addresses', [
            'addresses' => []
        ]);
    }

    public function favorites()
    {
        // For now, return empty until Favorite model/table is implemented
        return Inertia::render('customer/Favorites', [
            'favorites' => []
        ]);
    }
}
