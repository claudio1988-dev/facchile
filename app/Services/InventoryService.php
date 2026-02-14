<?php

namespace App\Services;

use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use Exception;

class InventoryService
{
    /**
     * Check if requested quantity is available for multiple items.
     *
     * @param array $items Array of ['variant_id' => int, 'quantity' => int]
     * @return bool
     */
    public function checkStockAvailability(array $items): bool
    {
        foreach ($items as $item) {
            $variant = ProductVariant::find($item['variant_id']);
            if (!$variant || $variant->stock_quantity < $item['quantity']) {
                return false;
            }
        }
        return true;
    }

    /**
     * Decrement stock for sold items.
     *
     * @param array $items Array of ['variant_id' => int, 'quantity' => int]
     * @throws Exception
     */
    public function decrementStock(array $items): void
    {
        DB::transaction(function () use ($items) {
            foreach ($items as $item) {
                // Lock the row for update to prevent race conditions
                $variant = ProductVariant::lockForUpdate()->find($item['variant_id']);
                
                if (!$variant) {
                    throw new Exception("Product variant not found: {$item['variant_id']}");
                }

                if ($variant->stock_quantity < $item['quantity']) {
                    throw new Exception("Insufficient stock for variant: {$variant->name} (SKU: {$variant->sku})");
                }

                $variant->stock_quantity -= $item['quantity'];
                $variant->save();
            }
        });
    }

    /**
     * Restore stock (e.g., for cancelled orders).
     *
     * @param array $items Array of ['variant_id' => int, 'quantity' => int]
     */
    public function restoreStock(array $items): void
    {
        DB::transaction(function () use ($items) {
            foreach ($items as $item) {
                $variant = ProductVariant::lockForUpdate()->find($item['variant_id']);
                if ($variant) {
                    $variant->stock_quantity += $item['quantity'];
                    $variant->save();
                }
            }
        });
    }
}
