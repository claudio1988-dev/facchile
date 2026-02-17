<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertOk();
    }

    public function test_dashboard_displays_recent_orders()
    {
        $user = User::factory()->create();
        $customer = \App\Models\Customer::create([
            'email' => $user->email,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'rut' => '11111111-1',
            'is_verified' => true
        ]);
        
        // Create 5 orders
        for ($i = 0; $i < 5; $i++) {
            \App\Models\Order::create([
                'order_number' => "ORD-{$i}",
                'customer_id' => $customer->id,
                'status' => 'pending',
                'total' => 1000,
                'subtotal' => 1000,
                'tax' => 190,
                'shipping_cost' => 0,
                'payment_status' => 'pending',
                'age_verification_completed' => true
            ]);
        }
        
        $this->actingAs($user);
        $response = $this->get(route('dashboard'));
        
        $response->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('recentOrders', 5)
        );
    }
}
