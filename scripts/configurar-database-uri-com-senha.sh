#!/bin/bash

# Script para configurar DATABASE_URI com senha fornecida
# Uso: ./scripts/configurar-database-uri-com-senha.sh [SENHA]
# Ou: SUPABASE_PASSWORD=[SENHA] ./scripts/configurar-database-uri-com-senha.sh

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Configurar DATABASE_URI - Supabase${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Informações do projeto Supabase
PROJECT_REF="exeuuqbgyfaxgbwygfuu"
HOST="aws-1-sa-east-1.pooler.supabase.com"
PORT="5432"
DATABASE="postgres"
USER="postgres.exeuuqbgyfaxgbwygfuu"

# Obter senha
if [ ! -z "$1" ]; then
    PASSWORD="$1"
elif [ ! -z "$SUPABASE_PASSWORD" ]; then
    PASSWORD="$SUPABASE_PASSWORD"
else
    echo -e "${RED}❌ Senha não fornecida${NC}"
    echo ""
    echo "Uso:"
    echo "  ./scripts/configurar-database-uri-com-senha.sh [SENHA]"
    echo ""
    echo "Ou:"
    echo "  SUPABASE_PASSWORD=[SENHA] ./scripts/configurar-database-uri-com-senha.sh"
    echo ""
    echo "Para obter a senha:"
    echo "1. Acesse: https://supabase.com/dashboard"
    echo "2. Projeto: $PROJECT_REF"
    echo "3. Settings → Database → Database Password"
    exit 1
fi

# Montar connection string
DATABASE_URI="postgresql://${USER}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}"

echo "🔧 Configurando DATABASE_URI na Vercel..."
echo ""

# Remover variável existente se houver
if vercel env ls 2>/dev/null | grep -q "DATABASE_URI"; then
    echo "Removendo DATABASE_URI existente..."
    vercel env rm DATABASE_URI production --yes 2>/dev/null || true
fi

# Adicionar nova variável
echo "$DATABASE_URI" | vercel env add DATABASE_URI production

echo ""
echo -e "${GREEN}✅ DATABASE_URI configurada com sucesso!${NC}"
echo ""
echo "📋 Variáveis configuradas:"
vercel env ls | grep -E "NEXT_PUBLIC_SERVER_URL|PAYLOAD_SECRET|DATABASE_URI"
echo ""
echo -e "${GREEN}✅ Todas as variáveis obrigatórias estão configuradas!${NC}"
echo ""
echo "🚀 Próximo passo: Fazer redeploy"
echo "   Execute: vercel --prod"
echo ""






