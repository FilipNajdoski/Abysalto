# AbySalto.Mid

A .NET 9 Clean Architecture Web API (users, products, favorites, basket) with a React (Vite) storefront.

- **Backend:** ASP.NET Core 9, EF Core 9 (SQL Server), ASP.NET Core Identity + JWT, product data from [DummyJSON](https://dummyjson.com) with in-memory caching.
- **Frontend:** React 18 + Vite 6 (`frontend/`), including a simulated checkout.

```
AbySalto.Mid.Domain           Entities and domain rules (no framework dependencies)
AbySalto.Mid.Application      Use cases, DTOs and ports (interfaces)
AbySalto.Mid.Infrastructure   EF Core, Identity, JWT, DummyJSON client, SQL scripts
AbySalto.Mid                  Web API (controllers, Swagger, CORS) – startup project
frontend                      React storefront
docs                          Code review and notes
```

---

## 1. Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| [.NET SDK](https://dotnet.microsoft.com/download/dotnet/9.0) | 9.0+ | `dotnet --version` |
| [Node.js](https://nodejs.org) | 18+ (LTS recommended) | includes `npm` |
| SQL Server | LocalDB, Express or Developer | LocalDB ships with Visual Studio |
| Visual Studio 2022 17.12+ / 2026 *(optional)* | | with the *ASP.NET and web development* workload |
| Internet access | | product data is loaded from `https://dummyjson.com` |

---

## 2. Get the code

```powershell
git clone https://github.com/FilipNajdoski/Abysalto.git
cd Abysalto
```

Or download the ZIP from GitHub, extract it, and open a terminal in the extracted folder (the folder containing `AbySalto.Mid.sln`).

---

## 3. Create the database

The schema is created manually with SQL scripts (no EF migrations are applied at startup).

1. Create an empty database named **`Abysalto`**.
2. Run the scripts **in order** against it:

   ```
   AbySalto.Mid.Infrastructure/Persistence/Migrations/Scripts/001_InitialCreate.sql
   AbySalto.Mid.Infrastructure/Persistence/Migrations/Scripts/002_Favorites.sql
   AbySalto.Mid.Infrastructure/Persistence/Migrations/Scripts/003_Basket.sql
   ```

**Option A – command line (LocalDB + sqlcmd):**

```powershell
sqllocaldb start MSSQLLocalDB
sqlcmd -S "(localdb)\MSSQLLocalDB" -Q "IF DB_ID('Abysalto') IS NULL CREATE DATABASE Abysalto"
$scripts = "AbySalto.Mid.Infrastructure\Persistence\Migrations\Scripts"
sqlcmd -S "(localdb)\MSSQLLocalDB" -d Abysalto -i "$scripts\001_InitialCreate.sql"
sqlcmd -S "(localdb)\MSSQLLocalDB" -d Abysalto -i "$scripts\002_Favorites.sql"
sqlcmd -S "(localdb)\MSSQLLocalDB" -d Abysalto -i "$scripts\003_Basket.sql"
```

**Option B – Visual Studio / SSMS:** connect to `(localdb)\MSSQLLocalDB` in *SQL Server Object Explorer* or SSMS, create the `Abysalto` database, then open and execute each script in order.

---

## 4. Configure (optional)

Defaults live in `AbySalto.Mid/appsettings.json` and work out of the box with LocalDB.

| Setting | Default | Change when… |
|---------|---------|--------------|
| `ConnectionStrings:DefaultConnection` | `Server=(localdb)\MSSQLLocalDB;Database=Abysalto;Trusted_Connection=True;...` | you use a different SQL Server instance |
| `Jwt:Key` | dev-only placeholder | **always** for anything other than local development |
| `Cors:AllowedOrigins` | `http://localhost:5173` | the frontend runs on another URL |
| `DummyJson:CacheMinutes` | `10` | you want a different product cache duration |

Prefer [user secrets](https://learn.microsoft.com/aspnet/core/security/app-secrets) instead of editing the file:

```powershell
cd AbySalto.Mid
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=.;Database=Abysalto;Trusted_Connection=True;TrustServerCertificate=True"
dotnet user-secrets set "Jwt:Key" "<a-long-random-secret-at-least-32-characters>"
```

The frontend reads `frontend/.env` (optional). Copy `frontend/.env.example` to `frontend/.env` only if the API is not on `http://localhost:5269`.

---

## 5. Run the application

### Option A – Visual Studio (one click)

1. Open `AbySalto.Mid.sln`.
2. Set **AbySalto.Mid.WebApi** as the startup project and pick the **`http`** (or `https`) launch profile.
3. Press **F5**.

On the first build, `npm install` runs automatically for the frontend. The API starts on `http://localhost:5269` and the SPA proxy launches the Vite dev server, opening the storefront at **http://localhost:5173**.

> Use the **`API only (Swagger)`** profile to start only the backend and open Swagger.

### Option B – Command line (two terminals)

**Terminal 1 – API**

```powershell
dotnet restore
dotnet run --project AbySalto.Mid --launch-profile "API only (Swagger)"
```

**Terminal 2 – Frontend**

```powershell
cd frontend
npm install
npm run dev
```

| What | URL |
|------|-----|
| Storefront | http://localhost:5173 |
| API | http://localhost:5269 |
| Swagger UI | http://localhost:5269/swagger |

The Vite dev server proxies `/api/*` to the API, so no extra CORS setup is needed locally.

---

## 6. Try it out

1. Open http://localhost:5173 and browse/search/filter products (no login needed).
2. **Register** a new account, then log in.
3. Add products to **favorites** and the **cart**, change quantities.
4. Go to **Cart → Checkout** and walk through *Shipping → Payment → Review → Confirmation*.
   - The payment is **simulated** – use any 16-digit card number (e.g. `4242 4242 4242 4242`), a future expiry (`MM/YY`) and any 3-digit CVC.
   - A card number ending in **`0000`** simulates a declined payment.

In Swagger, call `POST /api/auth/login`, copy the `token`, click **Authorize** and enter `Bearer <token>` to test protected endpoints.

---

## 7. Troubleshooting

| Problem | Fix |
|---------|-----|
| `Cannot open database "Abysalto"` / `Invalid object name` | The database or tables are missing – repeat step 3. |
| `A network-related or instance-specific error` | SQL Server/LocalDB is not running (`sqllocaldb start MSSQLLocalDB`) or the connection string is wrong. |
| `npm` not recognized during build | Install Node.js and restart Visual Studio / the terminal. |
| `Port 5173 is already in use` | Stop the other process using it – Vite uses a strict port. |
| Products do not load | The API needs internet access to reach `https://dummyjson.com`. |
| `401 Unauthorized` after restart | The JWT expired (60 min) or `Jwt:Key` changed – log in again. |

---

## 8. Build for production (optional)

```powershell
dotnet publish AbySalto.Mid -c Release -o publish
cd frontend; npm run build   # output in frontend/dist
```

Serve `frontend/dist` from any static host and point it at the published API (add the host to `Cors:AllowedOrigins`).
