import pandas as pd
import json

file_path = r'public/Fichas_tecnicas-2026_02_14-18_22.xlsx'

# Headers are: ID, SKU, TÍTULO, PRICE (not PRECIO), AVAILABLE_QUANTITY (not CANTIDAD), PICTURE_URL (not IMAGENES)
# Based on common MeLi exports.
# Let's inspect ONE full row to map column names.

df = pd.read_excel(file_path, sheet_name='Senuelos de pesca', nrows=1)
print("Available Columns:")
print(df.columns.tolist())

# Map relevant fields
mapping = {
    'ITEM_ID': ['ID', 'ITEM_ID'],
    'Title': ['TÍTULO', 'TITLE', 'PRODUCT_NAME'],
    'Price': ['PRECIO', 'PRICE'],
    'Stock': ['CANTIDAD', 'AVAILABLE_QUANTITY', 'STOCK'],
    'Image': ['IMÁGENES', 'PICTURE_URL', 'IMAGES', 'COVER_IMAGE']
}

print("\nAttempting to map:")
found_cols = {}
for key, candidates in mapping.items():
    match = next((c for c in df.columns if c in candidates), None)
    found_cols[key] = match

print(json.dumps(found_cols, indent=2))
