# Planejamento Completo - MVP PlenoPsi
## Estrutura de Issues (39 Issues)

Este documento lista todas as 39 issues que serão criadas para o MVP do PlenoPsi.

---

## 📊 Issue #1 (Já Existente)
**Título:** Planejamento Macro - MVP PlenoPsi  
**Tipo:** Epic Principal  
**Status:** ✅ Criada

---

## 🎯 Issues de Fase (10 Issues - #2 a #11)

### Issue #2 - Fase 1: Planejamento e Estruturação
- **Duração:** Semanas 1-2
- **Sub-issues:** 3 (1.1, 1.2, 1.3)
- **Labels:** fase-1, planejamento
- **Bloqueada por:** Nenhuma

### Issue #3 - Fase 2: Design e Prototipagem
- **Duração:** Semanas 3-4
- **Sub-issues:** 2 (2.1, 2.2)
- **Labels:** fase-2, design
- **Bloqueada por:** #2 (Fase 1)

### Issue #4 - Fase 3: Desenvolvimento Backend
- **Duração:** Semanas 5-8
- **Sub-issues:** 5 (3.1, 3.2, 3.3, 3.4, 3.5)
- **Labels:** fase-3, backend
- **Bloqueada por:** #2, #3 (Fases 1 e 2)

### Issue #5 - Fase 4: Desenvolvimento Frontend
- **Duração:** Semanas 7-10
- **Sub-issues:** 3 (4.1, 4.2, 4.3)
- **Labels:** fase-4, frontend
- **Bloqueada por:** #3, #4 (Fases 2 e 3)

### Issue #6 - Fase 5: Testes
- **Duração:** Semanas 9-11
- **Sub-issues:** 3 (5.1, 5.2, 5.3)
- **Labels:** fase-5, testes
- **Bloqueada por:** #4, #5 (Fases 3 e 4)

### Issue #7 - Fase 6: Deploy e Infraestrutura
- **Duração:** Semanas 11-12
- **Sub-issues:** 3 (6.1, 6.2, 6.3)
- **Labels:** fase-6, infraestrutura
- **Bloqueada por:** #4, #5, #6 (Fases 3, 4 e 5)

### Issue #8 - Fase 7: Documentação
- **Duração:** Semanas 12-13
- **Sub-issues:** 2 (7.1, 7.2)
- **Labels:** fase-7, documentação
- **Bloqueada por:** #4, #5 (Fases 3 e 4)

### Issue #9 - Fase 8: Lançamento Beta
- **Duração:** Semanas 13-15
- **Sub-issues:** 2 (8.1, 8.2)
- **Labels:** fase-8, beta
- **Bloqueada por:** #7, #8 (Fases 6 e 7)

### Issue #10 - Fase 9: Versionamento e Release
- **Duração:** Semanas 15-16
- **Sub-issues:** 3 (9.1, 9.2, 9.3)
- **Labels:** fase-9, release
- **Bloqueada por:** #9 (Fase 8)

### Issue #11 - Fase 10: Pós-Lançamento e Melhoria Contínua
- **Duração:** Contínua (pós-semana 16)
- **Sub-issues:** 2 (10.1, 10.2)
- **Labels:** fase-10, pós-lançamento
- **Bloqueada por:** #10 (Fase 9)

---

## 🔧 Sub-Issues (27 Issues)

### Fase 1 - Sub-issues (3)

#### Issue 1.1 - Definição de Requisitos
- **Tarefas:**
  - Levantamento de funcionalidades essenciais do MVP
  - Definição de personas
  - Mapeamento de jornada do usuário
  - Definição de critérios de aceitação
  - Priorização de features (MoSCoW)
- **Labels:** fase-1, requisitos, documentação

#### Issue 1.2 - Arquitetura e Tecnologia
- **Tarefas:**
  - Definição da stack tecnológica
  - Arquitetura da solução
  - Definição de integrações necessárias
  - Escolha de serviços cloud
  - Planejamento de segurança e LGPD/HIPAA
- **Labels:** fase-1, arquitetura, tecnologia

#### Issue 1.3 - Configuração do Projeto
- **Tarefas:**
  - Estrutura de repositórios
  - Configuração de ambientes (dev/staging/prod)
  - Setup de CI/CD
  - Configuração de ferramentas
  - Documentação inicial
- **Labels:** fase-1, configuração, devops

### Fase 2 - Sub-issues (2)

#### Issue 2.1 - Design System e UI/UX
- **Tarefas:**
  - Definição de paleta de cores
  - Tipografia e hierarquia visual
  - Componentes reutilizáveis
  - Padrões de layout e grid system
  - Guia de estilo e documentação
- **Labels:** fase-2, design-system, ui-ux

#### Issue 2.2 - Protótipos de Alta Fidelidade
- **Tarefas:**
  - Wireframes de baixa fidelidade
  - Protótipos de alta fidelidade
  - Fluxos de navegação completos
  - Protótipo interativo/navegável
  - Validação com usuários
- **Labels:** fase-2, prototipagem, validação

### Fase 3 - Sub-issues (5)

#### Issue 3.1 - Configuração do Backend e Banco de Dados
- **Tarefas:**
  - Setup do framework backend
  - Configuração do banco de dados
  - Migrations e schema inicial
  - Seeders para dados de desenvolvimento
  - Configuração de variáveis de ambiente
- **Labels:** fase-3, backend, database

#### Issue 3.2 - API de Autenticação e Usuários
- **Tarefas:**
  - Endpoints de registro e login
  - JWT ou OAuth2 para autenticação
  - Gestão de sessões
  - Recuperação de senha
  - Perfis de usuário
- **Labels:** fase-3, autenticação, api

#### Issue 3.3 - API de Pacientes
- **Tarefas:**
  - Model e schema de pacientes
  - Endpoints CRUD
  - Validações e regras de negócio
  - Soft delete para manter histórico
  - Busca e filtros
- **Labels:** fase-3, pacientes, api

#### Issue 3.4 - API de Agendamentos
- **Tarefas:**
  - Model de agendamentos
  - Endpoints para criar/editar/cancelar consultas
  - Validação de conflitos de horário
  - Sistema de notificações/lembretes
  - Integração com calendário
- **Labels:** fase-3, agendamentos, api

#### Issue 3.5 - API Financeira
- **Tarefas:**
  - Model de transações financeiras
  - Endpoints para recebimentos e despesas
  - Cálculo de relatórios financeiros
  - Emissão de recibos
  - Categorização de transações
- **Labels:** fase-3, financeiro, api

### Fase 4 - Sub-issues (3)

#### Issue 4.1 - Setup Frontend e Componentes Base
- **Tarefas:**
  - Setup do framework (React, Next.js, Vue)
  - Configuração de roteamento
  - Setup de estado global
  - Implementação de componentes do design system
  - Setup de testes frontend
- **Labels:** fase-4, frontend, setup

#### Issue 4.2 - Telas de Autenticação e Perfil
- **Tarefas:**
  - Tela de login
  - Tela de registro
  - Recuperação de senha
  - Tela de perfil do usuário
  - Integração com API de autenticação
- **Labels:** fase-4, autenticação, frontend

#### Issue 4.3 - Dashboard e Telas Principais
- **Tarefas:**
  - Dashboard com visão geral
  - Telas de gestão de pacientes
  - Agenda de consultas
  - Gestão financeira
  - Relatórios e gráficos
- **Labels:** fase-4, dashboard, frontend

### Fase 5 - Sub-issues (3)

#### Issue 5.1 - Testes Unitários Backend
- **Tarefas:**
  - Testes de controllers
  - Testes de services/business logic
  - Testes de models
  - Testes de utils e helpers
  - Alcançar cobertura mínima de 80%
- **Labels:** fase-5, testes, backend

#### Issue 5.2 - Testes Unitários e de Componentes Frontend
- **Tarefas:**
  - Testes de componentes
  - Testes de hooks customizados
  - Testes de utils
  - Testes de integração de telas
  - Alcançar cobertura mínima de 70%
- **Labels:** fase-5, testes, frontend

#### Issue 5.3 - Testes End-to-End (E2E)
- **Tarefas:**
  - Setup de ferramentas E2E (Cypress, Playwright)
  - Testes de fluxo de autenticação
  - Testes de gestão de pacientes
  - Testes de agendamento
  - Testes de funcionalidades financeiras
- **Labels:** fase-5, testes, e2e

### Fase 6 - Sub-issues (3)

#### Issue 6.1 - Configuração de Ambientes
- **Tarefas:**
  - Provisionamento de servidores (VPS Hostinger)
  - Configuração de domínios e SSL
  - Setup de banco de dados em produção
  - Configuração de variáveis de ambiente
  - Backup automático
- **Labels:** fase-6, infraestrutura, devops

#### Issue 6.2 - CI/CD e Automação de Deploy
- **Tarefas:**
  - Pipeline de build e testes
  - Deploy automático para staging
  - Deploy aprovado para produção
  - Rollback automático em caso de falha
  - Notificações de deploy
- **Labels:** fase-6, ci-cd, devops

#### Issue 6.3 - Monitoramento e Logs
- **Tarefas:**
  - Setup de logs centralizados
  - Monitoramento de performance (APM)
  - Alertas de erro e downtime
  - Dashboard de métricas
  - Health checks
- **Labels:** fase-6, monitoramento, observabilidade

### Fase 7 - Sub-issues (2)

#### Issue 7.1 - Documentação Técnica
- **Tarefas:**
  - Documentação da API (OpenAPI/Swagger)
  - Diagramas de arquitetura atualizados
  - Documentação de código
  - Guia de contribuição
  - Troubleshooting guide
- **Labels:** fase-7, documentação, técnica

#### Issue 7.2 - Documentação de Usuário
- **Tarefas:**
  - Manual do usuário
  - FAQs
  - Tutoriais em vídeo
  - Base de conhecimento
  - Onboarding guide
- **Labels:** fase-7, documentação, usuário

### Fase 8 - Sub-issues (2)

#### Issue 8.1 - Preparação para Beta
- **Tarefas:**
  - Testes finais completos
  - Correção de bugs críticos
  - Preparação de ambiente beta
  - Seleção de beta testers
  - Preparação de materiais de comunicação
- **Labels:** fase-8, beta, preparação

#### Issue 8.2 - Feedback e Iterações Beta
- **Tarefas:**
  - Envio de convites para beta
  - Coleta estruturada de feedback
  - Análise de métricas de uso
  - Priorização de melhorias
  - Implementação de ajustes críticos
- **Labels:** fase-8, beta, feedback

### Fase 9 - Sub-issues (3)

#### Issue 9.1 - Preparação da Release v1.0
- **Tarefas:**
  - Versionamento semântico (v1.0.0)
  - Changelog completo
  - Release notes
  - Testes finais de regressão
  - Preparação de assets
- **Labels:** fase-9, release, v1.0

#### Issue 9.2 - Plano de Marketing e Comunicação
- **Tarefas:**
  - Estratégia de lançamento
  - Materiais de marketing
  - Posts em redes sociais
  - Email marketing
  - Press release
- **Labels:** fase-9, marketing, comunicação

#### Issue 9.3 - Lançamento Oficial
- **Tarefas:**
  - Deploy em produção
  - Publicação de anúncios
  - Monitoramento intensivo pós-lançamento
  - Suporte ativo para primeiros usuários
  - Coleta de feedback inicial
- **Labels:** fase-9, lançamento, produção

### Fase 10 - Sub-issues (2)

#### Issue 10.1 - Monitoramento e Manutenção
- **Tarefas:**
  - Monitoramento contínuo de métricas
  - Análise de logs e erros
  - Correção de bugs reportados
  - Atualizações de segurança
  - Otimizações de performance
- **Labels:** fase-10, manutenção, suporte

#### Issue 10.2 - Roadmap e Evolução
- **Tarefas:**
  - Análise de feedback dos usuários
  - Priorização de novas features
  - Roadmap de produto
  - Planejamento de versões futuras
  - Comunicação do roadmap
- **Labels:** fase-10, roadmap, evolução

---

## 📚 Issues Especiais (2 Issues - #12 e #13)

### Issue #12 - Stack Tecnológica - PlenoPsi MVP
- **Tipo:** Epic de Documentação
- **Conteúdo:**
  - Stack Frontend (Next.js, React, TypeScript, Tailwind CSS)
  - Stack Backend (Node.js, Express, PostgreSQL, Prisma)
  - DevOps (Docker, GitHub Actions, Nginx)
  - Testes (Jest, Vitest, Playwright)
  - Documentação (Swagger, Storybook)
- **Labels:** documentação, stack, arquitetura

### Issue #13 - Estrutura de Versionamento - PlenoPsi
- **Tipo:** Epic de Documentação
- **Conteúdo:**
  - Semantic Versioning (SemVer)
  - Estratégia de Branches (Git Flow)
  - Conventional Commits
  - Tags e Releases
  - CI/CD e Deploys
- **Labels:** documentação, versionamento, processo

---

## 📊 Resumo Final

| Categoria | Quantidade |
|-----------|------------|
| Issue Macro (#1) | 1 |
| Fases (#2-#11) | 10 |
| Sub-issues | 27 |
| Issues Especiais (#12-#13) | 2 |
| **TOTAL** | **40** |

> **Nota:** Contando a issue macro #1 que já existe, temos um total de 40 issues.  
> Se considerarmos apenas as novas issues a serem criadas, temos 39 issues.

---

## 🏷️ Labels Totais: 55+

Serão criadas mais de 55 labels diferentes para categorizar todas as issues, incluindo:
- 10 labels de fase (fase-1 a fase-10)
- 7 labels de categoria (planejamento, design, backend, frontend, testes, devops, documentação)
- 38+ labels específicas (requisitos, arquitetura, api, database, etc.)

---

## 🔗 Dependências

```
Fase 1 (Planning)
    ↓
Fase 2 (Design) ← depende de Fase 1
    ↓
Fase 3 (Backend) ← depende de Fases 1 e 2
    ↓
Fase 4 (Frontend) ← depende de Fases 2 e 3
    ↓
Fase 5 (Testes) ← depende de Fases 3 e 4
    ↓
Fase 6 (Deploy) ← depende de Fases 3, 4 e 5
    ↓
Fase 7 (Docs) ← depende de Fases 3 e 4
    ↓
Fase 8 (Beta) ← depende de Fases 6 e 7
    ↓
Fase 9 (Release) ← depende de Fase 8
    ↓
Fase 10 (Pós-lançamento) ← depende de Fase 9
```

---

**Data de criação:** 2026-02-07  
**Status:** ✅ Pronto para execução
