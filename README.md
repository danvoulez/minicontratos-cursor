# Minicontratos Platform

Contract management platform built with Next.js and integrated with LogLine API.

## 🚀 Features

- **Authentication**: Google OAuth and Magic Link support
- **Contract Management**: Create, read, update, and delete contracts
- **LogLine Integration**: Full integration with LogLine API for span tracking
- **JWT & API Key Auth**: Supports both JWT tokens and API keys
- **LLM Support**: Anthropic Claude integration with user-provided API keys

## 📋 Prerequisites

- Node.js 18+ 
- npm or pnpm
- LogLine API access (API key or JWT token)

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/danvoulez/minicontratos-platform.git
   cd minicontratos-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=https://qo960fhrv0.execute-api.us-east-1.amazonaws.com
   NEXT_PUBLIC_APP_URL=
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=206533069705-vpr05og8c8faijssgkkka2itkr0epupm.apps.googleusercontent.com
   LOGLINE_API_KEY=your_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_key_here
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### AWS (Terraform)

See `infra/terraform/` for Terraform configuration.

## 🔐 Authentication

The platform supports two authentication methods:

1. **Google OAuth**: Click "Continue with Google" on the login screen
2. **Magic Link**: Enter your email to receive a magic link

After authentication, JWT tokens are stored in:
- `localStorage` (client-side)
- Cookies (server-side actions)

## 📚 API Integration

### LogLine API Client

The `LogLineClient` class handles all API interactions:

```typescript
import { createLogLineClient } from '@/lib/logline'

// With API key
const client = createLogLineClient('your_api_key')

// With JWT token
const client = createLogLineClient(null, 'jwt_token')

// Write a span
await client.writeSpan({
  span: {
    context: 'User created contract',
    response: JSON.stringify({ contract_id: '123' }),
    metadata: { type: 'contract_created' }
  }
})

// Read spans
const spans = await client.getSpans({ type: 'contract', limit: 10 })
```

### Available Endpoints

- `POST /spans` - Write a span
- `GET /spans` - Read spans (with RLS filtering)
- `GET /spans?type=<type>` - Filter by span type
- `POST /onboarding` - Register new app
- `POST /auth/magic-link` - Request magic link
- `GET /auth/verify` - Verify token
- `GET /auth/google/authorize` - Google OAuth

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│  Frontend (Next.js)                  │
│  - Client-side: localStorage + JWT   │
│  - Server-side: Cookies + API key   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  LogLine API (AWS Lambda)            │
│  - Authentication & Authorization    │
│  - Row-Level Security (RLS)          │
│  - Span storage (S3)                 │
└─────────────────────────────────────┘
```

## 📝 License

MIT

## 🔗 Links

- [LogLine Documentation](https://logline.world)
- [Vercel Deployment](https://vercel.com)
