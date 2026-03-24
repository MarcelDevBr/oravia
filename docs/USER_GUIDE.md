# Guia do Usuário - Oravia Oracle 🔮

Bem-vindo ao **Oravia**, o ecossistema de inteligência financeira projetado para transformar projeções estáticas em ativos estratégicos. Este guia detalha como utilizar nossas ferramentas para validar a viabilidade do seu próximo grande negócio.

---

## 🚀 Início Rápido

Para rodar o ecossistema localmente, utilize nosso ambiente unificado:

1.  **Execução**: Na raiz do projeto, execute:
    ```bash
    ./dev.sh
    ```
2.  **Acesso**: A interface estará disponível em `http://localhost:3000`.

---

## 🔮 O Oráculo (Viabilidade Econômica 1.0)

O Oráculo é o nosso motor de simulação de alto impacto, focado em reduzir a carga cognitiva através de uma interface de **Hyperfocus**.

### 1. Novo Diagnóstico (The Stepper)
O processo é dividido em etapas lógicas para garantir a integridade dos dados:

*   **Identificação**: Nome do projeto e setor de atuação.
*   **Investimento**: Capital total necessário para o "Day Zero".
*   **Projeção Operacional**: Estimativas de faturamento e custos mensais.
    *   *Dica*: Use os sliders para simulações rápidas.
*   **Processamento**: O motor calcula os indicadores e gera os cenários de estresse.

### 2. Dashboard Estratégico
Após a simulação, você acessará uma visão 360º do projeto:

*   **Indicadores Meta (KPIs)**:
    *   **VPL**: Valor do projeto em moeda de hoje, descontado pela TMA.
    *   **TIR**: Rentabilidade real do investimento.
    *   **Payback**: Cronograma de retorno do capital.
*   **Módulos Especializados**: Abas dedicadas para **Vendas**, **OPEX** (Despesas) e **CAPEX** (Ativos).

---

## 📊 Inteligência e Risco

### Simulação de Monte Carlo
Uma dúvida comum: *O que são os 10.000 cenários?*
O Oravia executa uma **Simulação de Monte Carlo**, realizando 10.000 iterações estatísticas aleatórias sobre seus dados. Isso não gera 10.000 planilhas, mas sim uma **Probabilidade de Sucesso** baseada em variações de mercado, oferecendo uma camada de segurança muito superior a projeções lineares.

### Análise Multi-Cenário
Geração automática de sensibilidade:
- **Cenário Realista**: Seu plano base.
- **Cenário Otimista**: Janela de oportunidade (+20% receita).
- **Cenário Pessimista**: Teste de resiliência (-20% receita).

---

## 🔐 Modos de Acesso e Premium

### 1. Conta de Usuário (Oráculo Pro)
O Oravia Pro agora oferece suporte a **múltiplos projetos** e **sincronização em nuvem**:
- **Acesso**: Clique em **"Entrar / Cadastrar"** na barra lateral.
- **Vantagem**: Seus projetos são salvos de forma centralizada no banco de dados Supabase, permitindo acesso de qualquer dispositivo.
- **Versionamento Inteligente**: O sistema detecta projetos com o mesmo nome e cria automaticamente Versões (v1, v2), preservando o histórico de ajustes.

### 2. Recursos Exclusivos (BARREIRA PRO)
Alguns recursos avançados são exclusivos para membros Oravia Pro:
- **Comparativo Avançado**: Analise múltiplos projetos lado a lado em um dashboard unificado. 🔒
- **Exportação Excel**: Baixe seus DREs e projeções para manipulação externa. 🔒
- **Persistência em Nuvem**: Projetos ilimitados salvos na sua conta.

---

## 🛠️ Guia do Administrador (Configuração)

Se você estiver configurando o sistema pela primeira vez:
1. Localize o arquivo `frontend/.env.local`.
2. Insira suas chaves do Supabase:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=seu_url_aqui
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
   ```
3. Reinicie o servidor: `npm run dev`.

---

## 📂 Documentação para Desenvolvedores

Para detalhes sobre a arquitetura (FastAPI + Next.js + Supabase) e o Roadmap de evolução, consulte:
- **[ROADMAP.md](file:///home/marcel/Desenvolvimento/workspace/oravia/docs/ROADMAP.md)**
- **[README.md](file:///home/marcel/Desenvolvimento/workspace/oravia/README.md)**

---

**Oravia: A verdade matemática por trás de cada negócio.**
