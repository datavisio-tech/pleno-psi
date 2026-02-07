# 📚 Índice - Documentação de Issues PlenoPsi MVP

Este é o índice central para toda a documentação relacionada à estrutura de issues do PlenoPsi MVP.

---

## 🚀 Início Rápido

**Quer criar as issues agora?** Siga estes 3 passos:

1. **Instalar dependências:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configurar token:**
   ```bash
   export GITHUB_TOKEN="seu_token_aqui"
   ```

3. **Executar script:**
   ```bash
   python create_issues.py
   ```

📖 Detalhes em: [QUICK_START.md](QUICK_START.md)

---

## 📁 Arquivos do Projeto

### 📄 Arquivos de Dados

| Arquivo | Descrição |
|---------|-----------|
| **`issues-structure.yaml`** | Estrutura completa de todas as 40 issues em formato YAML |
| **`requirements.txt`** | Dependências Python necessárias (pyyaml, requests) |

### 🐍 Scripts

| Arquivo | Descrição |
|---------|-----------|
| **`create_issues.py`** | Script Python para criar automaticamente todas as issues via GitHub API |

### 📖 Documentação

| Arquivo | Descrição | Recomendado Para |
|---------|-----------|------------------|
| **`QUICK_START.md`** | Guia rápido de 3 passos | Começar agora |
| **`ISSUES_README.md`** | Documentação completa e detalhada | Referência completa |
| **`ISSUES_SUMMARY.md`** | Resumo de todas as 40 issues | Visão geral |
| **`ISSUE_TREE.md`** | Visualização em árvore das issues | Estrutura visual |
| **`INDEX.md`** | Este arquivo - índice central | Navegação |

---

## 📊 Visão Geral do Projeto

### Números

- **40 novas issues** a serem criadas
- **10 fases** principais (Epics)
- **28 sub-issues** de tarefas
- **2 issues especiais** (Stack Tecnológica + Versionamento)
- **55+ labels** para categorização
- **16 semanas** de duração estimada

### Estrutura

```
Issue #1 (existente) - Planejamento Macro
├── Fases #2-#11 (10 issues)
│   └── Sub-issues (28 issues)
└── Especiais #12-#13 (2 issues)
```

---

## 🗺️ Navegação por Objetivo

### Quero entender o planejamento completo
👉 Leia: [ISSUES_SUMMARY.md](ISSUES_SUMMARY.md)

### Quero ver a estrutura visual
👉 Leia: [ISSUE_TREE.md](ISSUE_TREE.md)

### Quero criar as issues agora
👉 Leia: [QUICK_START.md](QUICK_START.md)

### Quero entender como funciona o script
👉 Leia: [ISSUES_README.md](ISSUES_README.md)

### Quero modificar a estrutura
👉 Edite: `issues-structure.yaml`

### Quero ver as dependências técnicas
👉 Veja: Issues #12 (Stack) e #13 (Versionamento) em `issues-structure.yaml`

---

## 📋 As 10 Fases do MVP

1. **Fase 1** - Planejamento e Estruturação (Semanas 1-2)
   - 3 sub-issues: Requisitos, Arquitetura, Configuração

2. **Fase 2** - Design e Prototipagem (Semanas 3-4)
   - 2 sub-issues: Design System, Protótipos

3. **Fase 3** - Desenvolvimento Backend (Semanas 5-8)
   - 5 sub-issues: Config, Autenticação, Pacientes, Agendamentos, Financeiro

4. **Fase 4** - Desenvolvimento Frontend (Semanas 7-10)
   - 3 sub-issues: Setup, Autenticação, Dashboard

5. **Fase 5** - Testes (Semanas 9-11)
   - 3 sub-issues: Backend, Frontend, E2E

6. **Fase 6** - Deploy e Infraestrutura (Semanas 11-12)
   - 3 sub-issues: Ambientes, CI/CD, Monitoramento

7. **Fase 7** - Documentação (Semanas 12-13)
   - 2 sub-issues: Técnica, Usuário

8. **Fase 8** - Lançamento Beta (Semanas 13-15)
   - 2 sub-issues: Preparação, Feedback

9. **Fase 9** - Versionamento e Release (Semanas 15-16)
   - 3 sub-issues: Release v1.0, Marketing, Lançamento

10. **Fase 10** - Pós-Lançamento (Contínuo)
    - 2 sub-issues: Manutenção, Roadmap

---

## 🔧 Uso Avançado

### Opções do Script

```bash
# Usar token diferente
python create_issues.py --token ghp_xxxxx

# Usar outro repositório
python create_issues.py --repo owner/repo

# Pular criação de labels
python create_issues.py --skip-labels

# Usar arquivo YAML diferente
python create_issues.py --structure-file custom.yaml
```

### Validar YAML

```bash
python3 -c "import yaml; yaml.safe_load(open('issues-structure.yaml'))"
```

### Ver estatísticas

```bash
python3 -c "
import yaml
with open('issues-structure.yaml', 'r') as f:
    s = yaml.safe_load(f)
    print(f'Fases: {len(s[\"phases\"])}')
    print(f'Sub-issues: {sum(len(p.get(\"sub_issues\", [])) for p in s[\"phases\"])}')
    print(f'Especiais: {len(s[\"special_issues\"])}')
"
```

---

## 🏷️ Sistema de Labels

### Por Fase
- `fase-1` a `fase-10`: Identificam a fase do projeto

### Por Categoria
- `planejamento`, `design`, `backend`, `frontend`, `testes`, `devops`, `documentação`

### Específicas
- Mais de 40 labels específicas para cada tipo de tarefa
- Ver lista completa em: [ISSUES_README.md](ISSUES_README.md#-labels)

---

## 🔗 Links Úteis

### GitHub
- **Repositório:** https://github.com/datavisio-tech/pleno-psi
- **Issues:** https://github.com/datavisio-tech/pleno-psi/issues
- **Token:** https://github.com/settings/tokens

### Documentação GitHub
- **API Issues:** https://docs.github.com/en/rest/issues/issues
- **API Labels:** https://docs.github.com/en/rest/issues/labels

### Ferramentas
- **PyYAML:** https://pyyaml.org/
- **Requests:** https://requests.readthedocs.io/

---

## ⚠️ Importante

### Antes de Executar

✅ Certifique-se de ter:
- [ ] Python 3.7+ instalado
- [ ] Dependências instaladas (`pip install -r requirements.txt`)
- [ ] Token do GitHub com permissões `repo`
- [ ] Acesso ao repositório datavisio-tech/pleno-psi

### Durante a Execução

- O script leva ~3-4 minutos para completar
- Delays são incluídos para evitar rate limiting
- Issues são criadas na ordem: Fases → Sub-issues → Especiais

### Após a Execução

- Verifique todas as issues no GitHub
- Confirme que as dependências estão documentadas
- Valide que as labels estão aplicadas corretamente

---

## 🆘 Troubleshooting

### Problema: "Bad credentials"
**Solução:** Verifique se o token está correto e tem permissões adequadas

### Problema: "Not Found"
**Solução:** Verifique o nome do repositório e suas permissões de acesso

### Problema: "Rate limit exceeded"
**Solução:** Aguarde alguns minutos antes de tentar novamente

### Problema: YAML inválido
**Solução:** Valide a sintaxe com `python3 -c "import yaml; yaml.safe_load(open('issues-structure.yaml'))"`

---

## 📞 Suporte

- **Email:** devdatavisio@plenopsi.com.br
- **Issues:** https://github.com/datavisio-tech/pleno-psi/issues
- **Website:** https://plenopsi.com.br

---

## 📈 Próximos Passos

Após criar as issues:

1. ✅ **Revisar Issues Criadas**
   - Verificar numeração
   - Confirmar descrições
   - Validar labels

2. ✅ **Organizar no GitHub**
   - Criar milestones
   - Atribuir responsáveis
   - Definir datas

3. ✅ **Começar Desenvolvimento**
   - Seguir ordem das fases
   - Respeitar dependências
   - Atualizar status

4. ✅ **Manter Atualizado**
   - Fechar issues concluídas
   - Documentar progresso
   - Ajustar planejamento

---

## 📅 Histórico

- **2026-02-07:** Criação da estrutura completa de 40 issues
- **2026-02-07:** Documentação completa e scripts prontos

---

## 📄 Licença

Este projeto está sob a licença MIT - veja [LICENSE.md](LICENSE.md)

---

**Última atualização:** 2026-02-07  
**Versão da estrutura:** 1.0  
**Status:** ✅ Pronto para execução
