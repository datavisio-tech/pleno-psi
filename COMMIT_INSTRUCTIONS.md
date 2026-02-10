Git commit & push

Arquivos modificados por este agente (resumo):

- lib/session.ts (novo)
- app/api/login/route.ts (adiciona Set-Cookie)
- app/api/register/route.ts (adiciona Set-Cookie)
- app/api/me/route.ts (lê cookie de sessão)
- components/NavigationGuard.tsx (validação via /api/me + sanitização)
- components/AuthenticatedPage.tsx (novo template)
- app/protected-template/page.tsx (exemplo de uso)
- components/cadastro_user-form.tsx (correções de schema/form)
- components/signup-form.tsx, components/login-form.tsx (removida gravação em localStorage)
- app/cadastro/page.tsx (corrigido para cliente + validação)
- CHANGELOG_AGENT.md (atualizado)
- issues/0001-0003 (novas issues locais em issues/)

Para commitar e pushar (siga neste branch `feature/authentication`):

```bash
git add .
git commit -m "feat(auth): cookie-based sessions (HttpOnly), guards and AuthenticatedPage template"
git push origin feature/authentication
```

Observação:

- Verifique `SESSION_SECRET` em `.env` antes de deploy (usar valor seguro em produção).
- Se quiser que eu rode `create_issues.py` para criar issues reais no GitHub, forneça token GH e confirme permissão; atualmente criei arquivos locais em `issues/`.
