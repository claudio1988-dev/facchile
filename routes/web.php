<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

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

Route::get('/producto/{slug}', [App\Http\Controllers\ProductController::class, 'show'])->name('product.show');

Route::get('/info/{slug}', function ($slug) {
    return Inertia::render('support/Informational', ['slug' => $slug]);
})->name('info');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/customer/verifications', [App\Http\Controllers\CustomerVerificationController::class, 'index'])->name('customer.verifications');
    Route::post('/customer/verifications', [App\Http\Controllers\CustomerVerificationController::class, 'store'])->name('customer.verifications.store');
    Route::get('/checkout', [App\Http\Controllers\CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout/process', [App\Http\Controllers\OrderController::class, 'store'])->name('checkout.process');
});

Route::get('/checkout/success/{order}', [App\Http\Controllers\OrderController::class, 'success'])->name('checkout.success')->middleware(['auth']);
