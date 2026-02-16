<?php

use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\WebpayService;
use Illuminate\Support\Str;

// 1. Crear o buscar Cliente de prueba
$customerEmail = 'test_webpay@example.com';
$customer = Customer::firstOrCreate(
    ['email' => $customerEmail],
    [
        'first_name' => 'Webpay',
        'last_name' => 'Tester',
        'rut' => '11111111-1',
        'phone' => '+56912345678',
        'is_verified' => true
    ]
);

echo "Cliente: {$customer->first_name} {$customer->last_name} (ID: {$customer->id})\n";

// 2. Crear Dirección de prueba
$address = CustomerAddress::firstOrCreate(
    ['customer_id' => $customer->id],
    [
        'commune_id' => 1, // Usamos ID 1 que sabemos que existe
        'address_line1' => 'Calle Falsa 123',
        'is_default_shipping' => true
    ]
);

echo "Dirección ID: {$address->id}\n";

// 3. Crear Orden de prueba
$orderNumber = 'ORD-TEST-' . Str::random(6);
$amount = 10000; // Monto de prueba

$order = Order::create([
    'order_number' => $orderNumber,
    'customer_id' => $customer->id,
    'shipping_address_id' => $address->id,
    'status' => 'pending',
    'subtotal' => $amount,
    'shipping_cost' => 0,
    'tax' => 0,
    'total' => $amount,
    'payment_status' => 'pending',
    'age_verification_completed' => true,
    'metadata' => ['payment_method' => 'webpay', 'test_script' => true]
]);

echo "Orden Creada: {$order->order_number} (ID: {$order->id})\n";
echo "Monto: $ {$amount}\n";

// 4. Iniciar Transacción Webpay
echo "\nIniciando transacción con WebpayService...\n";

try {
    $webpayService = new WebpayService();
    
    // Los parámetros son: amount, buyOrder, sessionId, returnUrl
    // buyOrder debe ser único
    $buyOrder = $order->id; 
    $sessionId = session()->getId() ?? Str::random(20);
    $returnUrl = route('webpay.return');

    $response = $webpayService->initTransaction($amount, $buyOrder, $sessionId, $returnUrl);

    echo "\n✅ TRANSACCIÓN EXITOSA\n";
    echo "Token: " . $response['token'] . "\n";
    echo "URL: " . $response['url'] . "\n";
    echo "\nPuedes verificar el token manualmente si lo deseas.\n";

} catch (\Exception $e) {
    echo "\n❌ ERROR EN TRANSACCIÓN WEBPAY\n";
    echo "Mensaje: " . $e->getMessage() . "\n";
    echo "Trace:\n" . $e->getTraceAsString() . "\n";
}
