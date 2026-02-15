<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Order;
use App\Models\User;
use App\Services\WebpayService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Mockery;
use Tests\TestCase;

class WebpayTest extends TestCase
{
    use RefreshDatabase;

    public function test_webpay_start_redirects_to_payment_gateway()
    {
        // 1. Arrange
        $user = User::factory()->create();
        $customer = Customer::create([
            'email' => $user->email,
            'first_name' => 'Test',
            'last_name' => 'User',
            'rut' => '12.345.678-9',
            'is_verified' => true,
        ]);
        
        $order = Order::create([
            'order_number' => 'ORD-TEST-12345',
            'customer_id' => $customer->id,
            'status' => 'pending',
            'payment_status' => 'pending',
            'subtotal' => 10000,
            'total' => 10000,
            'tax' => 1900,
            'shipping_cost' => 0,
            'age_verification_completed' => true,
        ]);

        // Mock WebpayService
        $mockWebpayService = Mockery::mock(WebpayService::class);
        $mockWebpayService->shouldReceive('initTransaction')
            ->once()
            ->with((int)$order->total, $order->order_number, Mockery::any(), Mockery::any())
            ->andReturn([
                'url' => 'https://webpay.example.com/pay',
                'token' => 'fake_token_123'
            ]);

        $this->app->instance(WebpayService::class, $mockWebpayService);

        // 2. Act
        $response = $this->actingAs($user)->get(route('webpay.start', $order));

        // 3. Assert
        $response->assertStatus(200);
        $response->assertViewIs('webpay.redirect');
        $response->assertViewHas('url', 'https://webpay.example.com/pay');
        $response->assertViewHas('token', 'fake_token_123');
    }

    public function test_webpay_callback_success_updates_order()
    {
        // 1. Arrange
        $user = User::factory()->create();
        $customer = Customer::create([
            'email' => $user->email,
            'first_name' => 'Test',
            'last_name' => 'User',
            'rut' => '12.345.678-9',
            'is_verified' => true,
        ]);
        
        $order = Order::create([
            'order_number' => 'ORD-TEST-12345',
            'customer_id' => $customer->id,
            'status' => 'pending',
            'payment_status' => 'pending',
            'subtotal' => 10000,
            'total' => 10000,
            'tax' => 1900,
            'shipping_cost' => 0,
            'age_verification_completed' => true,
        ]);

        // Mock Webpay response object
        $mockResponse = Mockery::mock('Transbank\Webpay\WebpayPlus\Responses\TransactionCommitResponse');
        $mockResponse->shouldReceive('isApproved')->andReturn(true);
        $mockResponse->shouldReceive('getBuyOrder')->andReturn($order->order_number);
        $mockResponse->shouldReceive('getAuthorizationCode')->andReturn('123456');
        $mockResponse->shouldReceive('getCardDetail')->andReturn(['card_number' => '****1234']);
        $mockResponse->shouldReceive('getTransactionDate')->andReturn('2024-01-01 12:00:00');

        // Mock WebpayService
        $mockWebpayService = Mockery::mock(WebpayService::class);
        $mockWebpayService->shouldReceive('commitTransaction')
            ->once()
            ->with('fake_token_123')
            ->andReturn($mockResponse);

        $this->app->instance(WebpayService::class, $mockWebpayService);

        // 2. Act
        // Transbank can POST or GET to the return URL
        $response = $this->actingAs($user)->post(route('webpay.return'), [
            'token_ws' => 'fake_token_123'
        ]);

        // 3. Assert
        $order->refresh();
        $this->assertEquals('paid', $order->payment_status);
        $this->assertEquals('processing', $order->status); // Or whatever status means confirmed
        $response->assertRedirect(route('checkout.success', $order->order_number));
    }

    public function test_webpay_callback_rejection_redirects_to_catalog()
    {
        // 1. Arrange
        $user = User::factory()->create();
        
        // Mock Webpay response object (Failed)
        $mockResponse = Mockery::mock('Transbank\Webpay\WebpayPlus\Responses\TransactionCommitResponse');
        $mockResponse->shouldReceive('isApproved')->andReturn(false);

        // Mock WebpayService
        $mockWebpayService = Mockery::mock(WebpayService::class);
        $mockWebpayService->shouldReceive('commitTransaction')
            ->once()
            ->with('fake_token_fail')
            ->andReturn($mockResponse);

        $this->app->instance(WebpayService::class, $mockWebpayService);

        // 2. Act
        $response = $this->actingAs($user)->post(route('webpay.return'), [
            'token_ws' => 'fake_token_fail'
        ]);

        // 3. Assert
        $response->assertRedirect(route('catalog'));
        $response->assertSessionHas('error');
    }
}
