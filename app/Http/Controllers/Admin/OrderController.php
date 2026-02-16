<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = \App\Models\Order::with(['customer', 'carrier']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where('order_number', 'like', '%' . $request->search . '%')
                  ->orWhereHas('customer', function($q) use ($request) {
                      $q->where('email', 'like', '%' . $request->search . '%')
                        ->orWhere('rut', 'like', '%' . $request->search . '%');
                  });
        }

        $orders = $query->latest()->paginate(20)
            ->through(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer' => $order->customer ? $order->customer->first_name . ' ' . $order->customer->last_name : 'Guest',
                'status' => $order->status,
                'total' => $order->total,
                'created_at' => $order->created_at->format('d/m/Y H:i'),
                'items_count' => $order->items_count ?? $order->items()->count(),
            ]);

        return \Inertia\Inertia::render('admin/orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $order = \App\Models\Order::with(['customer', 'items.productVariant.product', 'shippingAddress.commune.region', 'carrier'])
            ->findOrFail($id);

        return \Inertia\Inertia::render('admin/orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'subtotal' => $order->subtotal,
                'shipping_cost' => $order->shipping_cost,
                'tax' => $order->tax,
                'total' => $order->total,
                'created_at' => $order->created_at->format('d/m/Y H:i'),
                'customer' => $order->customer,
                'shipping_address' => $order->shippingAddress ? array_merge($order->shippingAddress->toArray(), [
                    'commune_name' => $order->shippingAddress->commune->name,
                    'region_name' => $order->shippingAddress->commune->region->name,
                ]) : null,
                'carrier' => $order->carrier,
                'items' => $order->items->map(fn($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'sku' => $item->sku,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->subtotal,
                    'image_url' => $item->productVariant?->product?->main_image_url,
                ]),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $order = \App\Models\Order::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'nullable|in:pending,paid,failed,refunded',
        ]);

        // Logic check: if cancelling, restore stock?
        // Ideally use OrderService here, but for simple status update:
        $previousStatus = $order->status;
        
        $order->update($validated);

        if ($validated['status'] === 'cancelled' && $previousStatus !== 'cancelled') {
             // Use InventoryService to restore stock
             // For now, manual implementation or call service
             $itemsToRestore = $order->items->map(fn($item) => [
                 'variant_id' => $item->product_variant_id,
                 'quantity' => $item->quantity
             ])->filter(fn($i) => $i['variant_id'])->toArray();
             
             try {
                 (new \App\Services\InventoryService())->restoreStock($itemsToRestore);
             } catch (\Exception $e) {
                 return back()->with('error', 'Error restaurando stock: ' . $e->getMessage());
             }
        }

        return back()->with('success', 'Orden actualizada exitosamente.');
    }

    public function downloadReceipt($id)
    {
        $order = \App\Models\Order::with(['customer', 'items.productVariant.product', 'shippingAddress.commune.region', 'carrier'])
            ->findOrFail($id);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.receipt', compact('order'));

        return $pdf->download('comprobante-orden-' . $order->order_number . '.pdf');
    }
}
