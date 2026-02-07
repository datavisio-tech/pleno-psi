#!/bin/bash
#
# Script wrapper para criar issues do PlenoPsi MVP
# 
# Uso:
#   ./create_all_issues.sh
#   ou
#   ./create_all_issues.sh ghp_your_token_here
#

set -e  # Exit on error

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "============================================================"
echo "  PlenoPsi MVP - Criador de Issues"
echo "============================================================"
echo ""

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Erro: Python 3 não encontrado${NC}"
    echo "   Instale Python 3.7+ antes de continuar"
    exit 1
fi

echo -e "${GREEN}✅ Python encontrado:${NC} $(python3 --version)"

# Verificar dependências
echo ""
echo -e "${BLUE}📦 Verificando dependências...${NC}"

if ! python3 -c "import yaml" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  PyYAML não encontrado. Instalando...${NC}"
    pip install pyyaml
fi

if ! python3 -c "import requests" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Requests não encontrado. Instalando...${NC}"
    pip install requests
fi

echo -e "${GREEN}✅ Todas as dependências estão instaladas${NC}"

# Verificar YAML
echo ""
echo -e "${BLUE}🔍 Validando estrutura YAML...${NC}"

if python3 -c "import yaml; yaml.safe_load(open('issues-structure.yaml'))" 2>/dev/null; then
    echo -e "${GREEN}✅ YAML válido${NC}"
else
    echo -e "${RED}❌ Erro: YAML inválido${NC}"
    exit 1
fi

# Obter token
TOKEN=""

if [ -n "$1" ]; then
    TOKEN="$1"
    echo -e "${GREEN}✅ Token fornecido como argumento${NC}"
elif [ -n "$GITHUB_TOKEN" ]; then
    TOKEN="$GITHUB_TOKEN"
    echo -e "${GREEN}✅ Token obtido da variável GITHUB_TOKEN${NC}"
else
    echo ""
    echo -e "${YELLOW}⚠️  Token do GitHub não encontrado${NC}"
    echo ""
    echo "Por favor, forneça seu token do GitHub:"
    echo "  1. Acesse: https://github.com/settings/tokens"
    echo "  2. Gere um token com permissão 'repo'"
    echo "  3. Execute novamente:"
    echo "     ./create_all_issues.sh seu_token_aqui"
    echo "  ou"
    echo "     export GITHUB_TOKEN='seu_token_aqui'"
    echo "     ./create_all_issues.sh"
    echo ""
    exit 1
fi

# Mostrar estatísticas
echo ""
echo -e "${BLUE}📊 Estatísticas da estrutura:${NC}"
python3 << EOF
import yaml
with open('issues-structure.yaml', 'r', encoding='utf-8') as f:
    structure = yaml.safe_load(f)
    
phases = structure.get('phases', [])
total_sub = sum(len(phase.get('sub_issues', [])) for phase in phases)
special = len(structure.get('special_issues', []))

print(f"  - Fases: {len(phases)}")
print(f"  - Sub-issues: {total_sub}")
print(f"  - Especiais: {special}")
print(f"  - Total: {len(phases) + total_sub + special} issues")
EOF

# Confirmação
echo ""
echo -e "${YELLOW}⚠️  Você está prestes a criar 40 issues no repositório datavisio-tech/pleno-psi${NC}"
echo ""
read -p "Deseja continuar? (s/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${RED}❌ Operação cancelada${NC}"
    exit 0
fi

# Executar script Python
echo ""
echo -e "${BLUE}🚀 Criando issues...${NC}"
echo ""

python3 create_issues.py --token "$TOKEN"

# Resultado
if [ $? -eq 0 ]; then
    echo ""
    echo "============================================================"
    echo -e "${GREEN}✅ Sucesso! Todas as issues foram criadas${NC}"
    echo "============================================================"
    echo ""
    echo "Próximos passos:"
    echo "  1. Acesse: https://github.com/datavisio-tech/pleno-psi/issues"
    echo "  2. Revise as issues criadas"
    echo "  3. Organize em milestones"
    echo "  4. Atribua responsáveis"
    echo ""
else
    echo ""
    echo "============================================================"
    echo -e "${RED}❌ Erro ao criar issues${NC}"
    echo "============================================================"
    echo ""
    echo "Verifique:"
    echo "  1. Token do GitHub está correto"
    echo "  2. Tem permissões no repositório"
    echo "  3. Conexão com internet está ativa"
    echo ""
    exit 1
fi
