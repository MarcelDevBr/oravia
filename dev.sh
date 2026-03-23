#!/bin/bash

# Script para iniciar o Backend e o Frontend simultaneamente

# Função para encerrar todos os processos ao fechar o script
trap "kill 0" EXIT

# Adicionar node-env ao PATH se existir
if [ -d "oravia-api/node-env/bin" ]; then
    export PATH="$PWD/oravia-api/node-env/bin:$PATH"
fi

echo "🚀 Iniciando Oravia..."

# 1. Iniciar o Backend (FastAPI)
echo "📡 Iniciando Backend na porta 8000..."
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &

# 2. Iniciar o Frontend (Next.js)
echo "💻 Iniciando Frontend na porta 3000..."
(cd frontend && npm run dev) &

# Aguarda os processos
wait
