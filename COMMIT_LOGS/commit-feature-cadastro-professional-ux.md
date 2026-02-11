Commit simulado: feature/cadastro - melhoria UX formulário profissional

Alterações realizadas:

- Atualizado `app/cadastro/professional/page.tsx`:
  - Adicionado `professional_entity` e `nome_resp` ao `professionalSchema`.
  - Ajustado `defaultValues` de `profForm`.
  - Correção: usar `clinicForm` no bloco de dados da clínica (antes usava `profForm`).
  - Correção: inputs do bloco profissional agora usam `profForm.register` corretamente.
  - Busca de `/api/me` para preencher `nome_resp` automaticamente (campo não editável).
  - Adicionados placeholders e textos de ajuda para `professional_entity`.

- Criadas issues:
  - `issues/0006-improve-professional-onboarding.md`
  - `issues/0007-cleanup-and-schema-updates.md`

Observações:

- Commit simulado porque não é possível rodar `git commit` neste ambiente. Rode os comandos abaixo localmente para commitar:

```powershell
git add app/cadastro/professional/page.tsx issues/0006-improve-professional-onboarding.md issues/0007-cleanup-and-schema-updates.md
git commit -m "feat(cadastro): melhorar UX formulário profissional + schema fixes"
git push origin feature/cadastro
```
