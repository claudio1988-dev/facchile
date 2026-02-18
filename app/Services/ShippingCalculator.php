<?php

namespace App\Services;

use App\Models\Region;
use App\Models\Commune;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class ShippingCalculator
{
    /**
     * Tarifas base aproximadas por Región (Codes)
     * Origen: Zona Central
     */
    private const REGIONAL_RATES = [
        'RM' => 4500,  // Metropolitana
        'V' => 5500,   // Valparaíso
        'VI' => 5500,  // O'Higgins
        'VII' => 5000, // Maule (Local/Cercano)
        'XVI' => 5500, // Ñuble
        'VIII' => 6000, // Biobío
        'IV' => 6500,  // Coquimbo
        'IX' => 6500,  // Araucanía
        'XIV' => 7000, // Los Ríos
        'X' => 7500,   // Los Lagos
        'III' => 8500, // Atacama
        'II' => 9500,  // Antofagasta
        'I' => 10500,  // Tarapacá
        'XV' => 11500, // Arica y Parinacota
        'XI' => 12500, // Aysén (Extrema)
        'XII' => 13500, // Magallanes (Extrema)
    ];

    /**
     * Calcula el costo de envío estimado.
     * 
     * @param int|string $regionId ID de la región
     * @param int|null $communeId ID de la comuna (opcional)
     * @param float $weight Peso en kg (por defecto 1.0)
     * @return array
     */
    public function calculate($regionId, $communeId = null, $weight = 1.0)
    {
        // 1. Intentar cálculo preciso si existen zonas configuradas en DB
        // (Esto permite al admin configurar tarifas exactas por comuna en el futuro)
        if ($communeId && Schema::hasTable('shipping_zones')) {
            $zone = DB::table('shipping_zones')
                ->where('commune_id', $communeId)
                ->first();
            
            if ($zone) {
                // Costo = Base + (Peso * Tasa/kg) + Recargo
                $cost = $zone->base_rate + ($weight * $zone->per_kg_rate);
                if ($zone->extreme_zone_surcharge > 0) {
                    $cost += $zone->extreme_zone_surcharge;
                }
                
                return [
                    'cost' => (int) round($cost),
                    'method' => 'zone_precise',
                    'carrier' => 'Transportista Local', // Podríamos hacer join con carriers si es necesario
                    'days_min' => $zone->estimated_days_min ?? 2,
                    'days_max' => $zone->estimated_days_max ?? 5,
                ];
            }
        }

        // 2. Fallback: Cálculo regional simplificado (Hardcoded constants)
        // Buscamos la región para obtener su código (RM, V, etc)
        $region = Region::find($regionId);
        
        if (!$region) {
            return [
                'cost' => 0, 
                'method' => 'error', 
                'error' => 'Region not found'
            ];
        }

        $baseCost = self::REGIONAL_RATES[$region->code] ?? 7000; // Default fallback
        
        // Ajuste por peso simple: +20% del base por cada kg adicional sobre 1.5kg
        $weightMultiplier = 1.0;
        if ($weight > 1.5) {
            $extraWeight = $weight - 1.5;
            // Capamos el multiplicador a 3x como máximo para evitar costos absurdos
            $weightMultiplier = min(3.0, 1 + ($extraWeight * 0.2)); 
        }

        $finalCost = $baseCost * $weightMultiplier;

        return [
            'cost' => (int) round($finalCost / 100) * 100, // Redondear a la centena (pesos chilenos)
            'method' => 'regional_fallback',
            'carrier' => 'Starken / Chilexpress', // Genérico
            'days_min' => 2,
            'days_max' => 5,
        ];
    }
}
