import json
import pandas as pd

file_path = r'public/Fichas_tecnicas-2026_02_14-18_22.xlsx'

# Mapping Sheet -> DB Category
sheet_map = {
    # PESCA
    "Senuelos de pesca": "senuelos", # General Senuelos
    "Carretes de pesca": "carretes-de-pesca", # General Carretes
    "Canas de pescar": "canas-de-pesca", # General Canas
    "Lineas de pesca": "lineas",
    "Anzuelos de pesca": "anzuelos-jig-heads",
    "Remeras de pesca": "indumentaria-pesca",
    "Portacanas de pesca": "equipamiento-pesca",
    "Cajas de accesorios de pesca": "cajas-de-senuelos",
    "Boyas de pesca": "accesorios-pesca-tradicional",
    "Guantes y mitones para pesca": "indumentaria-pesca",
    "Pinzas de pesca": "herramientas-pesca",
    "Imanes para pesca": "accesorios-pesca-tradicional",
    
    # OUTDOOR / CAMPING
    "Equipamiento para camping y ...": "equipamiento-outdoor", # General Outdoor
    "Linternas": "iluminacion",
    "Infladores manuales y de pie": "esenciales-camping",
    "Cargadores de baterias y pilas": "accesorios-supervivencia", 
    "Bolsas secas": "mochilas-y-bolsos",
    "Mochilas": "mochilas-y-bolsos",
    "Bolsas de hidratacion": "hidratacion", 
    
    # CUCHILLERÍA / ARMAS / CAZA
    "Cuchillos tacticos y deportivos": "cuchillos",
    "Cuchillos de buceo": "cuchillos-outdoor",
    "Cuchillos de cocina": "cuchillos-cocina",
    "Fundas para armas": "accesorios-caza",
    "Afiladores manuales para el ...": "herramientas-pesca", # Can be confusing, but closer to tool maintenance
    "Redes de caza": "accesorios-caza",
    "Bastones de tiro": "accesorios-caza",
    "Postones": "postones",
    
    # ROPA
    "Trajes de neopreno": "waders",
    "Waders": "waders",
    "Lentes deportivos": "anteojos-y-straps",
    
    # OTHER
    "Articulos de belleza y cuida...": "accesorios-vestuario",
    "Deportes y fitness": "outdoor",
    "Suplementos": "outdoor",
    "Equipamiento para aerobics y...": "outdoor",
    "Medidores laser": "opticos",
    "Maletas": "bolsos-y-mochilas-pesca",
    "Cronometros": "accesorios-vestuario"
}

try:
    xls = pd.ExcelFile(file_path)
    sheet_names = [s for s in xls.sheet_names if s not in ['Ayuda', 'hidden']]
    
    products_list = []
    
    print(f"Processing {len(sheet_names)} sheets with refined mapping...")
    
    for sheet_name in sheet_names:
        # Get category slug from map, default to 'outdoor' if unknown
        cat_slug = sheet_map.get(sheet_name, 'outdoor')
        
        try:
            # Read Sheet (Header=0 based on finding)
            df = pd.read_excel(xls, sheet_name=sheet_name, header=0)
            
            # Normalize Headers
            df.columns = [str(c).upper().strip() for c in df.columns]
            
            # Identify columns dynamically
            def get_col(candidates):
                for c in candidates:
                    if c in df.columns: return c
                return None
            
            title_col = get_col(['TÍTULO', 'TITLE', 'PRODUCT_NAME', 'NAME'])
            sku_col = get_col(['SKU', 'PRODUCT_NUMBER', 'ID'])
            brand_col = get_col(['BRAND', 'MARCA', 'MANUFACTURER'])
            model_col = get_col(['MODEL', 'MODELO'])
            
            if not title_col:
                print(f"Warning: No title column in {sheet_name}, skipping.")
                continue

            for _, row in df.iterrows():
                title = row.get(title_col)
                if pd.isna(title): continue
                
                # cleaner title
                title_clean = str(title).strip()
                
                # Skip metadata rows often found in these dumps
                # If title is literally "Título" or "Title" or "Fixed" or "Attribute"
                if title_clean.upper() in ['TÍTULO', 'TITLE', 'PRODUCT_NAME', 'NAME', 'FIXED', 'ATTRIBUTE', 'VALUES', 'GROUPS', 'TAGS']:
                    continue
                    
                # Skip if ID or SKU looks like a header
                current_id = str(row.get('ID', '')).upper()
                if current_id in ['ID', 'ITEM_ID']: continue

                sku = row.get(sku_col, 'GEN-SKU')
                brand = row.get(brand_col, 'Genérico')
                model = row.get(model_col, '')
                
                # Construct description from available attributes
                description = f"<b>{title_clean}</b><br>"
                if pd.notna(model) and str(model).strip() and str(model).upper() not in ['MODEL', 'MODELO']:
                    description += f"Modelo: {model}<br>"
                
                # Add extra attributes found in row to description
                # Filter out empty or system columns
                # Translation map for common technical specs
                translations = {
                    'WEIGHT': 'Peso',
                    'LENGTH': 'Largo',
                    'HEIGHT': 'Altura',
                    'WIDTH': 'Ancho',
                    'DEPTH': 'Profundidad',
                    'MATERIAL': 'Material',
                    'COLOR': 'Color',
                    'SIZE': 'Tamaño',
                    'CAPACITY': 'Capacidad',
                    'LINE_CAPACITY': 'Capacidad de línea',
                    'GEAR_RATIO': 'Relación de transmisión',
                    'MAX_DRAG': 'Freno Máximo',
                    'BEARINGS_NUMBER': 'Rodamientos',
                    'ROD_ACTION': 'Acción',
                    'ROD_POWER': 'Potencia',
                    'SECTIONS_NUMBER': 'Secciones',
                    'LURE_WEIGHT': 'Peso de señuelo',
                    'MAX_HEIGHT': 'Altura Máxima',
                    'MAX_WEIGHT_SUPPORTED': 'Peso Máximo Soportado',
                    'SHOOTING_STICK_TYPE': 'Tipo de soporte',
                    'IS_WATERPROOF': 'Es impermeable',
                    'WITH_UV_PROTECTION': 'Con protección UV',
                    'LENS_COLOR': 'Color del lente',
                    'FRAME_COLOR': 'Color del marco',
                    'TEMPLE_COLOR': 'Color de la varilla',
                    'LENS_MATERIAL': 'Material del lente',
                    'FRAME_MATERIAL': 'Material del marco'
                }

                # Ignored columns update
                ignored_cols = [
                    'ID', 'FAMILY_ID', 'DOMAIN_ID', 'CATEGORY_ID', 'PARENT_CATEGORY_ID', 
                    title_col, sku_col, brand_col, model_col,
                    'CHECK_SUMS', 'VARIATION_ID', 'GTIN', 'SELLER_SKU', 'PRODUCT_NUMBER', 'ITEM_NUMBER',
                    'MAIN_COLOR', 'COLOR_PRIMARY_COLOR', 'tags', 'eshop_id', 'catalog_product_id'
                ]
                
                specs = []
                processed_cols = set()
                
                # First pass to identify columns to process (avoiding duplicates if logic changes)
                cols_to_process = [c for c in df.columns if c not in processed_cols]
                
                for col in cols_to_process:
                    col_str = str(col)
                    col_upper = col_str.upper().strip()
                    
                    if col_upper in processed_cols: continue
                    
                    # Check if ignored
                    is_ignored = False
                    for ignored in ignored_cols:
                        if ignored.upper() == col_upper:
                            is_ignored = True
                            break
                    if is_ignored: continue

                    # Check if it's a UNIT column (handled with base column)
                    if col_upper.endswith('_UNIT'): continue

                    if pd.notna(row[col]):
                        val = str(row[col]).strip()
                        
                        # Filter invalid values
                        if val.upper() in ['FIXED', 'ATTRIBUTE', 'N/A', 'NAN', 'IGNORE', 'MANDATORY', 'OPTIONAL', 'NO APLICA']: continue
                        
                        # Look for a unit column
                        unit_col = None
                        possible_unit_cols = [col_str + '_UNIT', col_str.replace('WEIGHT', 'WEIGHT_UNIT'), col_str.replace('LENGTH', 'LENGTH_UNIT')]
                        
                        unit_val = ""
                        for uc in possible_unit_cols:
                            if uc in df.columns and pd.notna(row[uc]):
                                u_val = str(row[uc]).strip()
                                if u_val and u_val.upper() not in ['N/A', 'NAN']:
                                    unit_val = u_val
                                    processed_cols.add(uc.upper()) # Mark unit as processed
                                    break
                        
                        # Format final string
                        display_val = f"{val} {unit_val}".strip()
                        
                        # Translate key
                        display_key = translations.get(col_upper, col.title().replace('_', ' '))
                        
                        specs.append(f"{display_key}: {display_val}")
                        processed_cols.add(col_upper)
                
                if specs:
                    description += "<ul>" + "".join([f"<li>{s}</li>" for s in specs[:15]]) + "</ul>" # Limit specs
                
                products_list.append({
                    "name": title_clean,
                    "category_slug": cat_slug, 
                    "brand_name": str(brand).strip() if pd.notna(brand) and str(brand).upper() not in ['BRAND', 'MARCA'] else "Genérico",
                    "sku": str(sku).strip() if pd.notna(sku) else None,
                    "description": description,
                    "sheet_source": sheet_name
                })
                
        except Exception as e:
            print(f"Error reading sheet {sheet_name}: {e}")

    print(f"Total extracted: {len(products_list)}")
    
    with open('import_data_final.json', 'w', encoding='utf-8') as f:
        json.dump(products_list, f, indent=2, ensure_ascii=False)
        
    print("Saved import_data_final.json")

except Exception as e:
    print(f"Global Error: {e}")
