import pandas as pd
import json

file_path = r'public/Fichas_tecnicas-2026_02_14-18_22.xlsx'

# Determine header row - appears to be Row 0! (index 0)
# Step 436 output shows:
# Row 0: ['FAMILY_ID', 'ID', 'PRODUCT_NUMBER', 'SKU', 'VARIATION_ID', 'DOMAIN_ID', 'CATEGORY_ID', 'PARENT_C...
# This is clearly the header.

try:
    xls = pd.ExcelFile(file_path)
    sheet_names = [s for s in xls.sheet_names if s not in ['Ayuda', 'hidden']]
    
    print(f"Processing {len(sheet_names)} product sheets...")
    
    products_found = 0
    sample_products = []
    
    for sheet_name in sheet_names:
        try:
            # Read with header=0 (default)
            df = pd.read_excel(xls, sheet_name=sheet_name)
            
            # Identify columns
            # 'ID' seems to be the Item ID (MLC...)
            # 'SKU' is SKU
            # 'TÍTULO' is Title
            # 'PRECIO' is Price
            # 'CANTIDAD' is Stock
            # 'IMAGENES' containing URLs (usually)
            
            # Normalize column names
            df.columns = [str(c).upper().strip() for c in df.columns]
            
            # Check if critical columns exist
            if 'ID' in df.columns and 'TÍTULO' in df.columns:
               count = len(df)
               products_found += count
               
               # Get sample from first sheet
               if not sample_products and count > 0:
                   # Extract relevant fields
                   sample = df[['ID', 'SKU', 'TÍTULO', 'PRECIO', 'CANTIDAD', 'IMÁGENES'] if 'IMÁGENES' in df.columns else ['ID', 'SKU', 'TÍTULO', 'PRECIO', 'CANTIDAD']].head(3).to_dict(orient='records')
                   sample_products = sample
                   print(f"Sheet '{sheet_name}' has columns: {df.columns.tolist()[:10]}...")

        except Exception as e:
            print(f"Error processing sheet {sheet_name}: {e}")

    print(f"Total products found: {products_found}")
    print("Sample Data:")
    print(json.dumps(sample_products, indent=2, default=str))

except Exception as e:
    print(f"Error: {e}")
