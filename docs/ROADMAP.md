# Oravia Product Roadmap 🚀

Este documento detalha o plano de evolução do Oravia, transformando a ferramenta inicial em um ecossistema completo de inteligência financeira e viabilidade econômica.

---

## 🛠️ Sprint Atual: Consolidação e UI/UX
**Foco**: Uniformização da interface e preparação para escala.

- [x] **Unificação da Interface**: Auditoria em todos os componentes Next.js para garantir consistência visual (Design System Oravia).
- [x] **Correção do Comparativo**: Resolução de bugs na tela de comparação de projetos para garantir fluidez entre cenários.
- [x] **Refinamento do Motor**: Ajuste na terminologia de "Cenários" para "Simulações de Monte Carlo" (10.000 iterações), visando maior clareza técnica.
- [x] **Versioning 1.0**: Implementação de lógica de versões (`v1`, `v2`) para simulações do mesmo projeto.

---

## 🏗️ Próximos Passos: Infraestrutura e Usuário
**Foco**: Segurança, persistência e gestão de contas.

- [ ] **Gestão de Identidade (Auth)**: Integração com Supabase para cadastro de usuários, login e recuperação de senhas.
- [ ] **Papeis e Permissões (RBAC)**: Definição de níveis de acesso (Admin, Consultor, Cliente).
- [ ] **Persistência de Projetos**: Sistema de salvamento em banco de dados com versionamento de simulações.
- [ ] **Relatórios Profissionais**: Geração de PDFs auditados e links compartilháveis para investidores.

---

## 💰 Monetização e Escala (B2C & B2B)
**Foco**: Geração de receita e expansão de mercado.

- [ ] **Sistema de Cobrança (Billing)**: Integração com Stripe/Asaas para pagamentos únicos (Relatórios) e assinaturas (White Label).
- [ ] **Módulo B2B (Consultoria)**: Funcionalidade para escritórios de contabilidade usarem o Oravia com sua própria marca.
- [ ] **Diferencial de Mercado**: Integração de IA preditiva (LLMs) para traduzir indicadores financeiros em conselhos acionáveis em tempo real.

---

## 🧪 Excelência e Segurança
- [ ] **Testes de Estresse**: Garantir que a arquitetura stateless suporte fluxos massivos de requisições.
- [ ] **Segurança de Dados**: Implementar Row Level Security (RLS) no banco de dados para proteção total dos números dos usuários.
- [ ] **Personas**: Refinamento das personas para direcionar o marketing (TDAH/TEA, Consultores Financeiros e Empreendedores Iniciantes).

---

> "Oravia: A verdade matemática por trás de cada negócio."
