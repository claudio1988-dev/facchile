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
        // Product Attributes
        Schema::create('product_attributes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->json('attributes')->comment('e.g., {"caliber": [".22", "5.5mm"], "fps": 1000, "action": "Fast"}');
            $table->timestamps();

            $table->index('product_id');
        });

        // Restriction Types
        Schema::create('restriction_types', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('minimum_age')->nullable();
            $table->boolean('requires_rut_validation')->default(false);
            $table->timestamps();
        });

        // Seed restriction types
        DB::table('restriction_types')->insert([
            ['code' => 'AGE_18', 'name' => 'Age 18+', 'description' => 'Requires customer to be 18 years or older', 'minimum_age' => 18, 'requires_rut_validation' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'AGE_21', 'name' => 'Age 21+', 'description' => 'Requires customer to be 21 years or older', 'minimum_age' => 21, 'requires_rut_validation' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'AIR_RIFLE', 'name' => 'Air Rifle', 'description' => 'Air compressed weapons (DGMN guidelines)', 'minimum_age' => 18, 'requires_rut_validation' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'KNIFE', 'name' => 'Knife/Blade', 'description' => 'Knives and bladed weapons', 'minimum_age' => 18, 'requires_rut_validation' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'ARCHERY', 'name' => 'Archery Equipment', 'description' => 'Bows and crossbows', 'minimum_age' => 18, 'requires_rut_validation' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Product Restrictions
        Schema::create('product_restrictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('restriction_type_id')->constrained()->cascadeOnDelete();
            $table->text('compliance_notes')->nullable();
            $table->timestamps();

            $table->unique(['product_id', 'restriction_type_id']);
            $table->index('product_id');
            $table->index('restriction_type_id');
        });

        // Regions
        Schema::create('regions', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique();
            $table->string('name');
            $table->boolean('is_extreme_zone')->default(false);
            $table->timestamps();
        });

        // Seed Chilean regions
        DB::table('regions')->insert([
            ['code' => 'XV', 'name' => 'Arica y Parinacota', 'is_extreme_zone' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'I', 'name' => 'Tarapacá', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'II', 'name' => 'Antofagasta', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'III', 'name' => 'Atacama', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'IV', 'name' => 'Coquimbo', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'V', 'name' => 'Valparaíso', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'RM', 'name' => 'Región Metropolitana', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'VI', 'name' => 'O\'Higgins', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'VII', 'name' => 'Maule', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'XVI', 'name' => 'Ñuble', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'VIII', 'name' => 'Biobío', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'IX', 'name' => 'La Araucanía', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'XIV', 'name' => 'Los Ríos', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'X', 'name' => 'Los Lagos', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'XI', 'name' => 'Aysén', 'is_extreme_zone' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'XII', 'name' => 'Magallanes', 'is_extreme_zone' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Communes
        Schema::create('communes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('code', 10)->nullable();
            $table->boolean('is_extreme_zone')->default(false);
            $table->timestamps();

            $table->index('region_id');
            $table->index('is_extreme_zone');
        });

        // Seed sample communes
        $rmId = DB::table('regions')->where('code', 'RM')->value('id');
        $vId = DB::table('regions')->where('code', 'V')->value('id');
        $xiiId = DB::table('regions')->where('code', 'XII')->value('id');
        $xiId = DB::table('regions')->where('code', 'XI')->value('id');

        DB::table('communes')->insert([
            ['region_id' => $rmId, 'name' => 'Santiago', 'code' => 'STGO', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['region_id' => $rmId, 'name' => 'Providencia', 'code' => 'PROV', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['region_id' => $rmId, 'name' => 'Las Condes', 'code' => 'LCON', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['region_id' => $vId, 'name' => 'Valparaíso', 'code' => 'VALP', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['region_id' => $vId, 'name' => 'Viña del Mar', 'code' => 'VINA', 'is_extreme_zone' => false, 'created_at' => now(), 'updated_at' => now()],
            ['region_id' => $xiiId, 'name' => 'Punta Arenas', 'code' => 'PTAR', 'is_extreme_zone' => true, 'created_at' => now(), 'updated_at' => now()],
            ['region_id' => $xiId, 'name' => 'Coyhaique', 'code' => 'COYH', 'is_extreme_zone' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Carriers
        Schema::create('carriers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 50)->unique();
            $table->string('api_endpoint', 500)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed carriers
        DB::table('carriers')->insert([
            ['name' => 'Starken', 'code' => 'STARKEN', 'api_endpoint' => 'https://api.starken.cl', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Blue Express', 'code' => 'BLUE_EXPRESS', 'api_endpoint' => 'https://api.bluex.cl', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Chilexpress', 'code' => 'CHILEXPRESS', 'api_endpoint' => 'https://api.chilexpress.cl', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Retiro en Tienda', 'code' => 'PICKUP', 'api_endpoint' => null, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Carrier Capabilities
        Schema::create('carrier_capabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('carrier_id')->constrained()->cascadeOnDelete();
            $table->foreignId('shipping_class_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_supported')->default(true);
            $table->timestamps();

            $table->unique(['carrier_id', 'shipping_class_id']);
        });

        // Seed carrier capabilities
        $starkenId = DB::table('carriers')->where('code', 'STARKEN')->value('id');
        $blueId = DB::table('carriers')->where('code', 'BLUE_EXPRESS')->value('id');
        $chilexId = DB::table('carriers')->where('code', 'CHILEXPRESS')->value('id');
        $pickupId = DB::table('carriers')->where('code', 'PICKUP')->value('id');

        $normalId = DB::table('shipping_classes')->where('code', 'NORMAL')->value('id');
        $oversizedId = DB::table('shipping_classes')->where('code', 'OVERSIZED')->value('id');
        $dangerousId = DB::table('shipping_classes')->where('code', 'DANGEROUS')->value('id');
        $pickupOnlyId = DB::table('shipping_classes')->where('code', 'PICKUP_ONLY')->value('id');

        DB::table('carrier_capabilities')->insert([
            ['carrier_id' => $starkenId, 'shipping_class_id' => $normalId, 'is_supported' => true, 'created_at' => now(), 'updated_at' => now()],
            ['carrier_id' => $starkenId, 'shipping_class_id' => $oversizedId, 'is_supported' => true, 'created_at' => now(), 'updated_at' => now()],
            ['carrier_id' => $starkenId, 'shipping_class_id' => $dangerousId, 'is_supported' => false, 'created_at' => now(), 'updated_at' => now()],
            ['carrier_id' => $blueId, 'shipping_class_id' => $normalId, 'is_supported' => true, 'created_at' => now(), 'updated_at' => now()],
            ['carrier_id' => $blueId, 'shipping_class_id' => $oversizedId, 'is_supported' => false, 'created_at' => now(), 'updated_at' => now()],
            ['carrier_id' => $chilexId, 'shipping_class_id' => $normalId, 'is_supported' => true, 'created_at' => now(), 'updated_at' => now()],
            ['carrier_id' => $chilexId, 'shipping_class_id' => $oversizedId, 'is_supported' => true, 'created_at' => now(), 'updated_at' => now()],
            ['carrier_id' => $pickupId, 'shipping_class_id' => $dangerousId, 'is_supported' => true, 'created_at' => now(), 'updated_at' => now()],
            ['carrier_id' => $pickupId, 'shipping_class_id' => $pickupOnlyId, 'is_supported' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Shipping Zones
        Schema::create('shipping_zones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commune_id')->constrained()->cascadeOnDelete();
            $table->foreignId('carrier_id')->constrained()->cascadeOnDelete();
            $table->decimal('base_rate', 10, 2);
            $table->decimal('per_kg_rate', 10, 2);
            $table->decimal('extreme_zone_surcharge', 10, 2)->default(0);
            $table->integer('estimated_days_min')->nullable();
            $table->integer('estimated_days_max')->nullable();
            $table->timestamps();

            $table->unique(['commune_id', 'carrier_id']);
            $table->index('commune_id');
            $table->index('carrier_id');
        });

        // Customers
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('rut', 12)->unique()->nullable()->comment('Chilean RUT format: 12345678-9');
            $table->string('first_name');
            $table->string('last_name');
            $table->date('birth_date')->nullable();
            $table->string('phone', 20)->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamps();

            $table->index('email');
            $table->index('rut');
            $table->index('is_verified');
        });

        // Customer Addresses
        Schema::create('customer_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('commune_id')->constrained()->restrictOnDelete();
            $table->string('address_line1', 500);
            $table->string('address_line2', 500)->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->boolean('is_default_shipping')->default(false);
            $table->boolean('is_default_billing')->default(false);
            $table->timestamps();

            $table->index('customer_id');
            $table->index('commune_id');
        });

        // Customer Verifications
        Schema::create('customer_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('verification_type', 50)->comment('AGE, RUT, EMAIL');
            $table->json('verification_data')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            $table->index('customer_id');
            $table->index('verification_type');
        });

        // Customer Restriction Approvals
        Schema::create('customer_restriction_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_restriction_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_approved')->default(false);
            $table->timestamp('approved_at')->nullable();
            $table->unsignedBigInteger('approved_by_user_id')->nullable()->comment('Reference to admin users table');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['customer_id', 'product_restriction_id'], 'cust_restriction_approval_unique');
            $table->index('customer_id');
            $table->index('product_restriction_id');
        });

        // Kits
        Schema::create('kits', function (Blueprint $table) {
            $table->id();
            $table->string('name', 500);
            $table->string('slug', 500)->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2);
            $table->decimal('discount_percentage', 5, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('slug');
            $table->index('is_active');
        });

        // Kit Items
        Schema::create('kit_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kit_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_variant_id')->constrained()->cascadeOnDelete();
            $table->integer('quantity')->default(1);
            $table->timestamps();

            $table->index('kit_id');
            $table->index('product_variant_id');
        });

        // Orders
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 50)->unique();
            $table->foreignId('customer_id')->constrained()->restrictOnDelete();
            $table->foreignId('shipping_address_id')->nullable()->constrained('customer_addresses')->restrictOnDelete();
            $table->foreignId('carrier_id')->nullable()->constrained()->restrictOnDelete();
            $table->string('status', 50)->default('pending')->comment('pending, processing, shipped, delivered, cancelled');
            $table->decimal('subtotal', 12, 2);
            $table->decimal('shipping_cost', 12, 2);
            $table->decimal('tax', 12, 2);
            $table->decimal('total', 12, 2);
            $table->decimal('actual_weight_kg', 8, 3)->nullable();
            $table->decimal('volumetric_weight_kg', 8, 3)->nullable()->comment('Calculated as (L × W × H) / 4000 for shipping cost');
            $table->boolean('age_verification_completed')->default(false);
            $table->string('payment_gateway_id')->nullable()->comment('Webpay/Flow transaction ID');
            $table->string('payment_status', 50)->default('pending');
            $table->json('metadata')->nullable()->comment('Additional order data');
            $table->timestamps();

            $table->index('customer_id');
            $table->index('order_number');
            $table->index('status');
            $table->index('created_at');
        });

        // Order Items
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained()->restrictOnDelete();
            $table->foreignId('kit_id')->nullable()->constrained()->restrictOnDelete();
            $table->string('product_name', 500);
            $table->string('sku', 100)->nullable();
            $table->integer('quantity');
            $table->decimal('unit_price', 12, 2);
            $table->decimal('subtotal', 12, 2);
            $table->json('snapshot_data')->nullable()->comment('Product details at time of purchase');
            $table->timestamps();

            $table->index('order_id');
            $table->index('product_variant_id');
            $table->index('kit_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('kit_items');
        Schema::dropIfExists('kits');
        Schema::dropIfExists('customer_restriction_approvals');
        Schema::dropIfExists('customer_verifications');
        Schema::dropIfExists('customer_addresses');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('shipping_zones');
        Schema::dropIfExists('carrier_capabilities');
        Schema::dropIfExists('carriers');
        Schema::dropIfExists('communes');
        Schema::dropIfExists('regions');
        Schema::dropIfExists('product_restrictions');
        Schema::dropIfExists('restriction_types');
        Schema::dropIfExists('product_attributes');
    }
};
