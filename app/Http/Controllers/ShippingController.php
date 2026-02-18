<?php

namespace App\Http\Controllers;

use App\Services\ShippingCalculator;
use Illuminate\Http\Request;

class ShippingController extends Controller
{
    /**
     * Endpoint para calcular costo de envío dinámicamente.
     */
    public function calculate(Request $request, ShippingCalculator $calculator)
    {
        $validated = $request->validate([
            'region_id' => 'required|exists:regions,id',
            'commune_id' => 'nullable|exists:communes,id',
            'weight' => 'nullable|numeric|min:0.1',
        ]);

        $result = $calculator->calculate(
            $validated['region_id'],
            $validated['commune_id'] ?? null,
            $validated['weight'] ?? 1.5
        );

        return response()->json($result);
    }
}
