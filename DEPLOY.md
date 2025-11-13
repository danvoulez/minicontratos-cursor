# 🚀 Guia de Deploy - Minicontratos Platform

## 📋 Opções de Deploy

### Opção 1: Vercel (Recomendado - Mais Rápido) ⚡

**Tempo estimado:** 5 minutos

1. **Acesse [Vercel](https://vercel.com)**
2. **Importe o repositório:**
   - Clique em "Add New Project"
   - Selecione `danvoulez/minicontratos-platform`
   - Clique em "Import"

3. **Configure variáveis de ambiente:**
   ```
   NEXT_PUBLIC_API_URL=https://qo960fhrv0.execute-api.us-east-1.amazonaws.com
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=206533069705-vpr05og8c8faijssgkkka2itkr0epupm.apps.googleusercontent.com
   LOGLINE_API_KEY=ll_7_ekrWhZbk-0VzS3URhxXmkQZYgnAX6CJE7H_ca_LHo
   ANTHROPIC_API_KEY=(opcional)
   ```

4. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o build completar
   - Pronto! 🎉

5. **Configurar domínio (opcional):**
   - Settings → Domains
   - Adicione `minicontratos.logline.world`
   - Configure DNS conforme instruções

---

### Opção 2: AWS Amplify (Terraform) 🏗️

**Tempo estimado:** 15-20 minutos

#### Pré-requisitos:
- Terraform >= 1.0 instalado
- AWS CLI configurado
- Credenciais AWS com permissões adequadas

#### Passos:

1. **Configure variáveis:**
   ```bash
   cd infra/terraform
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Edite `terraform.tfvars`:**
   ```hcl
   aws_region         = "us-east-1"
   project_name       = "minicontratos"
   environment        = "production"
   github_repo_url    = "https://github.com/danvoulez/minicontratos-platform"
   logline_api_key    = "ll_7_ekrWhZbk-0VzS3URhxXmkQZYgnAX6CJE7H_ca_LHo"
   anthropic_api_key  = "your_key_here"
   ```

3. **Inicialize e aplique:**
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

4. **Configure GitHub no Amplify:**
   - Acesse AWS Amplify Console
   - Conecte o repositório GitHub
   - Configure build settings (já incluído no Terraform)
   - Deploy automático! 🎉

5. **Obtenha a URL:**
   ```bash
   terraform output amplify_app_url
   ```

---

## 🔐 Variáveis de Ambiente

### Obrigatórias:
- `NEXT_PUBLIC_API_URL` - URL da API LogLine
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `LOGLINE_API_KEY` - API Key do LogLine (server-side)

### Opcionais:
- `ANTHROPIC_API_KEY` - API Key do Anthropic (fallback)
- `NEXT_PUBLIC_APP_URL` - URL da aplicação (para callbacks)

---

## 🌐 Configuração de DNS

### Para Vercel:
1. Settings → Domains → Add Domain
2. Digite `minicontratos.logline.world`
3. Configure DNS conforme instruções do Vercel

### Para AWS Amplify:
1. AWS Amplify Console → App Settings → Domain Management
2. Adicione domínio customizado
3. Configure Route 53 conforme instruções

---

## ✅ Checklist Pós-Deploy

- [ ] Testar autenticação (Google OAuth)
- [ ] Testar autenticação (Magic Link)
- [ ] Testar escrita de spans
- [ ] Testar leitura de spans
- [ ] Verificar RLS funcionando
- [ ] Configurar domínio customizado
- [ ] Configurar SSL (automático em ambos)
- [ ] Testar em produção

---

## 🐛 Troubleshooting

### Erro: "LOGLINE_API_KEY not configured"
- Verifique se a variável está configurada no Vercel/Amplify
- Certifique-se de que não tem `NEXT_PUBLIC_` no nome (server-side only)

### Erro: CORS
- Verifique se `NEXT_PUBLIC_APP_URL` está configurado corretamente
- Verifique configuração de CORS no API Gateway

### Erro: Build falha
- Verifique logs de build no Vercel/Amplify
- Certifique-se de que todas as dependências estão no `package.json`

---

## 📚 Links Úteis

- **Repositório:** https://github.com/danvoulez/minicontratos-platform
- **Vercel Dashboard:** https://vercel.com/dashboard
- **AWS Amplify Console:** https://console.aws.amazon.com/amplify
- **LogLine API:** https://qo960fhrv0.execute-api.us-east-1.amazonaws.com

---

**Pronto para deploy!** 🚀

