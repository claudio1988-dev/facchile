import pandas as pd
import json

file_path = r'public/Fichas_tecnicas-2026_02_14-18_22.xlsx'

try:
    xls = pd.ExcelFile(file_path)
    sheet_names = [s for s in xls.sheet_names if s not in ['Ayuda', 'hidden']]
    
    # Analyze the 'Senuelos de pesca' sheet specifically
    sheet_name = 'Senuelos de pesca'
    
    # Read row 10 (index 10, which is the 11th row usually, or maybe index 9 if 0-based)
    # Let's read a chunk around row 10
    df = pd.read_excel(xls, sheet_name=sheet_name, header=None, skiprows=8, nrows=5)
    
    print(f"--- Rows 8-12 of {sheet_name} ---")
    print(df.to_string())
    
    # Check row 10 specifically (which is index 2 in our skiprows=8 df)
    header_row = df.iloc[2]
    print("\n--- Potential Header (Row 10) ---")
    print(header_row.tolist())

except Exception as e:
    print(f"Error: {e}")
