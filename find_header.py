import pandas as pd

# The previous inspect showed raw data starting around row 11/12
# The headers usually are right above. 
# Row 10 (index 10) was mostly NaN 
# Let's check row 9 (index 9) and 10 more carefully

file_path = r'public/Fichas_tecnicas-2026_02_14-18_22.xlsx'
sheet_name = 'Senuelos de pesca'

df = pd.read_excel(file_path, sheet_name=sheet_name, header=None, nrows=15)
print("\n--- Rows 0-14 ---")
for i, row in df.iterrows():
    print(f"Row {i}: {row.tolist()[:10]}") # First 10 cols
