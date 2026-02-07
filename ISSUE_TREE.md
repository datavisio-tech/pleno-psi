# 🌳 Árvore Completa de Issues - PlenoPsi MVP

```
📊 PlenoPsi MVP - Estrutura Completa
│
├── #1 ✅ Planejamento Macro - MVP PlenoPsi (JÁ EXISTENTE)
│
├── 🎯 FASE 1: Planejamento e Estruturação (#2)
│   ├── Sub-issue 1.1: Definição de Requisitos
│   ├── Sub-issue 1.2: Arquitetura e Tecnologia
│   └── Sub-issue 1.3: Configuração do Projeto
│
├── 🎯 FASE 2: Design e Prototipagem (#3) [BLOQUEADA POR #2]
│   ├── Sub-issue 2.1: Design System e UI/UX
│   └── Sub-issue 2.2: Protótipos de Alta Fidelidade
│
├── 🎯 FASE 3: Desenvolvimento Backend (#4) [BLOQUEADA POR #2, #3]
│   ├── Sub-issue 3.1: Configuração do Backend e Banco de Dados
│   ├── Sub-issue 3.2: API de Autenticação e Usuários
│   ├── Sub-issue 3.3: API de Pacientes
│   ├── Sub-issue 3.4: API de Agendamentos
│   └── Sub-issue 3.5: API Financeira
│
├── 🎯 FASE 4: Desenvolvimento Frontend (#5) [BLOQUEADA POR #3, #4]
│   ├── Sub-issue 4.1: Setup Frontend e Componentes Base
│   ├── Sub-issue 4.2: Telas de Autenticação e Perfil
│   └── Sub-issue 4.3: Dashboard e Telas Principais
│
├── 🎯 FASE 5: Testes (#6) [BLOQUEADA POR #4, #5]
│   ├── Sub-issue 5.1: Testes Unitários Backend
│   ├── Sub-issue 5.2: Testes Unitários e de Componentes Frontend
│   └── Sub-issue 5.3: Testes End-to-End (E2E)
│
├── 🎯 FASE 6: Deploy e Infraestrutura (#7) [BLOQUEADA POR #4, #5, #6]
│   ├── Sub-issue 6.1: Configuração de Ambientes
│   ├── Sub-issue 6.2: CI/CD e Automação de Deploy
│   └── Sub-issue 6.3: Monitoramento e Logs
│
├── 🎯 FASE 7: Documentação (#8) [BLOQUEADA POR #4, #5]
│   ├── Sub-issue 7.1: Documentação Técnica
│   └── Sub-issue 7.2: Documentação de Usuário
│
├── 🎯 FASE 8: Lançamento Beta (#9) [BLOQUEADA POR #7, #8]
│   ├── Sub-issue 8.1: Preparação para Beta
│   └── Sub-issue 8.2: Feedback e Iterações Beta
│
├── 🎯 FASE 9: Versionamento e Release (#10) [BLOQUEADA POR #9]
│   ├── Sub-issue 9.1: Preparação da Release v1.0
│   ├── Sub-issue 9.2: Plano de Marketing e Comunicação
│   └── Sub-issue 9.3: Lançamento Oficial
│
├── 🎯 FASE 10: Pós-Lançamento e Melhoria Contínua (#11) [BLOQUEADA POR #10]
│   ├── Sub-issue 10.1: Monitoramento e Manutenção
│   └── Sub-issue 10.2: Roadmap e Evolução
│
├── 📚 ESPECIAL: Stack Tecnológica - PlenoPsi MVP (#12)
│
└── 📚 ESPECIAL: Estrutura de Versionamento - PlenoPsi (#13)
```

---

## 📊 Estatísticas

| Tipo | Quantidade |
|------|------------|
| Epic Macro | 1 (já existe) |
| Fases | 10 |
| Sub-issues | 28 |
| Especiais | 2 |
| **Total** | **41 issues** |
| **Novas** | **40 issues** |

---

## 🔗 Grafo de Dependências

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Fase 1 (Planejamento)                                      │
│       #2                                                    │
│       │                                                     │
│       ├──┐                                                  │
│       │  │                                                  │
│       ▼  ▼                                                  │
│  Fase 2 (Design)    Fase 3 (Backend)                       │
│       #3                 #4                                 │
│       │                  │                                  │
│       └─────┬───────┬────┴──────┬──────┐                   │
│             │       │           │      │                    │
│             ▼       ▼           ▼      ▼                    │
│        Fase 4   Fase 5      Fase 6  Fase 7                 │
│      (Frontend) (Testes)   (Deploy) (Docs)                 │
│          #5       #6          #7      #8                    │
│                               │       │                     │
│                               └───┬───┘                     │
│                                   │                         │
│                                   ▼                         │
│                             Fase 8 (Beta)                   │
│                                  #9                         │
│                                   │                         │
│                                   ▼                         │
│                           Fase 9 (Release)                  │
│                                  #10                        │
│                                   │                         │
│                                   ▼                         │
│                      Fase 10 (Pós-Lançamento)               │
│                                  #11                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ⏱️ Timeline Estimado

```
Semana 1-2   ████████ Fase 1: Planejamento
Semana 3-4   ████████ Fase 2: Design
Semana 5-8   ████████████████ Fase 3: Backend
Semana 7-10  ████████████████ Fase 4: Frontend (paralelo)
Semana 9-11  ████████████ Fase 5: Testes (paralelo)
Semana 11-12 ████ Fase 6: Deploy
Semana 12-13 ████ Fase 7: Documentação (paralelo)
Semana 13-15 ████████ Fase 8: Beta
Semana 15-16 ████ Fase 9: Release
Semana 16+   ████████████████████████ Fase 10: Contínuo
```

**Duração Total Estimada:** 16 semanas (~4 meses)

---

## 🏷️ Labels por Categoria

### Fases (10 labels)
```
fase-1, fase-2, fase-3, fase-4, fase-5,
fase-6, fase-7, fase-8, fase-9, fase-10
```

### Categorias Principais (7 labels)
```
planejamento, design, backend, frontend,
testes, devops, documentação
```

### Específicas (40+ labels)
```
requisitos, arquitetura, tecnologia, configuração,
design-system, ui-ux, prototipagem, validação,
database, autenticação, api, pacientes, agendamentos,
financeiro, setup, dashboard, e2e, infraestrutura,
ci-cd, monitoramento, observabilidade, técnica,
usuário, beta, preparação, feedback, release, v1.0,
marketing, comunicação, lançamento, produção,
pós-lançamento, manutenção, suporte, roadmap,
evolução, stack, versionamento, processo
```

---

## 📋 Checklist de Execução

### Pré-Lançamento
- [ ] Executar script de criação de issues
- [ ] Verificar todas as issues criadas
- [ ] Confirmar labels aplicadas
- [ ] Validar dependências documentadas

### Fase 1 (Semanas 1-2)
- [ ] Completar issue 1.1 - Definição de Requisitos
- [ ] Completar issue 1.2 - Arquitetura e Tecnologia
- [ ] Completar issue 1.3 - Configuração do Projeto

### Fase 2 (Semanas 3-4)
- [ ] Completar issue 2.1 - Design System e UI/UX
- [ ] Completar issue 2.2 - Protótipos de Alta Fidelidade

### Fase 3 (Semanas 5-8)
- [ ] Completar issue 3.1 - Configuração Backend/DB
- [ ] Completar issue 3.2 - API Autenticação
- [ ] Completar issue 3.3 - API Pacientes
- [ ] Completar issue 3.4 - API Agendamentos
- [ ] Completar issue 3.5 - API Financeira

### Fase 4 (Semanas 7-10)
- [ ] Completar issue 4.1 - Setup Frontend
- [ ] Completar issue 4.2 - Telas Autenticação
- [ ] Completar issue 4.3 - Dashboard

### Fase 5 (Semanas 9-11)
- [ ] Completar issue 5.1 - Testes Backend
- [ ] Completar issue 5.2 - Testes Frontend
- [ ] Completar issue 5.3 - Testes E2E

### Fase 6 (Semanas 11-12)
- [ ] Completar issue 6.1 - Configuração Ambientes
- [ ] Completar issue 6.2 - CI/CD
- [ ] Completar issue 6.3 - Monitoramento

### Fase 7 (Semanas 12-13)
- [ ] Completar issue 7.1 - Documentação Técnica
- [ ] Completar issue 7.2 - Documentação Usuário

### Fase 8 (Semanas 13-15)
- [ ] Completar issue 8.1 - Preparação Beta
- [ ] Completar issue 8.2 - Feedback Beta

### Fase 9 (Semanas 15-16)
- [ ] Completar issue 9.1 - Preparação Release
- [ ] Completar issue 9.2 - Marketing
- [ ] Completar issue 9.3 - Lançamento

### Fase 10 (Contínuo)
- [ ] Manter issue 10.1 - Monitoramento
- [ ] Evoluir issue 10.2 - Roadmap

---

## 🎯 Milestones Sugeridos

1. **M1: Fundação** (Fase 1) - Semana 2
2. **M2: Design Completo** (Fase 2) - Semana 4
3. **M3: Backend MVP** (Fase 3) - Semana 8
4. **M4: Frontend MVP** (Fase 4) - Semana 10
5. **M5: Qualidade Garantida** (Fase 5) - Semana 11
6. **M6: Produção Ready** (Fases 6-7) - Semana 13
7. **M7: Beta Launch** (Fase 8) - Semana 15
8. **M8: v1.0 Release** (Fase 9) - Semana 16

---

**Gerado em:** 2026-02-07  
**Versão:** 1.0
