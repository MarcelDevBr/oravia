# Oravia API
API de diagnóstico financeiro construída com FastAPI.

## Requisitos
- [uv](https://docs.astral.sh/uv/)

## Desenvolvimento
Para iniciar o servidor de desenvolvimento:
```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Testes
Para rodar os testes:
```bash
uv run pytest tests/test_api.py
```

### Estrutura de Importação
O projeto está configurado para que os testes e ferramentas de análise estática encontrem o pacote `app` corretamente:
- `pyrightconfig.json`: Configura o Pyright/Pylance para o VS Code.
- `pyproject.toml`: Configura o `pythonpath` para o `pytest`.
- `tests/conftest.py`: Auxilia na descoberta de pacotes.

## Endpoints Principais
- `GET /`: Mensagem de boas-vindas.
- `POST /api/v1/simulate`: Simulação financeira simples.
- `POST /api/v1/simulate/multi`: Simulação multi-cenário e Monte Carlo.
