import pandas as pd
import json

file_path = r'public/Fichas_tecnicas-2026_02_14-18_22.xlsx'

try:
    # Read first 20 rows to find header
    raw_df = pd.read_excel(file_path, header=None, nrows=20)
    
    header_idx = -1
    for i, row in raw_df.iterrows():
        # Check for typical MeLi columns
        # Convert to string and handle potential NaN
        row_values = [str(x).lower() if pd.notna(x) else '' for x in row.values]
        
        # 'sku' is often used, 'título' might be encoded weirdly, 'item_id' is common
        if 'sku' in row_values or 'título' in row_values or 'titulo' in row_values or 'item_id' in row_values:
            header_idx = i
            break
            
    if header_idx != -1:
        print(f"Header found at row index: {header_idx}")
        # Read full DF with correct header
        df = pd.read_excel(file_path, header=header_idx)
        
        # Filter to relevant columns if many exist
        # We want to see what's available
        info = {
            "columns": df.columns.tolist(),
            "sample_data": df.head(3).to_dict(orient='records')
        }
        print(json.dumps(info, indent=4, default=str))
    else:
        print("Could not identify header row automatically.")
        print("First 10 rows for manual inspection:")
        print(raw_df.head(10).to_string())

except Exception as e:
    print(f"Error reading excel: {e}")
