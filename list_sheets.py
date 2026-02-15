import pandas as pd
import json

file_path = r'public/Fichas_tecnicas-2026_02_14-18_22.xlsx'

# Mapping Excel sheets to our DB Categories (slugs)
# Based on the user's request to categorize products correctly.
# We need to list all sheet names to map them manually in the next step.
xls = pd.ExcelFile(file_path)
sheet_names = [s for s in xls.sheet_names if s not in ['Ayuda', 'hidden']]

print(json.dumps(sheet_names, indent=2))
