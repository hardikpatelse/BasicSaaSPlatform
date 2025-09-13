using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Stripe;
using Stripe.Checkout;
using Supabase;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables
var supabaseUrl = Environment.GetEnvironmentVariable("SUPABASE_URL") ?? "your_supabase_project_url";
var supabaseServiceKey = Environment.GetEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY") ?? "your_supabase_service_role_key";
var stripeSecretKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY") ?? "your_stripe_secret_key";
var stripeWebhookSecret = Environment.GetEnvironmentVariable("STRIPE_WEBHOOK_SECRET") ?? "your_stripe_webhook_secret";
var corsOrigins = Environment.GetEnvironmentVariable("CORS_ORIGINS")?.Split(',') ?? new[] { "http://localhost:4000" };

// Configure Stripe
StripeConfiguration.ApiKey = stripeSecretKey;

// Add services to the container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins(corsOrigins)
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

// Add Supabase
builder.Services.AddScoped<Supabase.Client>(_ =>
    new Supabase.Client(supabaseUrl, supabaseServiceKey));

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = supabaseUrl,
            ValidAudience = "authenticated",
            ClockSkew = TimeSpan.Zero
        };
        
        // Configure JWT key resolver for Supabase
        options.MetadataAddress = $"{supabaseUrl}/auth/v1/.well-known/jwks";
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Billing endpoints
app.MapPost("/api/billing/checkout-session", async (CheckoutSessionRequest request) =>
{
    try
    {
        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    Price = request.PriceId,
                    Quantity = 1,
                }
            },
            Mode = "subscription",
            SuccessUrl = $"{request.SuccessUrl ?? "http://localhost:4000/dashboard"}?session_id={{CHECKOUT_SESSION_ID}}",
            CancelUrl = request.CancelUrl ?? "http://localhost:4000/pricing",
            CustomerEmail = request.CustomerEmail
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options);

        return Results.Ok(new { sessionUrl = session.Url });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.MapPost("/api/billing/portal-session", async (PortalSessionRequest request) =>
{
    try
    {
        var options = new Stripe.BillingPortal.SessionCreateOptions
        {
            Customer = request.CustomerId,
            ReturnUrl = request.ReturnUrl ?? "http://localhost:4000/dashboard"
        };

        var service = new Stripe.BillingPortal.SessionService();
        var session = await service.CreateAsync(options);

        return Results.Ok(new { portalUrl = session.Url });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

// Stripe webhook endpoint
app.MapPost("/api/webhooks/stripe", async (HttpRequest request) =>
{
    var json = await new StreamReader(request.Body).ReadToEndAsync();
    
    try
    {
        var stripeEvent = EventUtility.ConstructEvent(
            json,
            request.Headers["Stripe-Signature"],
            stripeWebhookSecret
        );

        // Handle the event
        switch (stripeEvent.Type)
        {
            case "checkout.session.completed":
                var checkoutSession = stripeEvent.Data.Object as Stripe.Checkout.Session;
                // TODO: Update user subscription status in database
                Console.WriteLine($"Checkout session completed: {checkoutSession?.Id}");
                break;
                
            case "customer.subscription.created":
            case "customer.subscription.updated":
                var subscription = stripeEvent.Data.Object as Stripe.Subscription;
                // TODO: Update user subscription status in database
                Console.WriteLine($"Subscription updated: {subscription?.Id}");
                break;
                
            case "customer.subscription.deleted":
                var deletedSubscription = stripeEvent.Data.Object as Stripe.Subscription;
                // TODO: Update user subscription status in database
                Console.WriteLine($"Subscription deleted: {deletedSubscription?.Id}");
                break;
                
            default:
                Console.WriteLine($"Unhandled event type: {stripeEvent.Type}");
                break;
        }

        return Results.Ok();
    }
    catch (StripeException ex)
    {
        Console.WriteLine($"Stripe webhook error: {ex.Message}");
        return Results.BadRequest(new { error = ex.Message });
    }
});

// User management endpoints (protected)
app.MapGet("/api/users", async (Supabase.Client supabase) =>
{
    // TODO: Implement admin-only user listing
    return Results.Ok(new { message = "Users endpoint - admin only" });
}).RequireAuthorization();

app.MapGet("/api/me", async (HttpContext context, Supabase.Client supabase) =>
{
    // TODO: Get current user profile and subscription status
    var userId = context.User.FindFirst("sub")?.Value;
    return Results.Ok(new { message = "Current user profile", userId });
}).RequireAuthorization();

app.MapPut("/api/me", async (UpdateProfileRequest request, HttpContext context, Supabase.Client supabase) =>
{
    // TODO: Update current user profile
    var userId = context.User.FindFirst("sub")?.Value;
    return Results.Ok(new { message = "Profile updated", userId });
}).RequireAuthorization();

app.Run();

// Request DTOs
public record CheckoutSessionRequest(string PriceId, string? CustomerEmail = null, string? SuccessUrl = null, string? CancelUrl = null);
public record PortalSessionRequest(string CustomerId, string? ReturnUrl = null);
public record UpdateProfileRequest(string? FullName = null, string? AvatarUrl = null);
