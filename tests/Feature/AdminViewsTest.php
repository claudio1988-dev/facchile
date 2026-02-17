<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Order;
use App\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Str;

class AdminViewsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_dashboard_loads_correctly()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $response = $this->actingAs($user)->get('/adminfacchile');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('admin/Dashboard'));
    }

    public function test_admin_products_index_loads_correctly()
    {
        $user = User::factory()->create(['role' => 'admin']);
        
        $brand = Brand::create(['name' => 'Brand 1', 'slug' => 'brand-1']);
        $category = Category::create(['name' => 'Category 1', 'slug' => 'category-1']);
        $shippingClass = \App\Models\ShippingClass::create([
            'name' => 'Standard', 'code' => 'TEST_STD', 'requires_special_carrier' => false
        ]);
        
        try {
            Product::create([
                'name' => 'Product 1',
                'slug' => 'product-1',
                'brand_id' => $brand->id,
                'category_id' => $category->id,
                'shipping_class_id' => $shippingClass->id,
                'base_price' => 1000,
                'is_active' => true,
                'description' => 'Desc',
                'short_description' => 'Short Desc'
            ]);
        } catch (\Exception $e) {
            dump($e->getMessage());
            throw $e;
        }

        $response = $this->actingAs($user)->get('/adminfacchile/products');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('admin/products/Index'));
    }

    public function test_admin_categories_index_loads_correctly()
    {
        $user = User::factory()->create(['role' => 'admin']);
        Category::create(['name' => 'Category 1', 'slug' => 'category-1']);

        $response = $this->actingAs($user)->get('/adminfacchile/categories');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('admin/categories/Index'));
    }

    public function test_admin_brands_index_loads_correctly()
    {
        $user = User::factory()->create(['role' => 'admin']);
        Brand::create(['name' => 'Brand 1', 'slug' => 'brand-1']);

        $response = $this->actingAs($user)->get('/adminfacchile/brands');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('admin/brands/Index'));
    }

    public function test_admin_orders_index_loads_correctly()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $customer = Customer::create([
            'email' => 'customer@test.com',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'rut' => '12345678-',
            'is_verified' => true
        ]);
        
        Order::create([
            'order_number' => 'ORD-123',
            'customer_id' => $customer->id,
            'status' => 'pending',
            'total' => 1000,
            'subtotal' => 1000,
            'tax' => 190,
            'shipping_cost' => 0,
            'payment_status' => 'pending',
            'age_verification_completed' => true
        ]);

        $response = $this->actingAs($user)->get('/adminfacchile/orders');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('admin/orders/Index'));
    }

    public function test_admin_customers_index_loads_correctly()
    {
        $user = User::factory()->create(['role' => 'admin']);
        Customer::create([
            'email' => 'customer@test.com',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'rut' => '12345678- ',
            'is_verified' => true
        ]);

        $response = $this->actingAs($user)->get('/adminfacchile/customers');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('admin/customers/Index'));
    }

    public function test_admin_customers_show_loads_correctly()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $customer = Customer::create([
            'email' => 'customer@test.com',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'rut' => '12345678-',
            'is_verified' => true
        ]);

        $response = $this->actingAs($user)->get("/adminfacchile/customers/{$customer->id}");
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('admin/customers/Show')
                 ->has('customer')
                 ->has('stats')
        );
    }

    public function test_admin_can_create_product()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $category = Category::create(['name' => 'Cat 1', 'slug' => 'cat-1']);
        $brand = Brand::create(['name' => 'Brand 1', 'slug' => 'brand-1']);
        $shippingClass = \App\Models\ShippingClass::create([
            'name' => 'Std', 'code' => 'STD', 'requires_special_carrier' => false
        ]);

        $productData = [
            'name' => 'New Product',
            'slug' => 'new-product',
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'shipping_class_id' => $shippingClass->id,
            'base_price' => 5000,
            'is_active' => true,
            'description' => 'Test Description',
        ];

        $response = $this->actingAs($user)->post('/adminfacchile/products', $productData);

        $response->assertRedirect('/adminfacchile/products');
        $this->assertDatabaseHas('products', ['slug' => 'new-product']);
    }

    public function test_admin_orders_edit_loads_correctly()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $customer = Customer::create([
            'email' => 'customer@test.com',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'rut' => '12345678-',
            'is_verified' => true
        ]);
        
        $order = Order::create([
            'order_number' => 'ORD-EDIT-1',
            'customer_id' => $customer->id,
            'status' => 'pending',
            'total' => 1000,
            'subtotal' => 1000,
            'tax' => 190,
            'shipping_cost' => 0,
            'payment_status' => 'pending',
            'age_verification_completed' => true
        ]);

        $response = $this->actingAs($user)->get("/adminfacchile/orders/{$order->id}/edit");
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('admin/orders/Edit')
                 ->has('order')
                 ->has('carriers')
        );
    }
}
