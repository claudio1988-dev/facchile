<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\WebpayController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'featuredProducts' => \App\Models\Product::with(['brand', 'category'])
            ->where('is_active', true)
            ->latest()
            ->take(8)
            ->get()
    ]);
})->name('home');

Route::get('/catalogo', [App\Http\Controllers\CatalogController::class, 'index'])->name('catalog');

Route::get('/categoria/{slug}', [App\Http\Controllers\CatalogController::class, 'category'])->name('category');

Route::get('/ofertas', [App\Http\Controllers\CatalogController::class, 'index'])->name('offers');

Route::get('/contacto', function () {
    return Inertia::render('support/Contact');
})->name('contact');

Route::get('/tracking', function () {
    return Inertia::render('support/Informational', ['slug' => 'tracking']);
})->name('tracking');

Route::get('/despacho', function () {
    return Inertia::render('support/Informational', ['slug' => 'despacho']);
})->name('shipping');

Route::get('/garantias', function () {
    return Inertia::render('support/Informational', ['slug' => 'garantias']);
})->name('warranty');

Route::get('/producto/{slug}', [App\Http\Controllers\ProductController::class, 'show'])->name('product.show');

// Public order tracking (no auth required)
Route::post('/api/tracking', [App\Http\Controllers\TrackingController::class, 'track'])
    ->name('tracking.lookup')
    ->middleware('throttle:6,1'); // Limit 6 requests per minute

// Shipping calculation
Route::post('/api/shipping/calculate', [App\Http\Controllers\ShippingController::class, 'calculate'])
    ->name('shipping.calculate');

Route::get('/info/{slug}', function ($slug) {
    return Inertia::render('support/Informational', ['slug' => $slug]);
})->name('info');

Route::get('dashboard', function () {
    $user = auth()->user();
    $recentOrders = [];
    
    // Assuming User has One-to-One with Customer or similar relation
    // Check if user is linked to a customer profile
    if ($user->customer) {
        $recentOrders = $user->customer->orders()
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'total' => $order->total,
                'created_at' => $order->created_at->format('d/m/Y'),
                'items_count' => $order->items_count ?? $order->items()->count(),
            ]);
    }

    return Inertia::render('dashboard', [
        'recentOrders' => $recentOrders
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/customer/verifications', [App\Http\Controllers\CustomerVerificationController::class, 'index'])->name('customer.verifications');
    Route::post('/customer/verifications', [App\Http\Controllers\CustomerVerificationController::class, 'store'])->name('customer.verifications.store');
    
    // Customer Portal
    Route::get('/customer/orders', [App\Http\Controllers\CustomerController::class, 'orders'])->name('customer.orders');
    Route::get('/customer/orders/{order}', [App\Http\Controllers\CustomerController::class, 'orderDetail'])->name('customer.orders.detail');
    Route::get('/customer/addresses', [App\Http\Controllers\CustomerController::class, 'addresses'])->name('customer.addresses');
    Route::post('/customer/addresses', [App\Http\Controllers\CustomerController::class, 'storeAddress'])->name('customer.addresses.store');
    Route::get('/customer/favorites', [App\Http\Controllers\CustomerController::class, 'favorites'])->name('customer.favorites');

    Route::get('/checkout', [App\Http\Controllers\CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout/process', [App\Http\Controllers\OrderController::class, 'store'])->name('checkout.process');
    // Webpay routes added here
    Route::get('/webpay/pay/{order}', [WebpayController::class, 'start'])->name('webpay.start');
    Route::any('/webpay/return', [WebpayController::class, 'callback'])->name('webpay.return'); // Transbank does POST, sometimes GET
});

Route::get('/checkout/success/{order}', [App\Http\Controllers\OrderController::class, 'success'])->name('checkout.success')->middleware(['auth']);
