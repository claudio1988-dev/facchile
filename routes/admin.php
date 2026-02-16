<?php

use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('adminfacchile')
    ->middleware(['auth', 'verified', 'user.admin'])
    ->name('admin.')
    ->group(function () {
        // Dashboard
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // Products
        Route::resource('products', ProductController::class);

        // Categories
        Route::resource('categories', CategoryController::class);

        // Brands
        Route::resource('brands', BrandController::class);

        // Orders
        Route::get('orders/{id}/receipt', [OrderController::class, 'downloadReceipt'])->name('orders.receipt');
        Route::resource('orders', OrderController::class);

        // Customers
        Route::resource('customers', \App\Http\Controllers\Admin\CustomerController::class)->only(['index', 'show']);

        // Product Variants
        Route::apiResource('products.variants', \App\Http\Controllers\Admin\ProductVariantController::class)
            ->only(['store', 'update', 'destroy']);
    });
