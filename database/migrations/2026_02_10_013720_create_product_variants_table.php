<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('sku', 100)->unique();
            $table->json('variant_attributes')->nullable()->comment('e.g., {"caliber": "5.5mm", "color": "Black"}');
            $table->decimal('price', 12, 2);
            $table->decimal('compare_at_price', 12, 2)->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->decimal('weight_kg', 8, 3)->nullable();
            $table->decimal('length_cm', 8, 2)->nullable();
            $table->decimal('width_cm', 8, 2)->nullable();
            $table->decimal('height_cm', 8, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('product_id');
            $table->index('sku');
            $table->index('is_active');
            $table->index('stock_quantity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
