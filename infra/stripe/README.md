# Stripe Setup

This directory contains instructions for setting up Stripe payments and subscription billing for the BasicSaaSPlatform.

## Prerequisites

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Install Stripe CLI: Follow instructions at [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)

## Setup Instructions

### 1. Create Products and Prices

#### In Stripe Dashboard:

1. Go to [Products](https://dashboard.stripe.com/products) in your Stripe dashboard
2. Click "Add product"

**Create Starter Plan:**
- Name: "Starter Plan"
- Description: "Perfect for getting started with BasicSaaSPlatform"
- Pricing model: "Recurring"
- Price: $9.00 USD
- Billing period: Monthly
- Save the **Price ID** (starts with `price_`)

**Create Pro Plan:**
- Name: "Pro Plan" 
- Description: "For growing businesses using BasicSaaSPlatform"
- Pricing model: "Recurring"
- Price: $29.00 USD
- Billing period: Monthly
- Save the **Price ID** (starts with `price_`)

#### Via Stripe CLI (Alternative):

```bash
# Create Starter product and price
stripe products create \
  --name="Starter Plan" \
  --description="Perfect for getting started with BasicSaaSPlatform"

stripe prices create \
  --unit-amount=900 \
  --currency=usd \
  --recurring[interval]=month \
  --product=prod_XXXXXX

# Create Pro product and price  
stripe products create \
  --name="Pro Plan" \
  --description="For growing businesses using BasicSaaSPlatform"

stripe prices create \
  --unit-amount=2900 \
  --currency=usd \
  --recurring[interval]=month \
  --product=prod_XXXXXX
```

### 2. Configure Customer Portal

1. Go to [Customer Portal](https://dashboard.stripe.com/settings/billing/portal) in Stripe Dashboard
2. Click "Activate test link" 
3. Configure the following settings:
   - **Business information**: Add your business details
   - **Customer information**: Allow customers to update email and billing address
   - **Payment methods**: Allow customers to update payment methods
   - **Invoices**: Allow customers to view invoice history
   - **Subscriptions**: Allow customers to:
     - Cancel subscriptions
     - Switch between plans (if implementing plan switching)
     - View upcoming invoices

### 3. Set Up Webhooks

#### For Local Development:

```bash
# Install and login to Stripe CLI
stripe login

# Forward webhooks to local API
stripe listen --forward-to localhost:5015/api/webhooks/stripe
```

Copy the webhook signing secret (starts with `whsec_`) for your local environment.

#### For Production:

1. Go to [Webhooks](https://dashboard.stripe.com/webhooks) in Stripe Dashboard
2. Click "Add endpoint"
3. Set endpoint URL: `https://your-api-domain.azurewebsites.net/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Save the webhook signing secret

### 4. Get API Keys

From your Stripe Dashboard:

1. Go to [Developers > API Keys](https://dashboard.stripe.com/apikeys)
2. Copy the following:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

### 5. Update Environment Files

**Frontend** (`apps/web/.env`):
```env
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

**Backend** (`apps/api/.env`):
```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_STARTER_PRICE_ID=price_your_starter_plan_id
STRIPE_PRO_PRICE_ID=price_your_pro_plan_id
```

## Testing the Integration

### 1. Test Checkout Flow

1. Start your frontend and backend servers
2. Navigate to the pricing page
3. Click "Get Started" on either plan
4. Use Stripe test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Declined**: `4000 0000 0000 0002`
   - Use any future expiry date and any 3-digit CVC

### 2. Test Webhooks

```bash
# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
```

### 3. Test Customer Portal

1. Complete a test checkout
2. Go to dashboard and click "Manage Billing"
3. Verify customer can:
   - Update payment method
   - View invoices
   - Cancel subscription

## Webhook Event Handling

The API handles the following webhook events:

### `checkout.session.completed`
- Fired when customer completes checkout
- Used to activate user's subscription
- Updates user's subscription status in database

### `customer.subscription.created/updated`
- Fired when subscription is created or modified
- Updates subscription details in database
- Handles plan changes

### `customer.subscription.deleted`
- Fired when subscription is canceled
- Updates user's subscription status to 'canceled'
- User retains access until period end

## Security Considerations

### Webhook Security
- Always verify webhook signatures using your webhook secret
- Use HTTPS endpoints in production
- Implement idempotency to handle duplicate events

### API Key Security
- Never expose secret keys in frontend code
- Use environment variables for all keys
- Rotate keys regularly in production

### Testing vs Production
- Use test mode for development
- Create separate webhooks for test and live modes
- Test thoroughly before going live

## Going Live

### 1. Switch to Live Mode
1. Toggle to "Live" mode in Stripe Dashboard
2. Create live versions of:
   - Products and prices
   - Webhook endpoints
   - Customer portal configuration

### 2. Update Environment Variables
Replace all test keys with live keys:
- `pk_live_` for publishable key
- `sk_live_` for secret key
- Live webhook secrets

### 3. Verify Webhook Endpoints
- Ensure production webhook URLs are accessible
- Test with Stripe CLI in live mode
- Monitor webhook delivery in dashboard

## Troubleshooting

### Common Issues

1. **Webhook signature validation fails**
   - Check webhook secret is correct
   - Verify endpoint URL matches Stripe configuration
   - Ensure raw body is used for signature validation

2. **Checkout redirects to wrong URL**
   - Verify success/cancel URLs in checkout session creation
   - Check CORS settings for cross-origin requests

3. **Customer portal not working**
   - Ensure customer portal is activated
   - Verify customer has valid Stripe customer ID
   - Check customer portal configuration

### Useful Stripe CLI Commands

```bash
# Listen to all webhook events
stripe listen

# Trigger specific events for testing
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated

# View recent events
stripe events list --limit 10

# Get details of specific event
stripe events retrieve evt_XXXXXX
```

## Next Steps

After setting up Stripe:

1. Implement subscription management in frontend
2. Add plan switching functionality
3. Set up usage-based billing (if needed)
4. Configure dunning management for failed payments
5. Implement proration for mid-cycle changes