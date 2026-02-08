# MCP (shadcn) — Configuração e Uso

Breve guia para a configuração MCP (shadcn) usada neste repositório.

- Arquivo de configuração gerado: `.vscode/mcp.json` (adicionado localmente pelo `npx shadcn mcp init`).
- Objetivo: habilitar o assistente MCP em VS Code para gerar componentes e snippets do shadcn.

## Como usar

1. Certifique-se de ter o `shadcn` instalado via npx quando for necessário:

```bash
npx shadcn@latest <comando>
```

2. No VS Code, habilite a extensão MCP (se aplicável) e abra o workspace. A configuração está em `.vscode/mcp.json`.

3. Para gerar componentes do shadcn siga a documentação do projeto ou execute os comandos interativos do `npx shadcn`.

## Nota de segurança

O arquivo `.vscode/mcp.json` pode conter configurações locais; caso prefira não comitar este arquivo, adicione-o ao `.gitignore`.

## Contato

Se precisar de ajuda para rodar o MCP ou ajustar a configuração no CI, abra uma issue neste repositório.
