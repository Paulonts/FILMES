import firebase_admin
from firebase_admin import credentials, storage
import os


cred = credentials.Certificate("firebase-key.json")

firebase_admin.initialize_app(cred, {
    'storageBucket': 'imovies-db9a2.firebasestorage.app'
})

bucket = storage.bucket()

def subir_filmes_seguros(caminho_computador):
    if not os.path.exists(caminho_computador):
        print(f"ERRO: Pasta nao encontrada: {caminho_computador}")
        return

    print("--- Iniciando Processo de Upload Seguro ---")
    
    for arquivo in os.listdir(caminho_computador):
        if arquivo.endswith(".mp4") or arquivo.endswith(".mkv"):
            # Removido o emoji de foguete para evitar o erro de Unicode no Windows
            print(f"Enviando: {arquivo}...")
            
            blob = bucket.blob(f"videos/{arquivo}")
            blob.upload_from_filename(os.path.join(caminho_computador, arquivo))
            
            # Torna o link publico para o seu site
            blob.make_public()
            
            print(f"Concluido! Link para o seu JS: {blob.public_url}")
            print("-" * 30)

# Caminho da sua pasta no PC
caminho_da_sua_pasta = r"C:\Users\paulo\OneDrive\Desktop\filmes"

subir_filmes_seguros(caminho_da_sua_pasta)