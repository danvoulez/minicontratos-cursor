#!/bin/bash
# Script para fazer deploy no Vercel via CLI

echo "🚀 Deploy no Vercel via CLI"
echo ""

# Verifica se está logado
if ! vercel whoami &>/dev/null; then
    echo "❌ Não está logado no Vercel"
    echo "Execute: vercel login dvoulez@gmail.com"
    exit 1
fi

echo "✅ Logado no Vercel"
echo ""

# Link do projeto (se ainda não estiver linkado)
if [ ! -f ".vercel/project.json" ]; then
    echo "📦 Linkando projeto..."
    vercel link --yes
    echo ""
fi

# Adiciona variáveis de ambiente do .env.local
if [ -f ".env.local" ]; then
    echo "📝 Adicionando variáveis de ambiente..."
    
    # Lê o .env.local e adiciona cada variável
    while IFS='=' read -r key value; do
        # Ignora comentários e linhas vazias
        if [[ ! "$key" =~ ^#.*$ ]] && [ -n "$key" ] && [ -n "$value" ]; then
            # Remove espaços e aspas
            key=$(echo "$key" | xargs)
            value=$(echo "$value" | xargs | sed "s/^['\"]//;s/['\"]$//")
            
            if [ -n "$value" ] && [ "$value" != "your_secret_key_here" ]; then
                echo "  Adicionando: $key"
                echo "$value" | vercel env add "$key" production preview development 2>/dev/null || echo "    (já existe ou erro)"
            fi
        fi
    done < .env.local
    
    echo ""
fi

# Deploy
echo "🚀 Fazendo deploy..."
vercel --prod

echo ""
echo "✅ Deploy concluído!"

