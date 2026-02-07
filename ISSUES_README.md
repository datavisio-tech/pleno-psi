# Estrutura de Issues - PlenoPsi MVP

Este diretório contém os arquivos necessários para criar toda a estrutura de issues do projeto PlenoPsi MVP.

## 📋 Visão Geral

O planejamento completo inclui:

- ✅ **1 Issue Macro** (Epic principal) - #1 já existente
- ✅ **10 Fases** (Epics com sub-tarefas) - Issues #2 a #11
- ✅ **28 Sub-issues** individuais (1.1-1.3, 2.1-2.2, 3.1-3.5, 4.1-4.3, 5.1-5.3, 6.1-6.3, 7.1-7.2, 8.1-8.2, 9.1-9.3, 10.1-10.2)
- ✅ **1 Issue Stack Tecnológica** - #12
- ✅ **1 Issue Versionamento** - #13

**Total: 40 novas issues** (10 fases + 28 sub-issues + 2 especiais)

## 📁 Arquivos

### `issues-structure.yaml`

Arquivo YAML que define toda a estrutura de issues, incluindo:
- Descrição completa de cada fase
- Todas as sub-issues com tarefas detalhadas
- Labels para categorização
- Dependências entre fases
- Issues especiais (Stack Tecnológica e Versionamento)

### `create_issues.py`

Script Python que automatiza a criação de todas as issues no GitHub usando a API oficial.

## 🚀 Como Usar

### Pré-requisitos

1. **Python 3.7+** instalado
2. **Dependências Python:**
   ```bash
   pip install pyyaml requests
   ```

3. **GitHub Personal Access Token** com permissões:
   - `repo` (acesso completo a repositórios)
   - `write:org` (se for organização)

### Criando o Token

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Selecione os escopos: `repo`, `write:org`
4. Copie o token gerado

### Executando o Script

#### Opção 1: Usando variável de ambiente

```bash
export GITHUB_TOKEN="seu_token_aqui"
python create_issues.py
```

#### Opção 2: Passando o token como argumento

```bash
python create_issues.py --token seu_token_aqui
```

#### Opção 3: Especificando repositório diferente

```bash
python create_issues.py --token seu_token_aqui --repo owner/repository
```

#### Opção 4: Pular criação de labels

```bash
python create_issues.py --skip-labels
```

### Parâmetros Disponíveis

- `--token`: GitHub personal access token
- `--repo`: Repositório no formato 'owner/repo' (padrão: datavisio-tech/pleno-psi)
- `--structure-file`: Caminho para o arquivo YAML (padrão: issues-structure.yaml)
- `--skip-labels`: Pular a criação de labels

## 📊 Estrutura das Fases

### Fase 1: Planejamento e Estruturação (Semanas 1-2)
- 1.1 Definição de Requisitos
- 1.2 Arquitetura e Tecnologia
- 1.3 Configuração do Projeto

### Fase 2: Design e Prototipagem (Semanas 3-4)
- 2.1 Design System e UI/UX
- 2.2 Protótipos de Alta Fidelidade

### Fase 3: Desenvolvimento Backend (Semanas 5-8)
- 3.1 Configuração do Backend e Banco de Dados
- 3.2 API de Autenticação e Usuários
- 3.3 API de Pacientes
- 3.4 API de Agendamentos
- 3.5 API Financeira

### Fase 4: Desenvolvimento Frontend (Semanas 7-10)
- 4.1 Setup Frontend e Componentes Base
- 4.2 Telas de Autenticação e Perfil
- 4.3 Dashboard e Telas Principais

### Fase 5: Testes (Semanas 9-11)
- 5.1 Testes Unitários Backend
- 5.2 Testes Unitários e de Componentes Frontend
- 5.3 Testes End-to-End (E2E)

### Fase 6: Deploy e Infraestrutura (Semana 11-12)
- 6.1 Configuração de Ambientes
- 6.2 CI/CD e Automação de Deploy
- 6.3 Monitoramento e Logs

### Fase 7: Documentação (Semana 12-13)
- 7.1 Documentação Técnica
- 7.2 Documentação de Usuário

### Fase 8: Lançamento Beta (Semanas 13-15)
- 8.1 Preparação para Beta
- 8.2 Feedback e Iterações Beta

### Fase 9: Versionamento e Release (Semana 15-16)
- 9.1 Preparação da Release v1.0
- 9.2 Plano de Marketing e Comunicação
- 9.3 Lançamento Oficial

### Fase 10: Pós-Lançamento e Melhoria Contínua (Contínua)
- 10.1 Monitoramento e Manutenção
- 10.2 Roadmap e Evolução

## 🏷️ Labels

O script cria automaticamente todas as labels necessárias, incluindo:

**Por Fase:**
- fase-1 a fase-10

**Por Categoria:**
- planejamento, design, backend, frontend, testes, devops, documentação

**Específicas:**
- requisitos, arquitetura, tecnologia, api, database, autenticação, etc.

## 🔗 Dependências

O script configura automaticamente as dependências entre as fases:
- Fase 2 bloqueada por Fase 1
- Fase 3 bloqueada por Fases 1 e 2
- Fase 4 bloqueada por Fases 2 e 3
- E assim por diante...

## ⚠️ Importante

- **Rate Limiting**: O script inclui delays entre requisições para evitar o rate limit do GitHub
- **Ordem de Criação**: As issues são criadas na ordem correta (fases → sub-issues → especiais)
- **Backup**: Mantenha o arquivo `issues-structure.yaml` atualizado com qualquer mudança
- **Reversão**: Não há função de reversão automática - issues devem ser fechadas manualmente se necessário

## 🔍 Verificação

Após executar o script, você pode verificar:

```bash
# Ver todas as issues criadas
gh issue list --repo datavisio-tech/pleno-psi --limit 100

# Ver issues de uma fase específica
gh issue list --label "fase-1" --repo datavisio-tech/pleno-psi

# Ver issues de uma categoria
gh issue list --label "backend" --repo datavisio-tech/pleno-psi
```

## 📝 Edição da Estrutura

Para modificar a estrutura de issues:

1. Edite o arquivo `issues-structure.yaml`
2. Valide a sintaxe YAML
3. Execute o script novamente (ele criará apenas novas issues)

## 🆘 Solução de Problemas

### Erro 401: Bad credentials
- Verifique se o token está correto
- Confirme que o token tem as permissões necessárias

### Erro 404: Not Found
- Verifique se o nome do repositório está correto
- Confirme que você tem acesso ao repositório

### Erro 422: Validation Failed
- Pode indicar que uma label ou issue já existe
- O script tenta lidar com isso automaticamente

## 📞 Suporte

Para dúvidas ou problemas:
- Email: devdatavisio@plenopsi.com.br
- Issues: https://github.com/datavisio-tech/pleno-psi/issues

---

**Última atualização:** 2026-02-07
