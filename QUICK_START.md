# Guia Rápido - Criação de Issues PlenoPsi

## 🚀 Como Usar (3 Passos Simples)

### 1️⃣ Instalar Dependências

```bash
pip install -r requirements.txt
```

### 2️⃣ Configurar Token do GitHub

Obter token em: https://github.com/settings/tokens

```bash
export GITHUB_TOKEN="seu_token_github_aqui"
```

### 3️⃣ Executar Script

```bash
python create_issues.py
```

---

## 🚀 O Que Será Criado

O script criará **40 novas issues** no repositório:

### Issues de Fase (10)
- #2 - Fase 1: Planejamento e Estruturação
- #3 - Fase 2: Design e Prototipagem  
- #4 - Fase 3: Desenvolvimento Backend
- #5 - Fase 4: Desenvolvimento Frontend
- #6 - Fase 5: Testes
- #7 - Fase 6: Deploy e Infraestrutura
- #8 - Fase 7: Documentação
- #9 - Fase 8: Lançamento Beta
- #10 - Fase 9: Versionamento e Release
- #11 - Fase 10: Pós-Lançamento

### Sub-Issues (28)
- **Fase 1:** 1.1, 1.2, 1.3
- **Fase 2:** 2.1, 2.2
- **Fase 3:** 3.1, 3.2, 3.3, 3.4, 3.5
- **Fase 4:** 4.1, 4.2, 4.3
- **Fase 5:** 5.1, 5.2, 5.3
- **Fase 6:** 6.1, 6.2, 6.3
- **Fase 7:** 7.1, 7.2
- **Fase 8:** 8.1, 8.2
- **Fase 9:** 9.1, 9.2, 9.3
- **Fase 10:** 10.1, 10.2

### Issues Especiais (2)
- #12 - Stack Tecnológica
- #13 - Estrutura de Versionamento

---

## ⏱️ Tempo Estimado

- Criação de labels: ~30 segundos
- Criação de issues: ~2-3 minutos
- **Total:** ~3-4 minutos

---

## ✅ Verificação Pós-Execução

```bash
# Ver todas as issues criadas
gh issue list --limit 50

# Ver por label
gh issue list --label "fase-1"
gh issue list --label "backend"
```

---

## 🔧 Opções Avançadas

### Usar token como parâmetro
```bash
python create_issues.py --token ghp_xxxxx
```

### Especificar outro repositório
```bash
python create_issues.py --repo outro-usuario/outro-repo
```

### Pular criação de labels
```bash
python create_issues.py --skip-labels
```

---

## 📁 Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `issues-structure.yaml` | Estrutura completa de todas as issues |
| `create_issues.py` | Script Python para criar as issues |
| `requirements.txt` | Dependências Python |
| `ISSUES_README.md` | Documentação completa |
| `ISSUES_SUMMARY.md` | Resumo de todas as issues |
| `QUICK_START.md` | Este guia rápido |

---

## ⚠️ Importante

- ✅ O script inclui delays para evitar rate limiting
- ✅ Labels duplicadas são ignoradas automaticamente
- ✅ Issues são criadas com dependências documentadas
- ⚠️ Não há função de reversão - issues devem ser fechadas manualmente

---

## 🆘 Problemas Comuns

### "Bad credentials"
→ Token inválido ou sem permissões. Verifique em https://github.com/settings/tokens

### "Not Found"
→ Nome do repositório incorreto ou sem acesso

### "Rate limit exceeded"
→ Aguarde alguns minutos e tente novamente

---

**Precisa de ajuda?** Consulte `ISSUES_README.md` para documentação completa.
