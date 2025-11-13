# 🚀 Deploy via Vercel CLI

## 📋 Passo a Passo

### 1. Login no Vercel

```bash
cd /Users/voulezvous/v0-minicontratos-platform
vercel login dvoulez@gmail.com
```

Isso abrirá o navegador para autenticação.

### 2. Linkar Projeto

```bash
vercel link
```

Quando perguntado:
- **Set up and deploy?** → `Y`
- **Which scope?** → Selecione sua conta
- **Link to existing project?** → `N` (criar novo)
- **Project name?** → `minicontratos-cursor` (ou deixe o padrão)
- **Directory?** → `.` (raiz)

### 3. Adicionar Variáveis de Ambiente

#### Opção A: Manual (uma por uma)

```bash
# LogLine API
vercel env add NEXT_PUBLIC_API_URL production preview development
# Cole o valor do .env.local

vercel env add LOGLINE_API_KEY production preview development
# Cole o valor do .env.local

vercel env add NEXT_PUBLIC_LOGLINE_APP_ID production preview development
# Cole o valor do .env.local

# Google OAuth
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID production preview development
# Cole o valor do .env.local

vercel env add GOOGLE_CLIENT_SECRET production preview development
# Cole o valor do .env.local

vercel env add GOOGLE_PROJECT_ID production preview development
# Cole o valor do .env.local

vercel env add GOOGLE_PROJECT_NUMBER production preview development
# Cole o valor do .env.local

# GitHub
vercel env add GITHUB_APP_ID production preview development
# Cole o valor do .env.local

vercel env add GITHUB_CLIENT_ID production preview development
# Cole o valor do .env.local

vercel env add GITHUB_CLIENT_SECRET production preview development
# Cole o valor do .env.local

vercel env add GITHUB_INSTALLATION_ID production preview development
# Cole o valor do .env.local

# LLM APIs
vercel env add ANTHROPIC_API_KEY production preview development
# Cole o valor do .env.local

vercel env add OPENAI_API_KEY production preview development
# Cole o valor do .env.local

vercel env add GEMINI_API_KEY production preview development
# Cole o valor do .env.local

# AWS (opcional)
vercel env add AWS_ACCESS_KEY_ID production preview development
# Cole o valor do .env.local

vercel env add AWS_SECRET_ACCESS_KEY production preview development
# Cole o valor do .env.local

vercel env add AWS_REGION production preview development
# Cole: us-east-1

vercel env add AWS_S3_BUCKET production preview development
# Cole: diamante-spans

vercel env add AWS_BEARER_TOKEN_BEDROCK production preview development
# Cole o valor do .env.local
```

#### Opção B: Usar arquivo .env.local (mais rápido)

```bash
# O Vercel CLI pode ler do .env.local automaticamente
# Mas você ainda precisa adicionar manualmente ou usar o script
```

### 4. Deploy

```bash
# Deploy para produção
vercel --prod

# Ou deploy para preview
vercel
```

### 5. Verificar Deploy

Após o deploy, você receberá uma URL. Acesse para testar!

---

## 🔧 Comandos Úteis

```bash
# Ver status
vercel ls

# Ver logs
vercel logs

# Remover projeto
vercel remove

# Ver variáveis de ambiente
vercel env ls
```

---

## ✅ Checklist

- [ ] Login feito: `vercel login dvoulez@gmail.com`
- [ ] Projeto linkado: `vercel link`
- [ ] Variáveis de ambiente adicionadas
- [ ] Deploy realizado: `vercel --prod`
- [ ] URL de produção funcionando

---

**Pronto para deploy!** 🚀

