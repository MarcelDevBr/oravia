# Oravia Oracle 🔮

> **A verdade matemática por trás de cada negócio.**

O **Oravia** é um ecossistema de inteligência financeira de alta performance, projetado para transformar projeções estáticas em diagnósticos dinâmicos e estratégicos. Combinando a precisão do `Numpy-Financial` com a agilidade do `Next.js`, o Oravia oferece uma experiência de Viabilidade Econômica 1.0 (Beta) sem precedentes.

---

## ✨ Principais Funcionalidades

- **Oráculo Financeiro**: Motor de cálculo assíncrono para VPL (NPV), TIR (IRR), Payback e ROI.
- **Hyperfocus UI**: Interface baseada em Steppers para reduzir a carga cognitiva e focar no que importa.
- **Simulação de Monte Carlo**: Análise de risco estatístico executando 10.000 trials para prever a probabilidade de sucesso.
- **Análise Multi-Cenário**: Geração automática de cenários Realista, Otimista e Pessimista.
- **EVE Knowledge**: Módulo educativo integrado para democratizar o conhecimento financeiro.

---

## 🏗️ Estrutura do Ecossistema

- **[`frontend/`](file:///home/marcel/Desenvolvimento/workspace/oravia/frontend)**: Aplicação web construída com Next.js 14, Tailwind CSS e Framer Motion para animações fluidas e premium.
- **[`oravia-api/`](file:///home/marcel/Desenvolvimento/workspace/oravia/oravia-api)**: API REST robusta em FastAPI, gerenciada pelo moderno `uv` para performance máxima.

---

## 🚀 Guia de Início Rápido

O projeto utiliza um **UV Workspace** para gerenciar dependências de forma eficiente.

### Modo Unificado (Backend + Frontend)
Inicie o ambiente completo com um único comando na raiz:
```bash
./dev.sh
```

### Comandos Individuais
**API (Backend)**:
```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Interface (Frontend)**:
```bash
cd frontend && npm run dev
```

---

## 🧪 Excelência Técnica

Nossa engenharia prioriza a precisão bancária e a escalabilidade:
- **Testes Unitários**: Validação rigorosa dos cálculos financeiros comparados a padrões de mercado.
- **Architecture**: Design stateless preparado para escala vertical e horizontal.
- **Package Management**: Uso do `uv` para resolução instantânea de dependências.

---

## 🗺️ Roadmap e Evolução
Para acompanhar os planos futuros de monetização (B2B/B2C) e novas funcionalidades, consulte nosso [ROADMAP.md](file:///home/marcel/Desenvolvimento/workspace/oravia/docs/ROADMAP.md).

---

**Oravia: Inteligência, Matemática e Visão.**
