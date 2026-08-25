# SkillBridge API

ASP.NET Core 8 Web API powering the SkillBridge platform.

## Stack
- **Framework:** ASP.NET Core 8 (Minimal Hosting Model)
- **ORM:** Entity Framework Core + Pomelo MySQL provider
- **Auth:** JWT Bearer tokens (HMAC-SHA256)
- **Password Hashing:** BCrypt.Net
- **Database:** MySQL 8 (SQLite fallback for local dev)
- **API Docs:** Swagger / OpenAPI (dev only)

## Running Locally

```bash
# restore packages
dotnet restore

# run on http://localhost:5000
dotnet run
```

Swagger UI available at `http://localhost:5000/swagger` in Development mode.

## Project Structure

| Folder | Purpose |
|---|---|
| `Controllers/` | API route handlers |
| `Models/` | EF Core entity classes & DTOs |
| `Data/` | `AppDbContext` + seed data |
| `Services/` | Business logic (JWT, skill matching) |
