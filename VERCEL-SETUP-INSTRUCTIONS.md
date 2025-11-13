# 🚀 Instruções de Deploy no Vercel

## 📋 Informações do Projeto

- **Repositório:** https://github.com/danvoulez/minicontratos-cursor
- **Email Vercel:** dvoulez@gmail.com
- **GitHub:** danvoulez (dan@danvoulez.com)

---

## 🔧 Passo a Passo

### 1. Acessar Vercel

1. Acesse: https://vercel.com
2. Faça login com: **dvoulez@gmail.com** (conta já existe)

### 2. Importar Projeto

1. Clique em **"Add New Project"** ou **"Import Project"**
2. Selecione **"Import Git Repository"**
3. Escolha **"danvoulez/minicontratos-cursor"**
4. Clique em **"Import"**

### 3. Configurar Build Settings

O Vercel detecta automaticamente Next.js, mas verifique:

- **Framework Preset:** Next.js
- **Root Directory:** `./` (raiz)
- **Build Command:** `npm run build` (ou `pnpm build`)
- **Output Directory:** `.next` (automático)
- **Install Command:** `npm install` (ou `pnpm install`)

### 4. Configurar Variáveis de Ambiente

Adicione todas estas variáveis no Vercel. **Os valores estão no arquivo `.env.local` local:**

#### LogLine API
```
NEXT_PUBLIC_API_URL=https://qo960fhrv0.execute-api.us-east-1.amazonaws.com
LOGLINE_API_KEY=<valor do .env.local>
NEXT_PUBLIC_LOGLINE_APP_ID=<valor do .env.local>
```

#### Google OAuth
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<valor do .env.local>
GOOGLE_CLIENT_SECRET=<valor do .env.local>
GOOGLE_PROJECT_ID=<valor do .env.local>
GOOGLE_PROJECT_NUMBER=<valor do .env.local>
```

#### GitHub Integration
```
GITHUB_APP_ID=<valor do .env.local>
GITHUB_CLIENT_ID=<valor do .env.local>
GITHUB_CLIENT_SECRET=<valor do .env.local>
GITHUB_INSTALLATION_ID=<valor do .env.local>
```

#### LLM APIs
```
ANTHROPIC_API_KEY=<valor do .env.local>
OPENAI_API_KEY=<valor do .env.local>
GEMINI_API_KEY=<valor do .env.local>
```

#### AWS Configuration (opcional, para server-side)
```
AWS_ACCESS_KEY_ID=<valor do .env.local>
AWS_SECRET_ACCESS_KEY=<valor do .env.local>
AWS_REGION=us-east-1
AWS_S3_BUCKET=diamante-spans
AWS_BEARER_TOKEN_BEDROCK=<valor do .env.local>
```

#### App URL (será preenchido automaticamente após deploy)
```
NEXT_PUBLIC_APP_URL=
```

**Como adicionar:**
1. Na página do projeto, vá em **Settings** → **Environment Variables**
2. Clique em **"Add New"**
3. Adicione cada variável (Name e Value - copie do `.env.local`)
4. Selecione **Production**, **Preview** e **Development**
5. Clique em **Save**

**💡 Dica:** Abra o arquivo `.env.local` local e copie os valores de lá para o Vercel.

### 5. Deploy

1. Após configurar as variáveis, clique em **"Deploy"**
2. Aguarde o build completar (2-5 minutos)
3. Pronto! 🎉

### 6. Configurar Domínio (Opcional)

1. Vá em **Settings** → **Domains**
2. Adicione: `minicontratos.logline.world`
3. Configure DNS conforme instruções do Vercel
4. SSL será configurado automaticamente

---

## ✅ Checklist

- [x] Conta Vercel existe (dvoulez@gmail.com)
- [ ] Repositório importado: danvoulez/minicontratos-cursor
- [ ] Build settings configuradas
- [ ] Todas as variáveis de ambiente adicionadas (copiar do .env.local)
- [ ] Deploy realizado com sucesso
- [ ] Domínio configurado (opcional)

---

## 🔗 Links Úteis

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Repositório:** https://github.com/danvoulez/minicontratos-cursor
- **LogLine API:** https://qo960fhrv0.execute-api.us-east-1.amazonaws.com

---

## 🐛 Troubleshooting

### Build falha
- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique os logs de build no Vercel
- Certifique-se de que `package.json` tem todas as dependências

### Erro de autenticação
- Verifique se `NEXT_PUBLIC_GOOGLE_CLIENT_ID` está correto
- Verifique se `NEXT_PUBLIC_API_URL` está correto
- Verifique se `LOGLINE_API_KEY` está configurada

### CORS errors
- Verifique se `NEXT_PUBLIC_APP_URL` está configurado com a URL do Vercel
- Verifique configuração de CORS no API Gateway

---

**Pronto para deploy!** 🚀
