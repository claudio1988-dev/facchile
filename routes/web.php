<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/catalogo', function () {
    return Inertia::render('catalog/index');
})->name('catalog');

Route::get('/categoria/{slug}', function ($slug) {
    return Inertia::render('catalog/Category', [
        'categorySlug' => $slug
    ]);
})->name('category');

Route::get('/ofertas', function () {
    return Inertia::render('catalog/index', ['onlyOffers' => true]);
})->name('offers');

Route::get('/contacto', function () {
    return Inertia::render('support/Contact');
})->name('contact');

Route::get('/producto/{product}', [App\Http\Controllers\ProductController::class, 'show'])->name('product.show');

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
});
