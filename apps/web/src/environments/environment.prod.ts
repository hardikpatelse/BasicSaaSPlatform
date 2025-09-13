export const environment = {
  production: true,
  supabase: {
    url: 'your_supabase_project_url',
    anonKey: 'your_supabase_anon_key'
  },
  stripe: {
    publishableKey: 'your_stripe_publishable_key'
  },
  api: {
    baseUrl: 'https://your-api-domain.azurewebsites.net'
  }
};