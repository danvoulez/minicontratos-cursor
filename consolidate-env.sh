#!/bin/bash
# Script para consolidar todos os arquivos .env em .env.local

echo "🔍 Procurando todos os arquivos .env..."
echo ""

# Lista de arquivos para verificar
FILES=(".env" ".env.backup" ".env.bak" ".env2" ".env.local")

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "📄 $file"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        cat "$file"
        echo ""
    fi
done

echo "✅ Verificação completa!"
