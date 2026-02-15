import pandas as pd
import json

file_path = r'public/Fichas_tecnicas-2026_02_14-18_22.xlsx'

try:
    # Load the Excel file to get sheet names
    xls = pd.ExcelFile(file_path)
    sheet_names = xls.sheet_names
    
    print(f"Found {len(sheet_names)} sheets: {sheet_names}")
    
    # Analyze the first few sheets (skipping 'Instrucciones' if present)
    data_summary = {}
    
    for sheet_name in sheet_names[:3]: # Check first 3 sheets
        print(f"\n--- Analyzing Sheet: {sheet_name} ---")
        try:
            # Read header first to find where data starts
            # Usually MeLi sheets have a header row. Let's look for 'ITEM_ID' or 'SKU'
            df_sample = pd.read_excel(xls, sheet_name=sheet_name, nrows=10, header=None)
            
            header_row_idx = -1
            for i, row in df_sample.iterrows():
                row_str = " ".join([str(x).lower() for x in row.values])
                if 'sku' in row_str or 'título' in row_str or 'item_id' in row_str:
                    header_row_idx = i
                    break
            
            if header_row_idx != -1:
                 df = pd.read_excel(xls, sheet_name=sheet_name, header=header_row_idx)
                 print(f"  Columns: {df.columns.tolist()[:10]}...") # Show first 10 cols
                 print(f"  Row count: {len(df)}")
                 print(f"  First row sample: {df.iloc[0].to_dict()}")
            else:
                 print("  Could not identify standard header. Raw top rows:")
                 print(df_sample.to_string())
                 
        except Exception as e:
            print(f"  Error reading sheet {sheet_name}: {e}")

except Exception as e:
    print(f"Error opening excel file: {e}")
