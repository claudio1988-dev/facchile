<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class TrackingController extends Controller
{
    public function track(Request $request)
    {
        $request->validate([
            'order_number' => 'required|string',
        ]);

        $order = Order::with(['items.product', 'carrier', 'shippingAddress'])
            ->where('order_number', $request->order_number)
            ->first();

        if (!$order) {
            return response()->json([
                'found' => false,
                'message' => 'No encontramos un pedido con ese número. Verifica que sea correcto.',
            ], 404);
        }

        $statusLabels = [
            'pending'    => 'Pendiente',
            'confirmed'  => 'Confirmado',
            'processing' => 'En preparación',
            'shipped'    => 'Enviado',
            'delivered'  => 'Entregado',
            'cancelled'  => 'Cancelado',
        ];

        $paymentLabels = [
            'pending'  => 'Pendiente',
            'paid'     => 'Pagado',
            'failed'   => 'Fallido',
            'refunded' => 'Reembolsado',
        ];

        $metadata = $order->metadata ?? [];

        return response()->json([
            'found'          => true,
            'order_number'   => $order->order_number,
            'status'         => $order->status,
            'status_label'   => $statusLabels[$order->status] ?? ucfirst($order->status),
            'payment_status' => $order->payment_status,
            'payment_status_label' => $paymentLabels[$order->payment_status] ?? ucfirst($order->payment_status ?? 'pending'),
            'payment_method' => $metadata['payment_method'] ?? null,
            'total'          => $order->total,
            'created_at'     => $order->created_at->format('d/m/Y H:i'),
            'carrier'        => $order->carrier?->name,
            'tracking_code'  => $metadata['tracking_code'] ?? null,
            'seller_message' => $metadata['seller_message'] ?? null,
            'items_count'    => $order->items->count(),
            'items'          => $order->items->map(fn($item) => [
                'name'     => $item->product?->name ?? $item->product_name ?? 'Producto',
                'quantity' => $item->quantity,
                'price'    => $item->unit_price,
            ]),
        ]);
    }
}
