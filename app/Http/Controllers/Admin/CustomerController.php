<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query();

        if ($request->has('search')) {
            $query->where('first_name', 'like', '%' . $request->search . '%')
                  ->orWhere('last_name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('rut', 'like', '%' . $request->search . '%');
        }

        $customers = $query->latest()
            ->paginate(15)
            ->through(fn ($customer) => [
                'id' => $customer->id,
                'name' => $customer->first_name . ' ' . $customer->last_name,
                'email' => $customer->email,
                'rut' => $customer->rut,
                'is_verified' => $customer->is_verified,
                'orders_count' => $customer->orders()->count(),
                'created_at' => $customer->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('admin/customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Customer $customer)
    {
        $customer->load(['orders.items', 'addresses.commune', 'verifications', 'restrictionApprovals']);

        return Inertia::render('admin/customers/Show', [
            'customer' => $customer,
            'stats' => [
                'total_spent' => $customer->orders()->where('payment_status', 'paid')->sum('total'),
                'total_orders' => $customer->orders()->count(),
            ]
        ]);
    }
}
