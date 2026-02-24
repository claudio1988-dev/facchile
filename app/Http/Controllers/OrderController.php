<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate complete input
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'customer.first_name' => 'required|string',
            'customer.last_name' => 'required|string',
            'customer.email' => 'required|email',
            'customer.rut' => 'nullable|string',
            'customer.phone' => 'required|string',
            'shipping_address.address_line1' => 'required|string',
            'shipping_address.address_line2' => 'nullable|string',
            'shipping_address.region_id' => 'required|exists:regions,id',
            'shipping_address.commune_id' => 'required|exists:communes,id',
            'payment_method' => 'required|string|in:webpay,transfer',
            'carrier_id' => 'nullable|exists:carriers,id',
        ]);

        try {
            DB::beginTransaction();

            // 2. Resolve Customer
            $user = Auth::user();
            $customer = null;

            if ($user) {
                $customer = Customer::where('email', $user->email)->first();
            }

            if (!$customer) {
                $customer = Customer::where('email', $validated['customer']['email'])->first();

                if (!$customer) {
                    $customer = Customer::create([
                        'first_name' => $validated['customer']['first_name'],
                        'last_name' => $validated['customer']['last_name'],
                        'email' => $validated['customer']['email'],
                        'rut' => $validated['customer']['rut'] ?? null,
                        'phone' => $validated['customer']['phone'] ?? null,
                        'is_verified' => false, 
                    ]);
                }
            } else {
                // Update phone if provided
                if ($validated['customer']['phone']) {
                    $customer->update(['phone' => $validated['customer']['phone']]);
                }
            }

            // 3. Handle Shipping Address
            $address = \App\Models\CustomerAddress::updateOrCreate(
                [
                    'customer_id' => $customer->id,
                    'address_line1' => $validated['shipping_address']['address_line1'],
                    'commune_id' => $validated['shipping_address']['commune_id'],
                ],
                [
                    'address_line2' => $validated['shipping_address']['address_line2'] ?? null,
                    'is_default_shipping' => true,
                ]
            );

            // 4. Calculate Totals & Verify Stock
            $subtotal = 0;
            $orderItemsData = [];
            $hasRestrictedItems = false;

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['id']);
                
                if ($product->is_restricted) {
                    $hasRestrictedItems = true;
                }

                $quantity = $item['quantity'];
                $price = $product->base_price;
                $lineTotal = $price * $quantity;

                $subtotal += $lineTotal;

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'sku' => $product->sku ?? 'SKU-'.$product->id, 
                    'quantity' => $quantity,
                    'unit_price' => $price,
                    'subtotal' => $lineTotal,
                ];
            }

            // 5. Verify Age Restriction if needed
            if ($hasRestrictedItems && !$customer->is_verified) {
                return redirect()->back()->withErrors([
                    'verification' => 'Se requiere verificación de edad para productos restringidos.'
                ]);
            }

            // Shipping is paid on delivery — no cost added to the order
            $netTotal = round($subtotal / 1.19);
            $tax = $subtotal - $netTotal;
            $total = $subtotal;

            // 6. Create Order
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'customer_id' => $customer->id,
                'shipping_address_id' => $address->id,
                'carrier_id' => $validated['carrier_id'] ?? null,
                'status' => 'pending',
                'subtotal' => $subtotal,
                'shipping_cost' => 0,
                'tax' => $tax,
                'total' => $total,
                'payment_status' => 'pending',
                'age_verification_completed' => $customer->is_verified,
                'metadata' => [
                    'payment_method' => $validated['payment_method'],
                    'customer_ip' => $request->ip(),
                    'shipping_mode' => 'paid_on_delivery',
                    'carrier_id' => $validated['carrier_id'] ?? null,
                ]
            ]);

            // 7. Create Order Items
            foreach ($orderItemsData as $itemData) {
                $itemData['order_id'] = $order->id;
                OrderItem::create($itemData);
            }

            DB::commit();

            // 8. Logic for Redirect based on Payment Method
            if ($validated['payment_method'] === 'webpay') {
                // Redirect to our Webpay Controller to initiate transaction
                return Inertia::location(route('webpay.start', ['order' => $order->id]));
            }

            // For bank transfer, redirect to success page
            return Inertia::location(route('checkout.success', ['order' => $order->order_number]));

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors([
                'checkout' => 'Ocurrió un error al procesar tu pedido. Por favor, intenta nuevamente.'
            ]);
        }
    }

    public function success($orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->with('items.product')->firstOrFail();
        
        return Inertia::render('checkout/Success', [
            'order' => $order
        ]);
    }
}
