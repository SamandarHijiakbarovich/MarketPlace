# Roadmap — kim nima yozadi

Bu loyihada arxitektura, ma'lumotlar modeli va bir nechta "qiyin"/infratuzilma qismlari
tayyor holda beriladi; qolgan qism siz tomondan, quyidagi naqshlarga (pattern) qarab yoziladi.
Har bir TODO fayl ichida qaysi namunaga qarash kerakligi ko'rsatilgan.

## ✅ Tayyor (AI tomonidan yozilgan)

**Arxitektura va infratuzilma:**
- Barcha Domain entity'lar (`backend/src/MarketPlace.Domain/Entities`)
- Barcha Application DTO/interfeys shartnomalari (`backend/src/MarketPlace.Application`)
- EF Core DbContext, konfiguratsiyalar, migratsiya, seed data (`Infrastructure/Persistence`)
- DI wiring, JWT/CORS/Swagger sozlamalari (`Program.cs`, `DependencyInjection.cs`)
- Exception handling middleware

**To'liq ishlaydigan "namuna" (reference) vertikal kesim:**
- Backend: `ProductService.cs`, `ProductsController.cs`, `Admin/AdminProductsController.cs`
- Backend: `AuthService.cs` (JWT yaratish — sof infra, business-logika emas)
- Backend: `CartService.cs`, `OrderService.cs` (checkout orkestratsiyasi — eng murakkab qism)
- Frontend: `pages/HomePage.tsx`, `components/product/ProductCard.tsx`, `api/products.ts`
- Frontend: `context/CartContext.tsx`, `context/AuthContext.tsx`, `router.tsx`, `App.tsx`

## ✏️ Siz yozasiz (TODO)

### 1-kun: Backend — oddiy servislar va controller'lar

| Fayl | Nima qilish kerak |
|---|---|
| `Infrastructure/Services/CategoryService.cs` | `_db.Categories`dan `CategoryDto` ro'yxatini qaytarish |
| `Infrastructure/Services/DeliveryPricingService.cs` | Standard/Express uchun narx va ETA (switch) |
| `Infrastructure/Services/MockPaymentService.cs` | To'lovni simulyatsiya qilish (Success/Failed) |
| `Infrastructure/Services/AdminDashboardService.cs` | Oddiy statistika (Count/Sum so'rovlari) |
| `API/Controllers/CategoriesController.cs` | GET endpoint |
| `API/Controllers/CartController.cs` | 4 ta endpoint (GET/POST/PUT/DELETE) |
| `API/Controllers/OrdersController.cs` | POST checkout, GET by id |
| `API/Controllers/DeliveryController.cs` | GET options |
| `API/Controllers/AuthController.cs` | POST login |
| `API/Controllers/Admin/AdminOrdersController.cs` | GET ro'yxat, GET by id, PUT status |
| `API/Controllers/Admin/AdminDashboardController.cs` | GET stats |

Namuna sifatida har doim `ProductsController.cs` / `AdminProductsController.cs` /
`ProductService.cs` fayllariga qarang — struktura bir xil.

### 2-kun: Frontend — sahifalar

| Fayl | Nima qilish kerak |
|---|---|
| `api/categories.ts`, `api/cart.ts`, `api/orders.ts`, `api/delivery.ts`, `api/auth.ts`, `api/admin.ts` | Backend endpoint'lariga mos axios chaqiruvlari |
| `pages/ProductDetailPage.tsx` | Mahsulot tafsilotlari + "Savatga qo'shish" |
| `pages/CartPage.tsx` | Savat ro'yxati, miqdor o'zgartirish, o'chirish |
| `pages/CheckoutPage.tsx` | Yetkazib berish + to'lov formasi, checkout chaqiruvi |
| `pages/OrderSuccessPage.tsx` | Buyurtma tasdig'i |
| `pages/admin/AdminLoginPage.tsx` | Login forma |
| `pages/admin/AdminProductsPage.tsx` | Admin mahsulot CRUD |
| `pages/admin/AdminOrdersPage.tsx` | Buyurtmalar ro'yxati + status o'zgartirish |
| `pages/admin/AdminDashboardPage.tsx` | Statistika kartalari |

Namuna: `pages/HomePage.tsx` (useState + useEffect + loading holati naqshi) va
`api/products.ts` (axios chaqiruv naqshi).

### 3-kun

- Barcha oqimni qo'lda sinab ko'rish (katalog → savat → checkout → admin)
- Dizaynni sayqallash (`index.css`)
- Deploy (masalan: backend — Railway/Render, frontend — Vercel/Netlify)
- README'ni yakunlash, demo havola qo'shish
- `docs/AI-USAGE.md`ni to'ldirish
