import json
import re

# Read the raw prompt text or write the JSON protocols directly
with open('/src/data/medicamentosBrasil.ts', 'r', encoding='utf-8') as f:
    current_content = f.read()

# Let's check how many items are currently in MEDICAMENTOS_BRASIL
ids = re.findall(r'id:\s*(\d+)', current_content)
print(f"Current items count: {len(ids)}")
