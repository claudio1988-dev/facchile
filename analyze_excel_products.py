import pandas as pd
import json

file_path = r'public/Fichas_tecnicas-2026_02_14-18_22.xlsx'

try:
    xls = pd.ExcelFile(file_path)
    sheet_names = [s for s in xls.sheet_names if s not in ['Ayuda', 'hidden']]
    
    print(f"Analyzing {len(sheet_names)} product sheets...")
    
    all_products = []
    
    for sheet_name in sheet_names:
        try:
            # Read first few rows to find header
            df_head = pd.read_excel(xls, sheet_name=sheet_name, nrows=10, header=None)
            header_idx = -1
            
            # Simple heuristic: look for typical MeLi headers
            for i, row in df_head.iterrows():
                row_str = " ".join([str(x).upper() for x in row.values])
                if 'ITEM_ID' in row_str or 'TITULO' in row_str or 'SKU' in row_str:
                    header_idx = i
                    break
            
            if header_idx != -1:
                df = pd.read_excel(xls, sheet_name=sheet_name, header=header_idx)
                
                # Standardize column names if needed (MeLi usually has consistency)
                # We want mainly: ITEM_ID, SKU, TITULO, PRECIO (if available), CANTIDAD (stock), IMAGENES (if avail)
                # But headers might be 'Título', 'SKU', 'Precio', etc.
                
                # Let's map columns to a standard dict
                for _, row in df.iterrows():
                    # Safely get values
                    def get_val(col_name):
                        if col_name in df.columns: return row[col_name]
                        # Try case insensitive match
                        match = next((c for c in df.columns if str(c).upper() == col_name.upper()), None)
                        return row[match] if match else None
                        
                    product = {
                        "sheet": sheet_name,
                        "item_id": get_val('ITEM_ID'),
                        "sku": get_val('SKU'),
                        "title": get_val('TÍTULO') or get_val('TITULO'),
                        "price": get_val('PRECIO') or get_val('PRICE'),
                        "stock": get_val('CANTIDAD') or get_val('STOCK') or get_val('AVAILABLE_QUANTITY'),
                        # Add more fields if necessary based on user needs
                    }
                    all_products.append(product)
        except Exception as sheet_err:
            print(f"Skipping sheet {sheet_name}: {sheet_err}")

    print(f"Total products found across all sheets: {len(all_products)}")
    
    # Show a sample
    if all_products:
        print("\nSample Products:")
        print(json.dumps(all_products[:5], indent=2, default=str))
        
        # Check specific fields presence
        df_all = pd.DataFrame(all_products)
        print("\nColumn completeness check:")
        print(df_all.count())

except Exception as e:
    print(f"Error processing excel: {e}")
