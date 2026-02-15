import pandas as pd

file_path = r'public/Fichas_tecnicas-2026_02_14-18_22.xlsx'

try:
    # Read without header assumption
    df = pd.read_excel(file_path, header=None)
    
    # Print first 15 rows as string to find the header
    print(df.head(15).to_string())

except Exception as e:
    print(f"Error reading excel: {e}")
