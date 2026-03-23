# ORAVIA
ORAVIA: A verdade matemática por trás de cada negócio.

Este repositório contém o projeto Oravia, um estúdio cinematográfico de produção de documentários e ferramenta de diagnóstico financeiro.

## Estrutura do Projeto
- `frontend/`: Aplicação web construída com Next.js (Tailwind CSS, TypeScript).
- `oravia-api/`: API REST construída com FastAPI e gerenciada pelo `uv`.

## Como Iniciar

Agora que o projeto está organizado como um **UV Workspace**, você pode rodar a API de qualquer lugar na raiz:

### 🚀 Modo Rápido (Backend + Frontend)
Para iniciar ambos simultaneamente, use o script `dev.sh` na raiz:
```bash
./dev.sh
```

### 1. API (Backend)
```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
A API estará disponível em `http://localhost:8000`.

### 2. Frontend
Navegue até o diretório do frontend:
```bash
cd frontend
npm run dev
```

## Testes
Os testes da API podem ser rodados diretamente da raiz:
```bash
uv run pytest oravia-api/tests/test_api.py
```

## Estrutura de Desenvolvimento
- **Workspace**: O arquivo `pyproject.toml` na raiz gerencia as dependências de todo o projeto.
- **Editable**: A `oravia-api` está instalada como uma dependência editável, então qualquer mudança no código da API é refletida imediatamente.
- **Configurações**: Linter (Pyright) e Testes (Pytest) estão configurados para funcionar perfeitamente com esta estrutura.
