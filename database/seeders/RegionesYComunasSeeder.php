<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class RegionesYComunasSeeder extends Seeder
{
    /**
     * Mapeo de IDs de región a códigos romanos chilenos
     */
    private $regionCodes = [
        1 => 'XV',   // Arica y Parinacota
        2 => 'I',    // Tarapacá
        3 => 'II',   // Antofagasta
        4 => 'III',  // Atacama
        5 => 'IV',   // Coquimbo
        6 => 'V',    // Valparaíso
        7 => 'RM',   // Metropolitana
        8 => 'VI',   // O'Higgins
        9 => 'VII',  // Maule
        10 => 'XVI', // Ñuble
        11 => 'VIII',// Biobío
        12 => 'IX',  // La Araucanía
        13 => 'XIV', // Los Ríos
        14 => 'X',   // Los Lagos
        15 => 'XI',  // Aysén
        16 => 'XII', // Magallanes
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🗺️  Importando regiones desde JSON...');
        
        // Leer y procesar regiones
        $regionesPath = database_path('seeders/data/regiones.json');
        
        if (!file_exists($regionesPath)) {
            $this->command->error('❌ No se encontró el archivo regiones.json');
            return;
        }
        
        $regionesJson = File::get($regionesPath);
        $regionesData = json_decode($regionesJson, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->command->error('❌ Error al parsear regiones.json: ' . json_last_error_msg());
            return;
        }
        
        $regiones = [];
        foreach ($regionesData as $region) {
            $regionId = $region['id'];
            $code = $this->regionCodes[$regionId] ?? 'R' . $regionId;
            
            // Determinar si es zona extrema
            $isExtremeZone = in_array($regionId, [1, 15, 16]); // Arica, Aysén, Magallanes
            
            $regiones[] = [
                'id' => $regionId,
                'code' => $code,
                'name' => $region['nombre'],
                'is_extreme_zone' => $isExtremeZone,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        DB::table('regions')->insert($regiones);
        $this->command->info('✅ ' . count($regiones) . ' regiones importadas');
        
        // Leer y procesar comunas
        $this->command->info('🏘️  Importando comunas desde JSON...');
        
        $comunasPath = database_path('seeders/data/ciudades.json');
        
        if (!file_exists($comunasPath)) {
            $this->command->error('❌ No se encontró el archivo ciudades.json');
            return;
        }
        
        $comunasJson = File::get($comunasPath);
        $comunasData = json_decode($comunasJson, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->command->error('❌ Error al parsear ciudades.json: ' . json_last_error_msg());
            return;
        }
        
        $comunas = [];
        foreach ($comunasData as $index => $comuna) {
            // Determinar si la comuna está en zona extrema
            $isExtremeZone = in_array($comuna['id_region'], [1, 15, 16]);
            
            $comunas[] = [
                'id' => $index + 1,
                'name' => $comuna['nombre'],
                'region_id' => $comuna['id_region'],
                'code' => null, // El código se puede agregar después si es necesario
                'is_extreme_zone' => $isExtremeZone,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        // Insert in chunks to avoid memory issues
        foreach (array_chunk($comunas, 100) as $chunk) {
            DB::table('communes')->insert($chunk);
        }
        
        $this->command->info('✅ ' . count($comunas) . ' comunas importadas');
        $this->command->newLine();
        $this->command->info('🎉 Importación completada exitosamente!');
        $this->command->info('📊 Resumen: ' . count($regiones) . ' regiones y ' . count($comunas) . ' comunas');
    }
}
