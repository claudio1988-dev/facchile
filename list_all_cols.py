import pandas as pd
import json

file_path = r'public/Fichas_tecnicas-2026_02_14-18_22.xlsx'

# The IDs are there but price/stock might be missing or named differently
# Let's just list ALL columns
df = pd.read_excel(file_path, sheet_name='Senuelos de pesca', nrows=1)
print(json.dumps(df.columns.tolist(), indent=2))
