<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shipping_classes', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('allows_home_delivery')->default(true);
            $table->boolean('requires_special_carrier')->default(false);
            $table->timestamps();
        });

        // Seed initial shipping classes
        DB::table('shipping_classes')->insert([
            ['code' => 'NORMAL', 'name' => 'Normal', 'description' => 'Standard shipping for regular items', 'allows_home_delivery' => true, 'requires_special_carrier' => false, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'OVERSIZED', 'name' => 'Oversized', 'description' => 'Large items requiring special handling (fishing rods, rifles)', 'allows_home_delivery' => true, 'requires_special_carrier' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'DANGEROUS', 'name' => 'Dangerous Goods', 'description' => 'Hazardous materials (gas, aerosols)', 'allows_home_delivery' => false, 'requires_special_carrier' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'PICKUP_ONLY', 'name' => 'Pickup Only', 'description' => 'Items that cannot be shipped', 'allows_home_delivery' => false, 'requires_special_carrier' => false, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_classes');
    }
};
