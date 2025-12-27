#!/bin/bash

# Script para atualizar a senha do PostgreSQL no arquivo .env.local
# Uso: ./scripts/atualizar-senha-local.sh [SENHA]
# Ou: SUPABASE_PASSWORD=[SENHA] ./scripts/atualizar-senha-local.sh

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Atualizar Senha do Banco de Dados - .env.local${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Informações do projeto Supabase
PROJECT_REF="exeuuqbgyfaxgbwygfuu"
HOST="aws-1-sa-east-1.pooler.supabase.com"
PORT="5432"
DATABASE="postgres"
USER="postgres.exeuuqbgyfaxgbwygfuu"
ENV_FILE=".env.local"

# Obter senha
if [ ! -z "$1" ]; then
    PASSWORD="$1"
elif [ ! -z "$SUPABASE_PASSWORD" ]; then
    PASSWORD="$SUPABASE_PASSWORD"
else
    echo -e "${RED}❌ Senha não fornecida${NC}"
    echo ""
    echo "Uso:"
    echo "  ./scripts/atualizar-senha-local.sh [SENHA]"
    echo ""
    echo "Ou:"
    echo "  SUPABASE_PASSWORD=[SENHA] ./scripts/atualizar-senha-local.sh"
    echo ""
    echo "Para obter a senha:"
    echo "1. Acesse: https://supabase.com/dashboard"
    echo "2. Projeto: $PROJECT_REF"
    echo "3. Settings → Database → Reset Database Password"
    exit 1
fi

# Verificar se o arquivo .env.local existe
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}⚠️  Arquivo $ENV_FILE não encontrado${NC}"
    echo "Criando arquivo $ENV_FILE..."
    
    # Criar arquivo básico
    cat > "$ENV_FILE" << EOF
# Variáveis de Ambiente - Desenvolvimento Local
DATABASE_URI=postgresql://${USER}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}
PAYLOAD_SECRET=fK+TGJAdOgcaLxYgOGhLqeXizTAcFiZwS7hriJbShsA=
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
EOF
    
    echo -e "${GREEN}✅ Arquivo $ENV_FILE criado${NC}"
else
    # Montar nova connection string
    NEW_DATABASE_URI="postgresql://${USER}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}"
    
    # Criar backup do arquivo original
    BACKUP_FILE="${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$ENV_FILE" "$BACKUP_FILE"
    echo -e "${BLUE}📋 Backup criado: $BACKUP_FILE${NC}"
    
    # Atualizar DATABASE_URI no arquivo
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|^DATABASE_URI=.*|DATABASE_URI=${NEW_DATABASE_URI}|g" "$ENV_FILE"
    else
        # Linux
        sed -i "s|^DATABASE_URI=.*|DATABASE_URI=${NEW_DATABASE_URI}|g" "$ENV_FILE"
    fi
    
    echo -e "${GREEN}✅ Senha atualizada no arquivo $ENV_FILE${NC}"
fi

echo ""
echo -e "${GREEN}✅ Configuração concluída!${NC}"
echo ""
echo "Connection string atualizada:"
echo "postgresql://${USER}:****@${HOST}:${PORT}/${DATABASE}"
echo ""
echo "Para testar a conexão, execute:"
echo "  npm run test:db"
echo ""






