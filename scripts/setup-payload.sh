#!/bin/bash

# Script de setup do PayloadCMS para o projeto EdaShow
# Este script ajuda a configurar o ambiente inicial

set -e

echo "🚀 Setup do PayloadCMS - EdaShow"
echo "================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "ℹ $1"
}

# Verificar se o MongoDB está instalado
echo "1. Verificando MongoDB..."
if command -v mongod &> /dev/null; then
    print_success "MongoDB está instalado"
    
    # Verificar se está rodando
    if pgrep -x "mongod" > /dev/null; then
        print_success "MongoDB está rodando"
    else
        print_warning "MongoDB não está rodando"
        echo ""
        echo "Para iniciar o MongoDB:"
        echo "  brew services start mongodb-community"
        echo ""
    fi
else
    print_error "MongoDB não está instalado"
    echo ""
    echo "Para instalar o MongoDB (macOS):"
    echo "  brew tap mongodb/brew"
    echo "  brew install mongodb-community"
    echo "  brew services start mongodb-community"
    echo ""
    echo "Ou use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
    echo ""
fi

# Verificar arquivo .env
echo ""
echo "2. Verificando arquivo .env..."
if [ -f ".env" ]; then
    print_success "Arquivo .env existe"
    
    # Verificar se tem as variáveis necessárias
    if grep -q "PAYLOAD_SECRET=" .env && grep -q "DATABASE_URI=" .env; then
        print_success "Variáveis necessárias estão configuradas"
    else
        print_warning "Algumas variáveis podem estar faltando"
    fi
else
    print_warning "Arquivo .env não encontrado"
    echo ""
    echo "Criando arquivo .env a partir do .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Arquivo .env criado"
        print_warning "IMPORTANTE: Edite o arquivo .env com suas configurações"
    else
        print_error "Arquivo .env.example não encontrado"
    fi
fi

# Verificar diretório de uploads
echo ""
echo "3. Verificando diretório de uploads..."
if [ -d "public/uploads" ]; then
    print_success "Diretório public/uploads existe"
else
    print_warning "Criando diretório public/uploads..."
    mkdir -p public/uploads
    print_success "Diretório criado"
fi

# Verificar dependências
echo ""
echo "4. Verificando dependências..."
if [ -d "node_modules" ]; then
    print_success "Dependências instaladas"
else
    print_warning "Instalando dependências..."
    pnpm install
    print_success "Dependências instaladas"
fi

# Resumo final
echo ""
echo "================================"
echo "✨ Setup concluído!"
echo "================================"
echo ""
echo "Próximos passos:"
echo ""
echo "1. Certifique-se de que o MongoDB está rodando:"
echo "   brew services start mongodb-community"
echo ""
echo "2. Edite o arquivo .env se necessário:"
echo "   nano .env"
echo ""
echo "3. Inicie o servidor de desenvolvimento:"
echo "   pnpm dev"
echo ""
echo "4. Acesse o painel admin:"
echo "   http://localhost:3000/admin"
echo ""
echo "5. Crie seu primeiro usuário administrador"
echo ""
echo "6. Veja a página de exemplo:"
echo "   http://localhost:3000/cms-example"
echo ""
echo "📚 Documentação completa: PAYLOAD_README.md"
echo "📋 Resumo da integração: INTEGRACAO_PAYLOAD.md"
echo ""













