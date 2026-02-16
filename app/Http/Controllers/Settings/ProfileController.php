<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $customer = \App\Models\Customer::with('shippingAddress.commune')
            ->where('email', $user->email)
            ->first();

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'customer' => $customer,
            'address' => $customer ? $customer->shippingAddress : null,
            'regions' => \App\Models\Region::select('id', 'name', 'code')->get(),
            'communes' => \App\Models\Commune::select('id', 'name', 'region_id')->get(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        $originalEmail = $user->getOriginal('email');
        
        \Illuminate\Support\Facades\Log::info('Updating profile for user: ' . $user->id, [
            'original_email' => $originalEmail,
            'new_data' => $request->all()
        ]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', \Illuminate\Validation\Rule::unique('users')->ignore($user->id)],
            'rut' => ['nullable', 'string', 'max:20'],
            'phone' => ['nullable', 'string', 'max:20'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'address_line1' => ['nullable', 'required_with:commune_id', 'string', 'max:255'],
            'address_line2' => ['nullable', 'string', 'max:255'],
            'commune_id' => ['nullable', 'exists:communes,id'],
            'region_id' => ['nullable', 'exists:regions,id'],
        ]);

        // 1. Update User
        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        // 2. Update or Create Customer 
        // We use the ORIGINAL email to find the existing customer record
        $customer = \App\Models\Customer::where('email', $originalEmail)->first();
        
        $firstName = $validated['first_name'] ?: explode(' ', $user->name, 2)[0];
        $lastName = $validated['last_name'] ?: (explode(' ', $user->name, 2)[1] ?? '');

        if (!$customer) {
            $customer = new \App\Models\Customer();
        }

        $customer->fill([
            'email' => $user->email, // Update to new email
            'rut' => $validated['rut'],
            'first_name' => $firstName,
            'last_name' => $lastName,
            'phone' => $validated['phone'],
            'is_verified' => true
        ]);
        $customer->save();

        // 3. Update Address
        if (!empty($validated['commune_id']) && !empty($validated['address_line1'])) {
            \App\Models\CustomerAddress::updateOrCreate(
                [
                    'customer_id' => $customer->id,
                    'is_default_shipping' => true
                ],
                [
                    'address_line1' => $validated['address_line1'],
                    'address_line2' => $validated['address_line2'] ?? null,
                    'commune_id' => $validated['commune_id'],
                ]
            );
            \Illuminate\Support\Facades\Log::info('Address updated/created for customer: ' . $customer->id);
        } else {
            \Illuminate\Support\Facades\Log::warning('Address update skipped. Commune or Address Line 1 missing.');
        }

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
