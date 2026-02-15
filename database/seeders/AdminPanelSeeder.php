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

        // Create Hierarchical Categories
        $categoriesTree = [
            [
                'name' => 'Outdoor',
                'slug' => 'outdoor',
                'description' => 'Todo para tu aventura al aire libre',
                'children' => [
                    [
                        'name' => 'Equipamiento', 
                        'slug' => 'equipamiento-outdoor', 
                        'children' => [
                            ['name' => 'Carpas & Refugios', 'slug' => 'carpas'],
                            ['name' => 'Sacos de Dormir', 'slug' => 'sacos-de-dormir'],
                            ['name' => 'Liners y Bivvys', 'slug' => 'liners-y-bivvys'],
                            ['name' => 'Iluminación', 'slug' => 'iluminacion'],
                            ['name' => 'Mochilas & Organizadores', 'slug' => 'mochilas-y-bolsos'],
                            ['name' => 'Cocina Outdoor', 'slug' => 'cocina-outdoor'],
                            ['name' => 'Coolers', 'slug' => 'coolers'],
                        ]
                    ],
                    [
                        'name' => 'Hidratación', 
                        'slug' => 'hidratacion', 
                        'children' => [
                            ['name' => 'Botellas y Termos', 'slug' => 'botellas-y-termos'],
                            ['name' => 'Vasos', 'slug' => 'vasos'],
                            ['name' => 'Bidones', 'slug' => 'bidones'],
                        ]
                    ],
                    [
                        'name' => 'Supervivencia', 
                        'slug' => 'supervivencia', 
                        'children' => [
                            ['name' => 'Primeros Auxilios', 'slug' => 'primeros-auxilios'],
                            ['name' => 'Kits', 'slug' => 'kits-supervivencia'],
                            ['name' => 'Accesorios Supervivencia', 'slug' => 'accesorios-supervivencia'],
                            ['name' => 'Libros', 'slug' => 'libros'],
                            ['name' => 'Purificadores de Agua', 'slug' => 'purificadores-agua'],
                        ]
                    ],
                    [
                        'name' => 'Esenciales Camping', 
                        'slug' => 'esenciales-camping', 
                        'children' => [
                            ['name' => 'Ponchos', 'slug' => 'ponchos'],
                            ['name' => 'Sillas y Mesas', 'slug' => 'sillas-y-mesas'],
                            ['name' => 'Repelentes', 'slug' => 'repelentes'],
                            ['name' => 'Toallas', 'slug' => 'toallas'],
                            ['name' => 'Cuerdas', 'slug' => 'cuerdas'],
                            ['name' => 'Encendedores', 'slug' => 'encendedores'],
                            ['name' => 'Brújulas', 'slug' => 'brujulas'],
                        ]
                    ],
                    [
                        'name' => 'Mascotas', 
                        'slug' => 'mascotas', 
                        'children' => [
                            ['name' => 'Arneses y Mochilas', 'slug' => 'arneses-y-mochilas'],
                            ['name' => 'Correas', 'slug' => 'correas'],
                            ['name' => 'Accesorios Mascotas', 'slug' => 'accesorios-mascotas'],
                        ]
                    ],
                ]
            ],
            [
                'name' => 'Cuchillería y Caza',
                'slug' => 'cuchilleria-y-caza',
                'description' => 'Cuchillos, navajas y equipamiento de caza',
                'children' => [
                    [
                        'name' => 'Cuchillos', 
                        'slug' => 'cuchillos',
                        'children' => [
                            ['name' => 'Cuchillos De Caza', 'slug' => 'cuchillos-de-caza'],
                            ['name' => 'Cuchillos Outdoor', 'slug' => 'cuchillos-outdoor'],
                            ['name' => 'Cuchillos EDC', 'slug' => 'cuchillos-edc'],
                            ['name' => 'Cuchillos Supervivencia', 'slug' => 'cuchillos-supervivencia'],
                            ['name' => 'Cuchillos Cocina', 'slug' => 'cuchillos-cocina'],
                            ['name' => 'Cuchillos de Colección', 'slug' => 'cuchillos-de-coleccion'],
                        ]
                    ],
                    [
                        'name' => 'Navajas', 
                        'slug' => 'navajas',
                        'children' => [
                            ['name' => 'Navajas Tácticas', 'slug' => 'navajas-tacticas'],
                            ['name' => 'Navajas EDC', 'slug' => 'navajas-edc'],
                            ['name' => 'Navajas Multiuso', 'slug' => 'navajas-multiuso'],
                        ]
                    ],
                    ['name' => 'Multiuso', 'slug' => 'multiuso'],
                    [
                        'name' => 'Aire Comprimido', 
                        'slug' => 'aire-comprimido',
                        'children' => [
                            ['name' => 'Rifles PCP', 'slug' => 'rifles-pcp'],
                            ['name' => 'Rifles Nitro Piston', 'slug' => 'rifles-nitro-piston'],
                            ['name' => 'Pistolas Aire', 'slug' => 'pistolas-aire'],
                            ['name' => 'Postones', 'slug' => 'postones'],
                        ]
                    ],
                    [
                        'name' => 'Ópticos', 
                        'slug' => 'opticos',
                        'children' => [
                            ['name' => 'Binoculares', 'slug' => 'binoculares'],
                            ['name' => 'Miras Telescópicas', 'slug' => 'miras-telescopicas'],
                            ['name' => 'Telémetros', 'slug' => 'telemetros'],
                        ]
                    ],
                    ['name' => 'Accesorios Caza', 'slug' => 'accesorios-caza'],
                ]
            ],
            [
                'name' => 'Pesca Deportiva',
                'slug' => 'pesca-deportiva',
                'description' => 'Todo para la pesca',
                'children' => [
                    [
                        'name' => 'Cañas de Pesca', 
                        'slug' => 'canas-de-pesca',
                        'children' => [
                            ['name' => 'Cañas De Mar', 'slug' => 'canas-de-mar'],
                            ['name' => 'Cañas de Río - Lago', 'slug' => 'canas-de-rio-lago'],
                            ['name' => 'Cañas de Trolling', 'slug' => 'canas-de-trolling'],
                            ['name' => 'Cañas Ultra Light', 'slug' => 'canas-ultra-light'],
                            ['name' => 'Cañas Telescópicas', 'slug' => 'canas-telescopicas'],
                            ['name' => 'Cañas Fly Fishing', 'slug' => 'canas-fly-fishing'],
                        ]
                    ],
                    [
                        'name' => 'Carretes de Pesca', 
                        'slug' => 'carretes-de-pesca',
                        'children' => [
                            ['name' => 'Carretes Frontales', 'slug' => 'carretes-frontales'],
                            ['name' => 'Carretes Horizontales', 'slug' => 'carretes-horizontales'],
                            ['name' => 'Carretes Bait Casting', 'slug' => 'carretes-bait-casting'],
                            ['name' => 'Carretes Fly Fishing', 'slug' => 'carretes-fly-fishing'],
                        ]
                    ],
                    [
                        'name' => 'Señuelos', 
                        'slug' => 'senuelos',
                        'children' => [
                            ['name' => 'Señuelos De Mar-Playa', 'slug' => 'senuelos-mar-playa'],
                            ['name' => 'Señuelos De Rio-Lago', 'slug' => 'senuelos-rio-lago'],
                            ['name' => 'Chispas y Jigs', 'slug' => 'chispas-y-jigs'],
                            ['name' => 'Señuelos De Trolling', 'slug' => 'senuelos-trolling'],
                            ['name' => 'Señuelos Blandos-Carnadas', 'slug' => 'senuelos-blandos'],
                            ['name' => 'Metal Vib', 'slug' => 'metal-vib'],
                            ['name' => 'Spinners', 'slug' => 'spinners'],
                        ]
                    ],
                    [
                        'name' => 'Líneas', 
                        'slug' => 'lineas',
                        'children' => [
                            ['name' => 'Monofilamentos', 'slug' => 'monofilamentos'],
                            ['name' => 'Multifilamentos', 'slug' => 'multifilamentos'],
                            ['name' => 'Fluorocarbono', 'slug' => 'fluorocarbono'],
                            ['name' => 'Líneas', 'slug' => 'lineas-general'],
                        ]
                    ],
                    [
                        'name' => 'Equipamiento', 
                        'slug' => 'equipamiento-pesca',
                        'children' => [
                            ['name' => 'Waders', 'slug' => 'waders'],
                            ['name' => 'Indumentaria', 'slug' => 'indumentaria-pesca'],
                            ['name' => 'Chinguillos', 'slug' => 'chinguillos'],
                        ]
                    ],
                    [
                        'name' => 'Organizadores', 
                        'slug' => 'organizadores-pesca',
                        'children' => [
                            ['name' => 'Cajas de Señuelos', 'slug' => 'cajas-de-senuelos'],
                            ['name' => 'Cajas Tradicionales', 'slug' => 'cajas-tradicionales'],
                            ['name' => 'Bolsos y Mochilas', 'slug' => 'bolsos-y-mochilas-pesca'],
                            ['name' => 'Fundas Rod & Reel', 'slug' => 'fundas-rod-reel'],
                        ]
                    ],
                    [
                        'name' => 'Accesorios Pesca Tradicional', 
                        'slug' => 'accesorios-pesca-tradicional',
                        'children' => [
                            ['name' => 'Herramientas', 'slug' => 'herramientas-pesca'],
                            ['name' => 'Anzuelos y Jig Heads', 'slug' => 'anzuelos-jig-heads'],
                            ['name' => 'Parabanes', 'slug' => 'parabanes'],
                            ['name' => 'Cuchillos Fileteadores', 'slug' => 'cuchillos-fileteadores'],
                        ]
                    ],
                ]
            ],
            [
                'name' => 'Ropa & Accesorios',
                'slug' => 'ropa-y-accesorios',
                'description' => 'Vestuario técnico y casual',
                'children' => [
                    [
                        'name' => 'Hombre', 
                        'slug' => 'hombre', 
                        'children' => [
                            ['name' => 'Primeras Capas', 'slug' => 'primeras-capas-hombre'],
                            ['name' => 'Camisas y Poleras', 'slug' => 'camisas-y-poleras-hombre'],
                            ['name' => 'Polar y Polerones', 'slug' => 'polar-y-polerones-hombre'],
                            ['name' => 'Chaquetas y Parkas', 'slug' => 'chaquetas-y-parkas-hombre'],
                            ['name' => 'Pantalones', 'slug' => 'pantalones-hombre'],
                            ['name' => 'Calzado', 'slug' => 'calzado-hombre'],
                            ['name' => 'Hombre Verano', 'slug' => 'hombre-verano'],
                        ]
                    ],
                    [
                        'name' => 'Mujer', 
                        'slug' => 'mujer', 
                        'children' => [
                            ['name' => 'Mujer Calzado', 'slug' => 'calzado-mujer'],
                            ['name' => 'Mujer Invierno', 'slug' => 'invierno-mujer'],
                        ]
                    ],
                    [
                        'name' => 'Accesorios', 
                        'slug' => 'accesorios-vestuario', // Changed slug to avoid conflict with parent
                        'children' => [
                            ['name' => 'Gorros', 'slug' => 'gorros'],
                            ['name' => 'Guantes', 'slug' => 'guantes'],
                            ['name' => 'Shemaghs', 'slug' => 'shemaghs'],
                            ['name' => 'Anteojos y Straps', 'slug' => 'anteojos-y-straps'],
                            ['name' => 'Llaveros', 'slug' => 'llaveros'],
                            ['name' => 'Accesorios Térmicos', 'slug' => 'accesorios-termicos'],
                            ['name' => 'Billeteras', 'slug' => 'billeteras'],
                        ]
                    ],
                ]
            ],
            // Tecnología and Overland removed as requested
        ];

        foreach ($categoriesTree as $node) {
            $children = $node['children'] ?? [];
            unset($node['children']);
            
            $parent = \App\Models\Category::firstOrCreate(
                ['slug' => $node['slug']], 
                $node
            );
            
            foreach ($children as $childNode) {
                $grandChildren = $childNode['children'] ?? []; // Extract Level 3
                unset($childNode['children']);

                 $subCategory = \App\Models\Category::firstOrCreate(
                    ['slug' => $childNode['slug']],
                    array_merge($childNode, ['parent_id' => $parent->id, 'description' => $childNode['name']])
                );

                // Create Level 3 (Sub-Subcategories)
                foreach ($grandChildren as $grandChildNode) {
                     \App\Models\Category::firstOrCreate(
                        ['slug' => $grandChildNode['slug']],
                        array_merge($grandChildNode, ['parent_id' => $subCategory->id, 'description' => $grandChildNode['name']])
                    );
                }
            }
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

        // Retrieve Categories for Product Assignment
        $riflesCat = \App\Models\Category::where('slug', 'rifles-aire')->first(); // Subcateg of Cuchillería
        if (!$riflesCat) $riflesCat = \App\Models\Category::where('slug', 'cuchilleria-y-caza')->first(); // Fallback

        $fishingCat = \App\Models\Category::where('slug', 'canas-de-pesca')->first(); // Subcateg of Pesca
        if (!$fishingCat) $fishingCat = \App\Models\Category::where('slug', 'pesca-deportiva')->first();

        $campingCat = \App\Models\Category::where('slug', 'carpas')->first(); // Subcateg of Outdoor
        if (!$campingCat) $campingCat = \App\Models\Category::where('slug', 'outdoor')->first();

        $knivesCat = \App\Models\Category::where('slug', 'cuchillos')->first(); // Subcateg of Cuchillería
        if (!$knivesCat) $knivesCat = \App\Models\Category::where('slug', 'cuchilleria-y-caza')->first();

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
                'category_id' => $riflesCat ? $riflesCat->id : 1,
                'brand_id' => $gamoBrand->id,
                'shipping_class_id' => $oversizedShipping->id,
                'description' => 'Rifle de aire comprimido calibre 5.5mm con mira telescópica 4x32. Potencia 24 joules. Ideal para tiro deportivo y control de plagas.',
                'short_description' => 'Rifle aire comprimido 5.5mm - 24J',
                'base_price' => 189990,
                'is_active' => true,
                'is_restricted' => true,
                'age_verification_required' => true,
                'image' => '/images/products/rifle-gamo.jpg'
            ],
            [
                'name' => 'Caña Shimano FX XT 2.40m',
                'slug' => 'cana-shimano-fx-xt-240m',
                'category_id' => $fishingCat ? $fishingCat->id : 1,
                'brand_id' => $shimanoBrand->id,
                'shipping_class_id' => $oversizedShipping->id,
                'description' => 'Caña de spinning 2.40m, acción media-rápida. Ideal para pesca en lagos y ríos. Soporta líneas de 6-12 lb.',
                'short_description' => 'Caña spinning 2.40m - Media/Rápida',
                'base_price' => 45990,
                'is_active' => true,
                'is_restricted' => false,
                'age_verification_required' => false,
                'image' => '/images/products/cana-shimano.jpg'
            ],
            [
                'name' => 'Carpa Coleman Sundome 4 Personas',
                'slug' => 'carpa-coleman-sundome-4-personas',
                'category_id' => $campingCat ? $campingCat->id : 1,
                'brand_id' => $colemanBrand->id,
                'shipping_class_id' => $oversizedShipping->id,
                'description' => 'Carpa tipo domo para 4 personas. Sistema WeatherTec resistente al agua. Ventilación superior. Fácil armado en 10 minutos.',
                'short_description' => 'Carpa 4 personas - Resistente al agua',
                'base_price' => 129990,
                'is_active' => true,
                'is_restricted' => false,
                'age_verification_required' => false,
                'image' => '/images/products/carpa-coleman.jpg'
            ],
            [
                'name' => 'Cuchillo Táctico Supervivencia Doite',
                'slug' => 'cuchillo-tactico-supervivencia-doite',
                'category_id' => $knivesCat ? $knivesCat->id : 1,
                'brand_id' => $doiteBrand->id,
                'shipping_class_id' => $normalShipping->id,
                'description' => 'Cuchillo de supervivencia hoja 12cm acero inoxidable. Incluye pedernal, brújula y kit de supervivencia en mango.',
                'short_description' => 'Cuchillo supervivencia con kit integrado',
                'base_price' => 24990,
                'is_active' => true,
                'is_restricted' => true,
                'age_verification_required' => true,
                'image' => '/images/products/cuchillo-doite.jpg'
            ],
            [
                'name' => 'Parka Lippi Expedition 8000',
                'slug' => 'parka-lippi-expedition-8000',
                'category_id' => $campingCat ? $campingCat->id : 1, // Maybe Apparel? But using Camping for now as fallback
                'brand_id' => $lippiBrand->id,
                'shipping_class_id' => $normalShipping->id,
                'description' => 'Parka técnica para alta montaña. Relleno de pluma 800 fill power. Impermeable y respirable.',
                'short_description' => 'Parka técnica alta montaña',
                'base_price' => 329990,
                'is_active' => true,
                'is_restricted' => false,
                'age_verification_required' => false,
                'image' => '/images/products/parka-lippi.jpg'
            ],
            [
                'name' => 'Rifle Aire Comprimido Hatsan AirTact',
                'slug' => 'rifle-aire-comprimido-hatsan-airtact',
                'category_id' => $riflesCat ? $riflesCat->id : 1,
                'brand_id' => $hatsanBrand->id,
                'shipping_class_id' => $oversizedShipping->id,
                'description' => 'Rifle táctico de gran potencia. Culata sintética ergonómica con agujero para el pulgar.',
                'short_description' => 'Rifle táctico alta potencia',
                'base_price' => 145000,
                'is_active' => true,
                'is_restricted' => true,
                'age_verification_required' => true,
                'image' => '/images/products/rifle-hatsan.jpg'
            ],
            [
                'name' => 'Cuchillo Victorinox Ranger Grip 79',
                'slug' => 'cuchillo-victorinox-ranger-grip-79',
                'category_id' => $knivesCat ? $knivesCat->id : 1,
                'brand_id' => $victorinoxBrand->id,
                'shipping_class_id' => $normalShipping->id,
                'description' => 'Cuchillo suizo con 12 funciones. Cachas bi-materia para un agarre excepcional.',
                'short_description' => 'Navaja suiza 12 funciones',
                'base_price' => 84990,
                'is_active' => true,
                'is_restricted' => false,
                'age_verification_required' => false,
                'image' => '/images/products/victorinox.jpg'
            ],
        ];

        foreach ($products as $product) {
            \App\Models\Product::firstOrCreate(['slug' => $product['slug']], $product);
        }

        $this->command->info('Admin panel sample data created successfully!');
    }
}
