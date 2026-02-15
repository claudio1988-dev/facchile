import pandas as pd
import json
import os

file_path = r'public/Fichas_tecnicas-2026_02_14-18_22.xlsx'

try:
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        exit(1)

    # Read the excel file
    # engine='openpyxl' is default for xlsx
    df = pd.read_excel(file_path)
    
    # Get basic info
    info = {
        "columns": df.columns.tolist(),
        "row_count": len(df),
        "sample_data": df.head(3).to_dict(orient='records')
    }
    
    print(json.dumps(info, indent=4, default=str))

except Exception as e:
    print(f"Error reading excel: {e}")
