<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminPanelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Use existing Shipping Classes (already seeded in migration)
        $normalShipping = \App\Models\ShippingClass::where('code', 'NORMAL')->first();
        $oversizedShipping = \App\Models\ShippingClass::where('code', 'OVERSIZED')->first();

        // Create Categories
        $categories = [
            [
                'name' => 'Rifles y Aire Comprimido',
                'slug' => 'rifles-aire-comprimido',
                'description' => 'Rifles de aire comprimido, accesorios y municiones',
            ],
            [
                'name' => 'Pesca Deportiva',
                'slug' => 'pesca-deportiva',
                'description' => 'Cañas, carretes, señuelos y equipamiento de pesca',
            ],
            [
                'name' => 'Camping & Outdoor',
                'slug' => 'camping-outdoor',
                'description' => 'Carpas, sacos de dormir y equipamiento para camping',
            ],
            [
                'name' => 'Caza y Supervivencia',
                'slug' => 'caza-supervivencia',
                'description' => 'Equipamiento táctico, cuchillos y accesorios de caza',
            ],
        ];

        foreach ($categories as $category) {
            \App\Models\Category::firstOrCreate(['slug' => $category['slug']], $category);
        }

        // Create Brands
        $brands = [
            ['name' => 'Gamo', 'slug' => 'gamo'],
            ['name' => 'Shimano', 'slug' => 'shimano'],
            ['name' => 'Coleman', 'slug' => 'coleman'],
            ['name' => 'Doite', 'slug' => 'doite'],
            ['name' => 'Lippi', 'slug' => 'lippi'],
            ['name' => 'AirVenturi', 'slug' => 'airventuri'],
            ['name' => 'Mitchell', 'slug' => 'mitchell'],
            ['name' => 'Hatsan', 'slug' => 'hatsan'],
            ['name' => 'Victorinox', 'slug' => 'victorinox'],
        ];

        foreach ($brands as $brand) {
            \App\Models\Brand::firstOrCreate(['slug' => $brand['slug']], $brand);
        }

        // Create Sample Products
        $riflesCategory = \App\Models\Category::where('slug', 'rifles-aire-comprimido')->first();
        $pescaCategory = \App\Models\Category::where('slug', 'pesca-deportiva')->first();
        $campingCategory = \App\Models\Category::where('slug', 'camping-outdoor')->first();
        $cazaCategory = \App\Models\Category::where('slug', 'caza-supervivencia')->first();

        // Get brands
        $gamoBrand = \App\Models\Brand::where('slug', 'gamo')->first();
        $shimanoBrand = \App\Models\Brand::where('slug', 'shimano')->first();
        $colemanBrand = \App\Models\Brand::where('slug', 'coleman')->first();
        $doiteBrand = \App\Models\Brand::where('slug', 'doite')->first();
        $lippiBrand = \App\Models\Brand::where('slug', 'lippi')->first();
        $hatsanBrand = \App\Models\Brand::where('slug', 'hatsan')->first();
        $victorinoxBrand = \App\Models\Brand::where('slug', 'victorinox')->first();

        $products = [
            [
                'name' => 'Rifle Gamo Hunter 440 AS',
                'slug' => 'rifle-gamo-hunter-440-as',
                'category_id' => $riflesCategory->id,
                'brand_id' => $gamoBrand->id,
                'shipping_class_id' => $oversizedShipping->id,
                'description' => 'Rifle de aire comprimido calibre 5.5mm con mira telescópica 4x32. Potencia 24 joules. Ideal para tiro deportivo y control de plagas.',
                'short_description' => 'Rifle aire comprimido 5.5mm - 24J',
                'base_price' => 189990,
                'is_active' => true,
                'is_restricted' => true,
                'age_verification_required' => true,
            ],
            [
                'name' => 'Caña Shimano FX XT 2.40m',
                'slug' => 'cana-shimano-fx-xt-240m',
                'category_id' => $pescaCategory->id,
                'brand_id' => $shimanoBrand->id,
                'shipping_class_id' => $oversizedShipping->id,
                'description' => 'Caña de spinning 2.40m, acción media-rápida. Ideal para pesca en lagos y ríos. Soporta líneas de 6-12 lb.',
                'short_description' => 'Caña spinning 2.40m - Media/Rápida',
                'base_price' => 45990,
                'is_active' => true,
                'is_restricted' => false,
                'age_verification_required' => false,
            ],
            [
                'name' => 'Carpa Coleman Sundome 4 Personas',
                'slug' => 'carpa-coleman-sundome-4-personas',
                'category_id' => $campingCategory->id,
                'brand_id' => $colemanBrand->id,
                'shipping_class_id' => $oversizedShipping->id,
                'description' => 'Carpa tipo domo para 4 personas. Sistema WeatherTec resistente al agua. Ventilación superior. Fácil armado en 10 minutos.',
                'short_description' => 'Carpa 4 personas - Resistente al agua',
                'base_price' => 129990,
                'is_active' => true,
                'is_restricted' => false,
                'age_verification_required' => false,
            ],
            [
                'name' => 'Cuchillo Táctico Supervivencia Doite',
                'slug' => 'cuchillo-tactico-supervivencia-doite',
                'category_id' => $cazaCategory->id,
                'brand_id' => $doiteBrand->id,
                'shipping_class_id' => $normalShipping->id,
                'description' => 'Cuchillo de supervivencia hoja 12cm acero inoxidable. Incluye pedernal, brújula y kit de supervivencia en mango.',
                'short_description' => 'Cuchillo supervivencia con kit integrado',
                'base_price' => 24990,
                'is_active' => true,
                'is_restricted' => true,
                'age_verification_required' => true,
            ],
            [
                'name' => 'Parka Lippi Expedition 8000',
                'slug' => 'parka-lippi-expedition-8000',
                'category_id' => $campingCategory->id,
                'brand_id' => $lippiBrand->id,
                'shipping_class_id' => $normalShipping->id,
                'description' => 'Parka técnica para alta montaña. Relleno de pluma 800 fill power. Impermeable y respirable.',
                'short_description' => 'Parka técnica alta montaña',
                'base_price' => 329990,
                'is_active' => true,
                'is_restricted' => false,
                'age_verification_required' => false,
            ],
            [
                'name' => 'Rifle Aire Comprimido Hatsan AirTact',
                'slug' => 'rifle-aire-comprimido-hatsan-airtact',
                'category_id' => $riflesCategory->id,
                'brand_id' => $hatsanBrand->id,
                'shipping_class_id' => $oversizedShipping->id,
                'description' => 'Rifle táctico de gran potencia. Culata sintética ergonómica con agujero para el pulgar.',
                'short_description' => 'Rifle táctico alta potencia',
                'base_price' => 145000,
                'is_active' => true,
                'is_restricted' => true,
                'age_verification_required' => true,
            ],
            [
                'name' => 'Cuchillo Victorinox Ranger Grip 79',
                'slug' => 'cuchillo-victorinox-ranger-grip-79',
                'category_id' => $cazaCategory->id,
                'brand_id' => $victorinoxBrand->id,
                'shipping_class_id' => $normalShipping->id,
                'description' => 'Cuchillo suizo con 12 funciones. Cachas bi-materia para un agarre excepcional.',
                'short_description' => 'Navaja suiza 12 funciones',
                'base_price' => 84990,
                'is_active' => true,
                'is_restricted' => false,
                'age_verification_required' => false,
            ],
        ];

        foreach ($products as $product) {
            \App\Models\Product::firstOrCreate(['slug' => $product['slug']], $product);
        }

        $this->command->info('Admin panel sample data created successfully!');
    }
}
