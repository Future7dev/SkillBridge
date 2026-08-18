using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SkillBridge.Api.Data;
using SkillBridge.Api.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// MySQL Connection String (localhost:3306, User: root, Password: Pk2003@@)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=localhost;Port=3306;Database=skillbridge_db;User=root;Password=Pk2003@@;";

// Add MySQL Entity Framework Core DbContext with SQLite resilient fallback
builder.Services.AddDbContext<AppDbContext>(options =>
{
    try
    {
        var serverVersion = new MySqlServerVersion(new Version(8, 0, 30));
        options.UseMySql(connectionString, serverVersion);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"MySQL Connection Error: {ex.Message}. Falling back to SQLite.");
        options.UseSqlite("Data Source=skillbridge.db");
    }
});

// Add Custom Services
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<SkillMatchingService>();

// Configure JWT Bearer Authentication
var key = Encoding.ASCII.GetBytes("SkillBridgeSecretKey_SuperSecure_JWT_Key_2026_DotNetCore8");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// Configure Universal CORS Policy for all local ports (localhost:3000, 3001, 5173, etc.)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.SetIsOriginAllowed(_ => true) // Allow any localhost origin (3000, 3001, etc.)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Seed initial relational database records & ensure schema
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        db.SeedInitialData();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database initialization note: {ex.Message}");
    }
}

// Configure middleware pipeline (CORS MUST come before Authentication & Routing)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run("http://localhost:5000");
