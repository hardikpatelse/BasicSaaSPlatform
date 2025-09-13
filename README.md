# BasicSaaSPlatform

A production-ready MVP SaaS starter built with Angular 20 (SSR) and .NET 8 Minimal API.

![Landing Page](https://img.shields.io/badge/Frontend-Angular%2020-red)
![API](https://img.shields.io/badge/Backend-.NET%208-blue)
![Database](https://img.shields.io/badge/Database-Supabase-green)
![Payments](https://img.shields.io/badge/Payments-Stripe-purple)

## 🚀 Features

- **Modern Stack**: Angular 20 with SSR, .NET 8 Minimal API, PostgreSQL via Supabase
- **Authentication**: Email/password + Google OAuth with role-based access control
- **Payments**: Stripe subscription billing with customer portal
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Production Ready**: CI/CD pipelines, security headers, environment management
- **Developer Experience**: TypeScript, hot reload, comprehensive documentation

## 📋 Quick Start

### Prerequisites

- Node.js 20+ and npm 10+
- .NET 8 SDK
- Supabase account
- Stripe account
- Git

### 1. Clone and Install

```bash
git clone https://github.com/hardikpatelse/BasicSaaSPlatform.git
cd BasicSaaSPlatform

# Install all dependencies
npm run install:all
```

### 2. Environment Setup

**Frontend (`apps/web/.env`):**
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
API_BASE_URL=http://localhost:5015
```

**Backend (`apps/api/.env`):**
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CORS_ORIGINS=http://localhost:4000,https://your-domain.vercel.app
STRIPE_STARTER_PRICE_ID=price_your_starter_plan_id
STRIPE_PRO_PRICE_ID=price_your_pro_plan_id
```

### 3. Database Setup

Follow the detailed guide in [`infra/supabase/README.md`](infra/supabase/README.md):

1. Create Supabase project
2. Run database migrations
3. Configure authentication providers
4. Set up Row Level Security

### 4. Stripe Configuration

Follow the setup guide in [`infra/stripe/README.md`](infra/stripe/README.md):

1. Create subscription products
2. Configure customer portal
3. Set up webhooks
4. Test with test cards

### 5. Run Development Servers

```bash
# Terminal 1: Frontend (Angular SSR)
npm run dev:web

# Terminal 2: Backend (.NET API)
npm run dev:api
```

Visit:
- **Frontend**: http://localhost:4000
- **API Docs**: http://localhost:5015/swagger

## 🏗️ Architecture

```
BasicSaaSPlatform/
├── apps/
│   ├── web/              # Angular 20 + SSR + Tailwind
│   └── api/              # .NET 8 Minimal API
├── infra/
│   ├── supabase/         # Database migrations & setup
│   └── stripe/           # Payment configuration
├── .github/workflows/    # CI/CD for Azure deployment
└── docs/                 # Additional documentation
```

### Frontend (Angular 20)

- **SSR**: Server-side rendering with Angular Universal
- **Styling**: Tailwind CSS with responsive design
- **Auth**: Supabase integration with route guards
- **State**: RxJS observables for reactive data flow
- **Routing**: Lazy-loaded routes with authentication

**Key Routes:**
- `/` - Landing page with features and CTA
- `/pricing` - Two-tier subscription plans
- `/auth/*` - Authentication flows
- `/dashboard` - User dashboard (protected)
- `/admin` - Admin panel (role-protected)

### Backend (.NET 8)

- **API**: Minimal APIs with Swagger documentation
- **Auth**: JWT bearer token validation via Supabase
- **Payments**: Stripe integration for subscriptions
- **Database**: Entity queries via Supabase client
- **CORS**: Configured for cross-origin requests

**Key Endpoints:**
- `POST /api/billing/checkout-session` - Create Stripe checkout
- `POST /api/billing/portal-session` - Customer portal access
- `POST /api/webhooks/stripe` - Handle Stripe events
- `GET /api/me` - Current user profile
- `GET /api/users` - Admin user management

## 🚢 Deployment

### Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Set project root to `apps/web`
3. Add environment variables
4. Deploy automatically on push

### Backend (Azure App Service)

1. Configure GitHub secrets:
   - `AZURE_WEBAPP_NAME`
   - `AZURE_WEBAPP_PUBLISH_PROFILE`
2. Push to main branch triggers deployment
3. Set application settings in Azure portal

## 🔒 Security

- **Authentication**: Secure JWT tokens via Supabase
- **Authorization**: Role-based access control (user/admin)
- **Database**: Row Level Security (RLS) policies
- **Payments**: Webhook signature verification
- **Headers**: Security headers in production

## 🧪 Testing

```bash
# Frontend tests
npm run test:web

# Backend tests  
npm run test:api

# Build verification
npm run build
```

## 📚 Documentation

- [Supabase Setup](infra/supabase/README.md) - Database configuration
- [Stripe Setup](infra/stripe/README.md) - Payment integration
- [API Documentation](http://localhost:5015/swagger) - Interactive API docs
- [Deployment Guide](#deployment) - Production deployment

## 🛠️ Development

### Available Scripts

```bash
npm run dev:web          # Start Angular development server
npm run dev:api          # Start .NET API server
npm run build            # Build both frontend and backend
npm run install:all      # Install all dependencies
npm run clean            # Clean build artifacts
```

### Project Structure

- **Monorepo**: Single repository with multiple applications
- **TypeScript**: Strongly typed throughout
- **Environment**: Separate configs for dev/prod
- **Linting**: Consistent code style

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/hardikpatelse/BasicSaaSPlatform/issues)
- **Documentation**: Check README files in each directory
- **Community**: Start a discussion for questions

---

Built with ❤️ by [Hardik Patel](https://github.com/hardikpatelse)