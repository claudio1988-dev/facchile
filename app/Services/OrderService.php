<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

class OrderService
{
    protected $inventoryService;
    protected $shippingService;

    public function __construct(InventoryService $inventoryService, ShippingService $shippingService)
    {
        $this->inventoryService = $inventoryService;
        $this->shippingService = $shippingService;
    }

    /**
     * Create a new order.
     *
     * @param Customer $customer
     * @param array $data Contains details items, address_id, carrier_id, payment info
     * @return Order
     * @throws Exception
     */
    public function createOrder(Customer $customer, array $data): Order
    {
        return DB::transaction(function () use ($customer, $data) {
            // 1. Prepare items for stock check
            $stockCheckItems = [];
            foreach ($data['items'] as $item) {
                $stockCheckItems[] = [
                    'variant_id' => $item['variant_id'],
                    'quantity' => $item['quantity']
                ];
            }

            // 2. Decrement stock (will throw exception if insufficient)
            $this->inventoryService->decrementStock($stockCheckItems);

            // 3. Create Order
            $order = new Order();
            $order->order_number = 'ORD-' . strtoupper(Str::random(10)); // Simple generator, replace with sequence if needed
            $order->customer_id = $customer->id;
            $order->shipping_address_id = $data['shipping_address_id'];
            $order->carrier_id = $data['carrier_id'];
            $order->status = 'pending';
            $order->payment_status = 'pending';
            
            // Financials (Should be re-calculated here for security, don't trust frontend)
            // For brevity, we assume validated inputs, but in production re-fetch prices
            $subtotal = 0;
            $orderItems = [];

            foreach ($data['items'] as $itemData) {
                // Re-fetch variant to get price
                $variant = \App\Models\ProductVariant::find($itemData['variant_id']);
                $lineTotal = $variant->price * $itemData['quantity'];
                $subtotal += $lineTotal;

                $orderItems[] = new OrderItem([
                    'product_variant_id' => $variant->id,
                    'product_name' => $variant->product->name . ' - ' . $variant->name,
                    'sku' => $variant->sku,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $variant->price,
                    'subtotal' => $lineTotal,
                    'snapshot_data' => $variant->toArray(), // Save snapshot
                ]);
            }

            $order->subtotal = $subtotal;
            // Shipping cost should be calculated or passed passed from validated step
            $order->shipping_cost = $data['shipping_cost'] ?? 0; 
            $order->tax = $subtotal * 0.19; // VAT Chile 19%
            $order->total = $subtotal + $order->shipping_cost + $order->tax;

            $order->save();

            // 4. Save items
            $order->items()->saveMany($orderItems);

            return $order;
        });
    }
}
