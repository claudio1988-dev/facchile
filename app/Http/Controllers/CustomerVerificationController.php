<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerVerification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CustomerVerificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $customer = Customer::where('email', $user->email)->first();

        // If customer doesn't exist, we just return empty state or create on the fly
        if (!$customer) {
             // Create customer profile if not exists
             $customer = Customer::create([
                 'email' => $user->email,
                 'first_name' => $user->name,
                 'last_name' => '', // placeholder
                 'birth_date' => null,
                 'is_verified' => false,
             ]);
        }
        
        return Inertia::render('customer/Verifications', [
            'birth_date' => $customer->birth_date,
            'isVerified' => $customer->is_verified,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'birth_date' => 'required|date|before:today',
            'rut' => 'required|string', // Basic validation, consider full RUT validation logic
        ]);

        $user = Auth::user();
        $customer = Customer::where('email', $user->email)->firstOrFail();

        // Update customer data
        $customer->update([
            'birth_date' => $request->birth_date,
            'rut' => $request->rut,
        ]);

        // Calculate age
        $age = \Carbon\Carbon::parse($request->birth_date)->age;
        
        if ($age >= 18) {
            $customer->update(['is_verified' => true]);
            $message = 'Verificación exitosa. Eres mayor de edad.';
            $type = 'success';
        } else {
             $customer->update(['is_verified' => false]);
             $message = 'Lo sentimos, debes ser mayor de 18 años para verificar tu cuenta.';
             $type = 'error';
        }

        return back()->with($type, $message);
    }
}
