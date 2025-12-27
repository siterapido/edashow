#!/bin/bash

# Script interativo para configurar variáveis de ambiente na Vercel
# Uso: ./scripts/configurar-env-interativo.sh

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Configuração de Variáveis de Ambiente - Vercel${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Verificar se está logado
if ! vercel whoami &> /dev/null; then
    echo -e "${RED}❌ Você não está logado na Vercel${NC}"
    echo "Execute: vercel login"
    exit 1
fi

echo -e "${GREEN}✅ Logado na Vercel${NC}"
echo ""

# Verificar variáveis existentes
echo "📋 Variáveis já configuradas:"
vercel env ls | grep -E "name|NEXT_PUBLIC_SERVER_URL|PAYLOAD_SECRET|DATABASE_URI" || echo "   Nenhuma variável crítica encontrada"
echo ""

# PAYLOAD_SECRET
if vercel env ls | grep -q "PAYLOAD_SECRET"; then
    echo -e "${GREEN}✅ PAYLOAD_SECRET já configurada${NC}"
else
    echo -e "${YELLOW}⚠️  PAYLOAD_SECRET não encontrada${NC}"
    read -p "Deseja configurar PAYLOAD_SECRET agora? (s/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        SECRET=$(openssl rand -base64 32)
        echo "Secret gerado: $SECRET"
        echo "$SECRET" | vercel env add PAYLOAD_SECRET production
        echo -e "${GREEN}✅ PAYLOAD_SECRET configurada${NC}"
    fi
fi

echo ""

# DATABASE_URI
if vercel env ls | grep -q "DATABASE_URI"; then
    echo -e "${GREEN}✅ DATABASE_URI já configurada${NC}"
else
    echo -e "${YELLOW}⚠️  DATABASE_URI não encontrada${NC}"
    echo ""
    echo "Você precisa de uma connection string PostgreSQL."
    echo ""
    echo "Opções:"
    echo "1. Supabase (se já tem projeto)"
    echo "2. Neon (grátis, criar agora)"
    echo "3. Inserir manualmente"
    echo ""
    read -p "Escolha uma opção (1/2/3): " opcao
    
    case $opcao in
        1)
            echo ""
            echo "Para obter a connection string do Supabase:"
            echo "1. Acesse: https://supabase.com/dashboard"
            echo "2. Selecione seu projeto"
            echo "3. Vá em: Settings → Database"
            echo "4. Copie a connection string (formato pooler)"
            echo ""
            echo "Formato esperado:"
            echo "postgresql://postgres.xxx:[SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
            echo ""
            read -p "Cole a DATABASE_URI aqui: " db_uri
            if [ ! -z "$db_uri" ]; then
                echo "$db_uri" | vercel env add DATABASE_URI production
                echo -e "${GREEN}✅ DATABASE_URI configurada${NC}"
            fi
            ;;
        2)
            echo ""
            echo "Para criar um banco Neon (grátis):"
            echo "1. Acesse: https://neon.tech"
            echo "2. Crie uma conta (login com GitHub)"
            echo "3. Crie um novo projeto"
            echo "4. Copie a connection string"
            echo ""
            read -p "Cole a DATABASE_URI do Neon aqui: " db_uri
            if [ ! -z "$db_uri" ]; then
                echo "$db_uri" | vercel env add DATABASE_URI production
                echo -e "${GREEN}✅ DATABASE_URI configurada${NC}"
            fi
            ;;
        3)
            read -p "Cole a DATABASE_URI completa: " db_uri
            if [ ! -z "$db_uri" ]; then
                echo "$db_uri" | vercel env add DATABASE_URI production
                echo -e "${GREEN}✅ DATABASE_URI configurada${NC}"
            fi
            ;;
        *)
            echo "Opção inválida"
            ;;
    esac
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo "📋 Resumo das variáveis configuradas:"
vercel env ls
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Verificar se todas as obrigatórias estão configuradas
MISSING=0

if ! vercel env ls | grep -q "NEXT_PUBLIC_SERVER_URL"; then
    echo -e "${RED}❌ NEXT_PUBLIC_SERVER_URL não configurada${NC}"
    MISSING=1
fi

if ! vercel env ls | grep -q "PAYLOAD_SECRET"; then
    echo -e "${RED}❌ PAYLOAD_SECRET não configurada${NC}"
    MISSING=1
fi

if ! vercel env ls | grep -q "DATABASE_URI"; then
    echo -e "${RED}❌ DATABASE_URI não configurada${NC}"
    MISSING=1
fi

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✅ Todas as variáveis obrigatórias estão configuradas!${NC}"
    echo ""
    echo "🚀 Próximo passo: Fazer redeploy"
    echo "   Execute: vercel --prod"
else
    echo -e "${YELLOW}⚠️  Ainda faltam variáveis obrigatórias${NC}"
    echo "   Configure as variáveis faltantes e execute este script novamente"
fi






