import pandas as pd

file_path = r'public/Fichas_tecnicas-2026_02_14-18_22.xlsx'

try:
    # Read sheet "Senuelos de pesca" with default header=0
    df = pd.read_excel(file_path, sheet_name='Senuelos de pesca')
    print("Columns found (Header=0):")
    print(df.columns.tolist()[:20]) # First 20 cols
    
except Exception as e:
    print(e)
