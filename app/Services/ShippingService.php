<?php

namespace App\Services;

use App\Models\Carrier;
use App\Models\Commune;
use App\Models\Order;
use App\Models\ShippingClass;
use Illuminate\Support\Collection;

class ShippingService
{
    /**
     * Calculate shipping options for a given cart items and destination.
     *
     * @param Commune $userCommune
     * @param Collection $cartItems Collection of items with 'product_variant' and 'quantity'
     * @return array
     */
    public function getShippingOptions(Commune $userCommune, Collection $cartItems): array
    {
        if ($cartItems->isEmpty()) {
            return [];
        }

        // 1. Calculate total weight and dimensions
        $totalWeight = 0;
        $maxShippingClassId = null;
        $highestPriority = -1;

        // Determine the most restrictive shipping class
        // Assuming shipping classes have some hierarchy or we check capabilities
        // For simplicity, we get all unique shipping classes involved
        $shippingClassIds = $cartItems->map(fn($item) => $item->productVariant->product->shipping_class_id)->unique();
        
        // Calculate weight (assuming weight is on variant or product, fallback to 1kg for now if not set)
        // Note: Product model needs a weight attribute potentially, or we assume a default
        foreach ($cartItems as $item) {
             // Future: Add weight to ProductVariant or Product
             $weight = $item->productVariant->weight ?? 1.0; 
             $totalWeight += $weight * $item->quantity;
        }

        // 2. Find carriers that support ALL shipping classes present in the cart
        // Actually, usually it's "if ANY item requires Dangerous Goods, the carrier must support it"
        // So we need carriers that support the set of classes.
        
        // Get all active carriers
        $carriers = Carrier::where('is_active', true)->get();
        $validOptions = [];

        foreach ($carriers as $carrier) {
            // Check capabilities
            $supportsAll = true;
            foreach ($shippingClassIds as $classId) {
                if ($classId) {
                    $hasCapability = $carrier->capabilities()
                        ->where('shipping_class_id', $classId)
                        ->where('is_supported', true)
                        ->exists();
                    
                    if (!$hasCapability) {
                        $supportsAll = false;
                        break;
                    }
                }
            }

            if (!$supportsAll) continue;

            // 3. Find Shipping Zone for this carrier and commune
            $zone = $carrier->shippingZones()->where('commune_id', $userCommune->id)->first();

            if (!$zone) {
                // Try to find a "default" zone or region-based zone if we implemented that logic
                // For now, strict match
                continue;
            }

            // 4. Calculate Cost
            $cost = $zone->base_rate + ($zone->per_kg_rate * $totalWeight);

            if ($zone->extreme_zone_surcharge > 0 && ($userCommune->is_extreme_zone || $userCommune->region->is_extreme_zone)) {
                $cost += $zone->extreme_zone_surcharge;
            }

            $validOptions[] = [
                'carrier_id' => $carrier->id,
                'carrier_name' => $carrier->name,
                'carrier_code' => $carrier->code,
                'cost' => round($cost, 2),
                'days_min' => $zone->estimated_days_min,
                'days_max' => $zone->estimated_days_max,
            ];
        }

        return $validOptions;
    }
}
