<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
use App\Models\ShippingClass;

class ImportExcelProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = file_get_contents(base_path('import_data_final.json'));
        $inputData = json_decode($json, true);

        if (!$inputData) {
            $this->command->error('No JSON data found in import_data_final.json');
            return;
        }

        // Get shipping class (default to normal)
        $defaultShipping = ShippingClass::firstOrCreate(
            ['code' => 'NORMAL'], 
            ['name' => 'Envío Normal', 'price' => 5000, 'is_surcharge' => false]
        );

        $this->command->info('Importing ' . count($inputData) . ' products...');

        foreach ($inputData as $data) {
            // Find Category
            // Start simple: strict slug match
            $category = Category::where('slug', $data['category_slug'])->first();
            
            // If category not found, try to find by Name maybe? Or map to root
            if (!$category) {
                 // Try removing suffixes
                 $parts = explode('-', $data['category_slug']);
                 if(count($parts) > 1) {
                     $fallbackSlug = $parts[0]; // e.g. "cuchillos" from "cuchillos-tacticos"
                     $category = Category::where('slug', $fallbackSlug)->first();
                 }
                 
                 // If still null, fallback to 'outdoor'
                 if (!$category) {
                     $category = Category::where('slug', 'outdoor')->first();
                 }
            }
            
            if (!$category) {
                // Should not happen if Seeder ran correctly, but just in case
                $this->command->warn("Skipping product {$data['name']} - No valid category found.");
                continue;
            }

            // Find or Create Brand
            $brandName = $data['brand_name'] ?? 'Genérico';
            if (empty($brandName) || $brandName === 'nan') $brandName = 'Genérico';
            
            $brandSlug = \Illuminate\Support\Str::slug($brandName);
            $brand = Brand::firstOrCreate(
                ['slug' => $brandSlug],
                ['name' => $brandName]
            );

            // Generate Unique Slug
            $baseSlug = \Illuminate\Support\Str::slug($data['name']);
            if (empty($baseSlug)) $baseSlug = 'producto-' . uniqid();
            
            $slug = $baseSlug;
            $counter = 1;
            while (Product::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            
            // Create Product
            $product = Product::create([
                'name' => substr($data['name'], 0, 255),
                'slug' => $slug,
                'category_id' => $category->id,
                'brand_id' => $brand->id,
                'shipping_class_id' => $defaultShipping->id,
                'description' => substr($data['description'] ?? 'Sin descripción.', 0, 5000), // Limit length just in case
                'short_description' => mb_convert_encoding(substr(strip_tags($data['description'] ?? ''), 0, 160), 'UTF-8', 'UTF-8'),
                'base_price' => 14990, // Default price for imported items
                'is_active' => true,
                'is_restricted' => false, 
                'age_verification_required' => false,
                'main_image_url' => '/images/imagenesdemo/5.png', // Using the demo image requested
            ]);

            // Create Default Variant for stock management
            $product->variants()->create([
                'name' => 'Estándar',
                'sku' => $product->slug,
                'price' => $product->base_price,
                'stock_quantity' => 0,
                'is_active' => true,
            ]);
        }
        
        $this->command->info('Import completed successfully!');
    }
}
