import pandas as pd
import json

file_path = r'public/Fichas_tecnicas-2026_02_14-18_22.xlsx'

df_sample = pd.read_excel(file_path, sheet_name='Senuelos de pesca', header=None, nrows=20)
print("--- Senuelos de pesca Sample (First 20 rows) ---")
print(df_sample.to_string())

print("\n--- Columns in Row 10 ---") # Based on previous visual inspection, row 10 looked header-like? 
# Wait, previous step output showed "SKU" in row 2 as "FIXED" and row 4 as "SKU" again?
# Let's just dump raw rows to be sure.
