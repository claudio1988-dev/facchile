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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->foreignId('brand_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('shipping_class_id')->constrained()->restrictOnDelete();
            $table->string('name', 500);
            $table->string('slug', 500)->unique();
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_restricted')->default(false);
            $table->boolean('age_verification_required')->default(false);
            $table->decimal('base_price', 12, 2);
            $table->string('main_image_url', 500)->nullable();
            $table->timestamps();

            $table->index('category_id');
            $table->index('brand_id');
            $table->index('slug');
            $table->index('is_active');
            $table->index('is_restricted');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
