<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CheckoutController extends Controller
{
    public function index()
    {
        // Check if user is logged in
        $user = Auth::user();
        $isVerified = false;

        if ($user) {
            $customer = Customer::where('email', $user->email)->first();
            $isVerified = $customer ? $customer->is_verified : false;
        }

        return Inertia::render('checkout/Index', [
             'isVerified' => $isVerified,
             'customer' => $user ? [
                'name' => $user->name,
                'email' => $user->email,
                'rut' => $customer->rut ?? '',
                'birth_date' => $customer->birth_date ?? '',
             ] : null,
             'regions' => \App\Models\Region::with('communes')->get(),
        ]);
    }
}
