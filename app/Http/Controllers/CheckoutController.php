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
                'phone' => $customer->phone ?? '',
                'addresses' => isset($customer) && $customer ? $customer->addresses()->with(['commune.region'])->get()->map(function($address) {
                    return [
                        'id' => $address->id,
                        'address_line1' => $address->address_line1,
                        'address_line2' => $address->address_line2,
                        'region_id' => $address->commune && $address->commune->region ? $address->commune->region->id : null,
                        'commune_id' => $address->commune_id,
                        'region_name' => $address->commune && $address->commune->region ? $address->commune->region->name : '',
                        'commune_name' => $address->commune ? $address->commune->name : '',
                    ];
                }) : [],
             ] : null,
             'regions' => \App\Models\Region::with('communes')->get(),
             'carriers' => \App\Models\Carrier::where('is_active', true)->get(['id', 'name', 'code']),
        ]);
    }
}

