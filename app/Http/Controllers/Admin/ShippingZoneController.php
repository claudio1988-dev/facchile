<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Region;
use App\Models\ShippingZone;
use App\Models\Carrier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShippingZoneController extends Controller
{
    public function index()
    {
        // Traemos las regiones con sus comunas y las zonas de envío asociadas.
        $regions = Region::with(['communes.shippingZones'])->get();
        $carriers = Carrier::where('is_active', true)->get();
        
        return Inertia::render('Admin/Shipping/Index', [
            'regions' => $regions,
            'carriers' => $carriers
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'commune_id' => 'required|exists:communes,id',
            'carrier_id' => 'required|exists:carriers,id',
            'base_rate' => 'required|numeric|min:0',
            'per_kg_rate' => 'required|numeric|min:0',
            'extreme_zone_surcharge' => 'nullable|numeric|min:0',
            'estimated_days_min' => 'nullable|integer|min:1',
            'estimated_days_max' => 'nullable|integer|min:1',
        ]);

        // Usamos updateOrCreate buscando por la pareja commune_id + carrier_id
        ShippingZone::updateOrCreate(
            [
                'commune_id' => $data['commune_id'],
                'carrier_id' => $data['carrier_id']
            ],
            $data
        );

        return redirect()->back()->with('success', 'Zona de envío actualizada.');
    }
}
