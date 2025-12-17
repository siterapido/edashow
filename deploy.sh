#!/bin/bash

echo "🚀 Script de Deploy - EdaShow"
echo "================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Passo 1: Autenticação GitHub
echo -e "${YELLOW}📋 PASSO 1: Autenticação no GitHub${NC}"
echo "Você está autenticado como: $(gh auth status 2>&1 | grep 'Logged in' | awk '{print $7}')"
echo ""
echo "⚠️  O repositório pertence a: soumarcosdesouza"
echo "⚠️  Você está autenticado como: siterapido"
echo ""
echo "Você precisa:"
echo "1. Fazer logout da conta atual: gh auth logout"
echo "2. Fazer login com a conta correta: gh auth login"
echo ""
read -p "Pressione Enter quando estiver pronto para fazer o push..."

# Passo 2: Push para GitHub
echo ""
echo -e "${YELLOW}📤 PASSO 2: Enviando para GitHub${NC}"
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Push realizado com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao fazer push. Verifique sua autenticação.${NC}"
    exit 1
fi

# Passo 3: Deploy no Vercel
echo ""
echo -e "${YELLOW}🌐 PASSO 3: Deploy no Vercel${NC}"
echo "Você está autenticado no Vercel como: $(vercel whoami)"
echo ""
read -p "Deseja fazer o deploy agora? (s/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[SsYy]$ ]]; then
    echo "Iniciando deploy..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Deploy realizado com sucesso!${NC}"
        echo ""
        echo "🎉 Seu projeto está no ar!"
        echo ""
        echo "📋 Próximos passos:"
        echo "1. Configure as variáveis de ambiente no Vercel:"
        echo "   - PAYLOAD_SECRET"
        echo "   - DATABASE_URI"
        echo "   - NEXT_PUBLIC_SERVER_URL"
        echo ""
        echo "2. Para configurar via CLI:"
        echo "   vercel env add PAYLOAD_SECRET"
        echo "   vercel env add DATABASE_URI"
        echo "   vercel env add NEXT_PUBLIC_SERVER_URL"
        echo ""
        echo "3. Após configurar, faça um novo deploy:"
        echo "   vercel --prod"
    else
        echo -e "${RED}❌ Erro no deploy.${NC}"
        exit 1
    fi
else
    echo "Deploy cancelado. Você pode fazer manualmente com: vercel --prod"
fi

echo ""
echo -e "${GREEN}✨ Script finalizado!${NC}"
