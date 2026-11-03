import os
import requests

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
TABLE_NAME = "comentarios" 

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

url = f"{SUPABASE_URL}/rest/v1/{TABLE_NAME}?select=*&limit=1"

response = requests.get(url, headers=headers)

if response.status_code == 200:
    print("Ping no Supabase realizado com sucesso! Projeto ativo.")
else:
    print(f"Falha ao realizar o ping. Status: {response.status_code}, Erro: {response.text}")