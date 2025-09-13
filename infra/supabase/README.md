# Supabase Setup

This directory contains the database migrations and setup instructions for the BasicSaaSPlatform.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Install Supabase CLI: `npm install -g supabase`

## Setup Instructions

### 1. Create a New Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project name: `basic-saas-platform`
5. Enter a strong database password
6. Choose a region close to your users
7. Click "Create new project"

### 2. Initialize Supabase Locally

```bash
# Navigate to the project root
cd /path/to/BasicSaaSPlatform

# Initialize Supabase (this creates supabase/ folder)
supabase init

# Link to your remote project
supabase link --project-ref YOUR_PROJECT_REF
```

### 3. Run Database Migrations

```bash
# Navigate to this directory
cd infra/supabase

# Apply the initial schema migration
supabase db push --file migrations/001_initial_schema.sql
```

### 4. Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure Email templates if needed
3. Set up Google OAuth:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials
   - Set redirect URL: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### 5. Get Your Environment Variables

From your Supabase dashboard:

1. Go to Settings > API
2. Copy the following values:
   - **URL**: Your project URL
   - **anon public key**: For frontend
   - **service_role key**: For backend (keep secret!)

### 6. Update Environment Files

Update the following files with your Supabase credentials:

**Frontend** (`apps/web/.env`):
```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

**Backend** (`apps/api/.env`):
```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Database Schema Overview

### Tables Created

1. **user_profiles** - Extends auth.users with additional profile information
   - Links to Supabase auth.users
   - Stores role, subscription status, and Stripe IDs
   - Protected by Row Level Security (RLS)

2. **subscriptions** - Tracks subscription history
   - Links to user_profiles
   - Stores Stripe subscription details
   - Protected by RLS

### Row Level Security (RLS)

- Users can only view/update their own data
- Admin users can view all user data
- All policies are automatically enforced

### Triggers

- Automatic user profile creation on signup
- Automatic timestamp updates
- Maintains data consistency

## Testing the Setup

1. Run the frontend: `cd apps/web && npm run serve:ssr:web`
2. Run the backend: `cd apps/api && dotnet run`
3. Try creating an account through the frontend
4. Check the user_profiles table in Supabase dashboard

## Troubleshooting

### Common Issues

1. **Migration fails**: Check if you have the correct permissions and project is linked
2. **RLS blocks queries**: Ensure you're using the service_role key for backend operations
3. **Auth not working**: Verify your OAuth provider setup and redirect URLs

### Useful Commands

```bash
# Check migration status
supabase migration list

# Reset database (destructive!)
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > types/database.types.ts
```

## Next Steps

After setting up the database:

1. Configure Stripe products and pricing
2. Test the authentication flow
3. Implement subscription webhooks
4. Deploy to production