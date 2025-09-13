# BasicSaaSPlatform

A production-ready MVP SaaS starter built with Angular 20 (SSR) and .NET 8 Minimal API.

## Architecture

- **Frontend**: Angular 20 with SSR via Angular Universal + Tailwind CSS
- **Backend**: .NET 8 Minimal API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password + Google OAuth)
- **Payments**: Stripe (Monthly subscriptions with yearly option planned)
- **Deployment**: 
  - Frontend: Vercel
  - Backend: Azure App Service

## Project Structure

```
├── apps/
│   ├── web/          # Angular 20 frontend with SSR
│   └── api/          # .NET 8 Minimal API backend
├── infra/
│   ├── supabase/     # Database migrations and setup
│   └── stripe/       # Stripe product configuration
├── .github/
│   └── workflows/    # CI/CD for Azure deployment
└── docs/             # Additional documentation
```

## Prerequisites

- Node.js 20+
- .NET 8 SDK
- Supabase account
- Stripe account
- Azure account (for API deployment)
- Vercel account (for frontend deployment)

## Quick Start

### 1. Environment Setup

Copy environment example files and configure:

```bash
# Frontend environment
cp apps/web/.env.example apps/web/.env

# Backend environment  
cp apps/api/.env.example apps/api/.env
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Run the database migrations:
   ```bash
   cd infra/supabase
   # Follow instructions in README.md
   ```

### 3. Stripe Setup

1. Create Stripe products for your subscription plans
2. Configure webhook endpoints
3. Follow instructions in `infra/stripe/README.md`

### 4. Local Development

```bash
# Install dependencies
cd apps/web && npm install
cd apps/api && dotnet restore

# Start development servers
npm run dev:web    # Angular dev server with SSR
npm run dev:api    # .NET API server
```

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set the project root to `apps/web`
3. Configure environment variables
4. Deploy

### Backend (Azure App Service)

1. Configure GitHub secrets for Azure deployment
2. Push to main branch to trigger CI/CD
3. Configure app settings in Azure

## Features

### Authentication
- Email/password signup and login
- Google OAuth integration
- Password reset functionality
- Protected route guards

### Subscription Management
- Two-tier pricing (Starter $9/mo, Pro $29/mo)
- Stripe Checkout integration
- Customer portal for billing management
- Webhook handling for subscription events

### User Management
- User dashboard with profile management
- Admin panel for user overview
- Role-based access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.