# MarketPlace MVP — Elektronika do'koni

Backend assessment topshirig'i uchun marketplace MVP: katalog → savat → to'lov (mock) → yetkazib berish → admin panel.

## Tech stack

| Qatlam | Texnologiya |
|---|---|
| Backend | ASP.NET Core 9 (Clean Architecture: Domain / Application / Infrastructure / API) |
| Database | PostgreSQL + Entity Framework Core |
| Auth | JWT (admin uchun) |
| Frontend | React + Vite + TypeScript |
| To'lov | Mock/sandbox (haqiqiy pul o'tkazmasdan) |

## Loyiha strukturasi

```
backend/
  MarketPlace.sln
  src/
    MarketPlace.Domain/          # Entity'lar, enum'lar — tashqi bog'liqliksiz
    MarketPlace.Application/     # DTO'lar va servis interfeyslari (business shartnoma)
    MarketPlace.Infrastructure/  # EF Core, DbContext, servis implementatsiyalari
    MarketPlace.API/             # Controller'lar, Program.cs, middleware
frontend/
  src/
    api/          # Backendga so'rovlar (axios)
    types/        # TypeScript interfeyslari (backend DTO'lariga mos)
    context/      # CartContext, AuthContext
    components/   # Qayta ishlatiluvchi UI qismlari
    pages/        # Sahifalar (xaridor + admin)
docs/
  ROADMAP.md      # Kim nima yozishi kerak — batafsil reja
  AI-USAGE.md     # AI vositalaridan qanday foydalanilgani
```

## Ishga tushirish

### Talablar
- .NET 9 SDK
- Node.js 18+
- PostgreSQL (local yoki Docker)

### 1. Backend

```bash
cd backend

# PostgreSQL'da "marketplace" nomli bo'sh baza yarating (yoki appsettings.json'dagi
# ConnectionStrings:DefaultConnection'ni o'z sozlamalaringizga moslang)

dotnet ef database update --project src/MarketPlace.Infrastructure --startup-project src/MarketPlace.API

dotnet run --project src/MarketPlace.API
```

API `http://localhost:5148` manzilida ishga tushadi, Swagger: `http://localhost:5148/swagger`.

Birinchi ishga tushishda baza avtomatik seed qilinadi (elektronika mahsulotlari + admin foydalanuvchi):

```
Email:  admin@marketplace.uz
Parol:  Admin123!
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:5173` manzilida ochiladi. `.env` faylida `VITE_API_URL` backend manzilini ko'rsatadi.

## Loyiha holati

Bu loyiha AI (Claude) yordamida bosqichma-bosqich quriladi: arxitektura, ma'lumotlar modeli va
bir nechta "namuna" (reference) fayl allaqachon tayyor; qolgan qism `TODO` izohlari bilan
belgilangan va o'rganish maqsadida qo'lda yoziladi.

- Nima tayyor va nima yozilishi kerakligi: [docs/ROADMAP.md](docs/ROADMAP.md)
- AI qanday ishlatilgani: [docs/AI-USAGE.md](docs/AI-USAGE.md)
