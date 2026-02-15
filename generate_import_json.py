import pandas as pd
import json
import re

# File path
file_path = r'public/Fichas_tecnicas-2026_02_14-18_22.xlsx'

# Map Sheet Names to DB Category Slugs
# Based on list_sheets.py output and AdminPanelSeeder.php structure
sheet_map = {
    # Pesca related
    "Senuelos de pesca": "senuelos",
    "Carretes de pesca": "carretes-de-pesca",
    "Canas de pescar": "canas-de-pesca",
    "Lineas de pesca": "lineas",
    "Anzuelos de pesca": "anzuelos-jig-heads", # Best fit
    "Remeras de pesca": "indumentaria-pesca",
    "Portacanas de pesca": "equipamiento-pesca", # General fallback
    "Cajas de accesorios de pesca": "cajas-de-senuelos",
    "Boyas de pesca": "accesorios-pesca-tradicional", # General fallback
    "Guantes y mitones para pesca": "indumentaria-pesca",
    "Pinzas de pesca": "herramientas-pesca",
    "Imanes para pesca": "accesorios-pesca-tradicional",
    
    # Camping/Outdoor
    "Equipamiento para camping y ...": "equipamiento-outdoor",
    "Linternas": "iluminacion",
    "Infladores manuales y de pie": "esenciales-camping", # Fallback
    "Cargadores de baterias y pilas": "tecnologia", # (Removed from DB, map to generic or skip?) -> Let's map to 'accesorios-supervivencia' or similar since tech is removed. Or 'iluminacion' if related. Let's use 'equipamiento-outdoor' for now.
    "Bolsas secas": "mochilas-y-bolsos",
    "Mochilas": "mochilas-y-bolsos",
    "Bolsas de hidratacion": "hidratacion",
    
    # Cuchillería / Armas
    "Cuchillos tacticos y deportivos": "cuchillos",
    "Cuchillos de buceo": "cuchillos-outdoor",
    "Cuchillos de cocina": "cuchillos-cocina",
    "Fundas para armas": "accesorios-caza",
    "Afiladores manuales para el ...": "accesorios-caza",
    "Redes de caza": "accesorios-caza",
    "Bastones de tiro": "accesorios-caza",
    "Postones": "postones",
    
    # Clothing / Waders
    "Trajes de neopreno": "waders",
    "Waders": "waders",
    "Lentes deportivos": "anteojos-y-straps",
    
    # Others / Misc
    "Articulos de belleza y cuida...": "accesorios-vestuario", # Fallback
    "Deportes y fitness": "entrenamiento", # No direct cat
    "Suplementos": "entrenamiento", # No direct cat
    "Equipamiento para aerobics y...": "entrenamiento", # No direct cat
    "Medidores laser": "opticos", # Close match
    "Maletas": "bolsos-y-mochilas-pesca", # Or travel
    "Cronometros": "accesorios-vestuario" # Fallback
}

def clean_slug(text):
    text = str(text).lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

try:
    xls = pd.ExcelFile(file_path)
    sheet_names = [s for s in xls.sheet_names if s not in ['Ayuda', 'hidden']]
    
    products_to_seed = []
    
    print(f"Processing {len(sheet_names)} sheets...")
    
    for sheet_name in sheet_names:
        # Determine category slug
        cat_slug = sheet_map.get(sheet_name)
        
        # If no direct map, try to guess or skip
        if not cat_slug:
            # Simple heuristic mapping if exact name match wasn't found
            lower_name = sheet_name.lower()
            if 'pesca' in lower_name: cat_slug = 'pesca-deportiva'
            elif 'cuchillo' in lower_name: cat_slug = 'cuchillos'
            elif 'camping' in lower_name: cat_slug = 'equipamiento-outdoor'
            else: cat_slug = 'outdoor' # Generic fallback
            
        try:
            # Read Sheet (Header=0 based on finding)
            df = pd.read_excel(xls, sheet_name=sheet_name, header=0)
            
            # Normalize Headers
            df.columns = [str(c).upper().strip() for c in df.columns]
            
            # Key Columns
            # ID, TITLE, SKU need to exist. 
            # If TITLE missing, skip row.
            
            if 'TÍTULO' not in df.columns and 'TITLE' not in df.columns:
                print(f"Skipping {sheet_name}: No Title column found.")
                continue
                
            title_col = 'TÍTULO' if 'TÍTULO' in df.columns else 'TITLE'
            sku_col = 'SKU' if 'SKU' in df.columns else 'PRODUCT_NUMBER' # Fallback
            id_col = 'ID' if 'ID' in df.columns else 'ITEM_ID'
            
            # Iterate rows
            for _, row in df.iterrows():
                product_name = row.get(title_col)
                if pd.isna(product_name): continue
                
                sku = row.get(sku_col)
                if pd.isna(sku): sku = f"GEN-{clean_slug(product_name)[:10]}-{row.get(id_col, '000')}"
                
                description = f"Producto importado de categoría {sheet_name}. "
                # Add some specs if available
                if 'MODEL' in df.columns and pd.notna(row.get('MODEL')):
                    description += f"Modelo: {row['MODEL']}. "
                
                products_to_seed.append({
                    "name": str(product_name).strip(),
                    "slug": clean_slug(str(product_name)) + "-" + str(sku)[:5],
                    "category_slug": cat_slug,
                    "sku": str(sku),
                    "description": description,
                    "brand": str(row.get('BRAND', 'Genérico')).strip()
                })
                
        except Exception as sheet_err:
            print(f"Error reading {sheet_name}: {sheet_err}")

    print(f"Extracted {len(products_to_seed)} products.")
    
    # Save to JSON to be used by a PHP seeder or command
    with open('products_to_import.json', 'w', encoding='utf-8') as f:
        json.dump(products_to_seed, f, indent=2, ensure_ascii=False)
        
    print("Saved products_to_import.json")

except Exception as e:
    print(f"Global Error: {e}")
