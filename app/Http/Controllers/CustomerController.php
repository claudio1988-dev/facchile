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
                'metadata' => $order->metadata,
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
        $user = auth()->user();
        $customer = \App\Models\Customer::where('email', $user->email)->first();

        if (!$customer) {
            return redirect()->route('dashboard');
        }

        $addresses = \App\Models\CustomerAddress::where('customer_id', $customer->id)
            ->with(['commune.region'])
            ->get()
            ->map(fn($addr) => [
                'id' => $addr->id,
                'name' => $addr->address_line1, // Using address_line1 as name for now
                'address_line1' => $addr->address_line1,
                'address_line2' => $addr->address_line2,
                'commune_name' => $addr->commune->name,
                'region_name' => $addr->commune->region->name,
                'is_default' => $addr->is_default_shipping,
            ]);

        return Inertia::render('customer/Addresses', [
            'addresses' => $addresses,
            'regions' => \App\Models\Region::with('communes')->get(),
        ]);
    }

    public function storeAddress(Request $request)
    {
        $user = auth()->user();
        $customer = \App\Models\Customer::where('email', $user->email)->first();

        if (!$customer) {
            return back()->withErrors(['error' => 'No se encontró el perfil de cliente.']);
        }

        $validated = $request->validate([
            'address_line1' => 'required|string|max:500',
            'address_line2' => 'nullable|string|max:500',
            'commune_id' => 'required|exists:communes,id',
            'is_default' => 'boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            \App\Models\CustomerAddress::where('customer_id', $customer->id)->update(['is_default_shipping' => false]);
        }

        \App\Models\CustomerAddress::create([
            'customer_id' => $customer->id,
            'commune_id' => $validated['commune_id'],
            'address_line1' => $validated['address_line1'],
            'address_line2' => $validated['address_line2'],
            'is_default_shipping' => $validated['is_default'] ?? false,
        ]);

        return back();
    }

    public function favorites()
    {
        // For now, return empty until Favorite model/table is implemented
        return Inertia::render('customer/Favorites', [
            'favorites' => []
        ]);
    }
}
