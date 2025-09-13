export const environment = {
  production: false,
  supabase: {
    url: 'your_supabase_project_url',
    anonKey: 'your_supabase_anon_key'
  },
  stripe: {
    publishableKey: 'your_stripe_publishable_key'
  },
  api: {
    baseUrl: 'http://localhost:5000'
  }
};