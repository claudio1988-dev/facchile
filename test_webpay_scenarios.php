<?php

use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Services\WebpayService;
use Illuminate\Support\Str;
use Transbank\Webpay\WebpayPlus\Exceptions\TransactionCreateException;

function runTest($scenarioName, $amount, $customerData, $expectSuccess = true) {
    echo "\n--------------------------------------------------\n";
    echo "🧪 Test Scenario: $scenarioName\n";
    echo "--------------------------------------------------\n";

    try {
        // 1. Cliente
        $customer = Customer::updateOrCreate(
            ['email' => $customerData['email']],
            array_merge($customerData, ['is_verified' => true])
        );
        echo "👤 Cliente: {$customer->first_name} {$customer->last_name}\n";

        // 2. Dirección
        $address = CustomerAddress::firstOrCreate(
            ['customer_id' => $customer->id],
            ['commune_id' => 1, 'address_line1' => 'Test Street', 'is_default_shipping' => true]
        );

        // 3. Orden
        $orderNumber = 'ORD-' . strtoupper(Str::random(8));
        $order = Order::create([
            'order_number' => $orderNumber,
            'customer_id' => $customer->id,
            'shipping_address_id' => $address->id,
            'status' => 'pending',
            'subtotal' => $amount,
            // 'shipping_cost' y 'tax' simplificados para el test
            'shipping_cost' => 0, 'tax' => 0, 'total' => $amount,
            'payment_status' => 'pending',
            'age_verification_completed' => true,
            'metadata' => ['scenario' => $scenarioName]
        ]);
        echo "🛒 Orden: {$order->order_number} (Monto: $ {$amount})\n";

        // 4. Webpay
        $webpayService = new WebpayService();
        $buyOrder = $order->id; // Usamos ID para integracion
        $sessionId = Str::random(20);
        $returnUrl = 'http://localhost/webpay/return';

        echo "💳 Iniciando transacción...\n";
        $response = $webpayService->initTransaction($amount, $buyOrder, $sessionId, $returnUrl);

        if ($expectSuccess) {
            echo "✅ ÉXITO: Token recibido: " . substr($response['token'], 0, 15) . "...\n";
            echo "🔗 URL: {$response['url']}\n";
        } else {
            echo "⚠️ INESPERADO: Se esperaba fallo pero fue exitoso.\n";
        }

    } catch (\Exception $e) {
        if (!$expectSuccess) {
             echo "✅ ÉXITO (Error esperado): " . $e->getMessage() . "\n";
        } else {
             echo "❌ FALLO: " . $e->getMessage() . "\n";
             // echo $e->getTraceAsString(); // Descomentar para debug
        }
    }
}

// Escenario 1: Compra Normal
runTest('Compra Estándar', 25000, [
    'email' => 'normal@test.com', 'first_name' => 'Juan', 'last_name' => 'Pérez', 'rut' => '11111111-1', 'phone' => '911111111'
]);

// Escenario 2: Monto Grande
runTest('Monto Alto ($1.5M)', 1500000, [
    'email' => 'millonario@test.com', 'first_name' => 'Ricky', 'last_name' => 'Rich', 'rut' => '22222222-2', 'phone' => '922222222'
]);

// Escenario 3: Monto Mínimo ($500 - Webpay a veces rechaza < $500, pero probemos)
runTest('Monto Mínimo ($500)', 500, [
    'email' => 'ahorrador@test.com', 'first_name' => 'Aho', 'last_name' => 'Rrador', 'rut' => '33333333-3', 'phone' => '933333333'
]);

// Escenario 4: Cliente con caracteres especiales
runTest('Cliente Caracteres Especiales', 12345, [
    'email' => 'ene@test.com', 'first_name' => 'María José', 'last_name' => 'Núñez', 'rut' => '44444444-4', 'phone' => '944444444'
]);

// Escenario 5: Monto Cero (Debería fallar)
// Webpay no permite montos <= 0
runTest('Monto Cero (Debe Fallar)', 0, [
    'email' => 'gratis@test.com', 'first_name' => 'Gratis', 'last_name' => 'Man', 'rut' => '55555555-5', 'phone' => '955555555'
], false);

echo "\n--------------------------------------------------\n";
echo "🎉 Fin de Pruebas de Escenarios\n";
echo "--------------------------------------------------\n";
