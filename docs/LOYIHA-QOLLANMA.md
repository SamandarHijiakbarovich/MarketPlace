# 📚 MarketPlace MVP — Loyiha qo'llanmasi (suhbatga tayyorgarlik)

Bu hujjat loyihaning **har bir qismini** tushunish uchun. Oxirida **suhbat savollari + javoblar** bor.

---

## 1. Umumiy tasavvur

**MarketPlace** — elektronika do'koni (marketplace). Ikki tomon:
- **Xaridor (buyer):** katalog ko'radi, qidiradi, savatga qo'shadi, buyurtma beradi, to'laydi.
- **Admin:** mahsulot qo'shadi/tahrirlaydi/o'chiradi, buyurtmalarни ko'radi, status o'zgartiradi.

**Texnologiyalar:**
| Qism | Texnologiya |
|---|---|
| Backend | C# / ASP.NET Core 9 (Web API), Clean Architecture |
| Baza | SQLite + Entity Framework Core (ORM) |
| Auth | JWT (admin uchun), BCrypt (parol hash) |
| Frontend | React 19 + Vite + TypeScript |
| State | React Context API |
| HTTP | Axios |
| Deploy | Backend → Render (Docker), Frontend → Vercel |

**Asosiy oqim (PRD talabi):** Katalog → Savat → To'lov → Yetkazib berish → Admin.

---

## 2. Backend arxitekturasi — Clean Architecture

Loyiha **4 ta qatlamga (loyihaga)** bo'lingan. Har biri alohida vazifaga ega. Qoida: **ichki qatlamlar tashqi qatlamlarni bilmaydi.**

```
MarketPlace.API            ← HTTP qatlami (Controllers, Program.cs, Middleware)
   ↓ chaqiradi
MarketPlace.Application     ← Interfeyslar (IProductService...) + DTO'lar + Exceptions
   ↑ implement qiladi
MarketPlace.Infrastructure  ← Servislar (ProductService...), DbContext, Migrations, Seed
   ↓ ishlatadi
MarketPlace.Domain          ← Entity'lar (Product, Order...) + Enum'lar. Hech kimga bog'liq emas.
```

### Nega bunday bo'linadi?
- **Ajratilganlik (separation of concerns):** biznes-mantiq (Application/Infrastructure) HTTP'dan (API) ajratilgan.
- **Almashtiriladigan:** masalan SQLite'ni PostgreSQL'ga almashtirish faqat Infrastructure'ga tegadi — Controller'lar o'zgarmaydi. (Biz aynan shuni qildik: Npgsql → SQLite.)
- **Test qilish oson:** interfeys (IProductService) bo'lgani uchun soxta (mock) implementatsiya berish mumkin.

### Qatlamlar batafsil

**Domain** — sof C# klasslar (POCO), hech qanday kutubxonaga bog'liq emas:
- `Entities/`: `Product`, `Category`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Delivery`, `AdminUser`
- `Enums/`: `OrderStatus` (New/Preparing/Delivered/Cancelled), `PaymentMethod` (Card/CashOnDelivery), `PaymentStatus`, `DeliveryMethod` (Standard/Express)
- `Common/AuditableEntity`: `CreatedAt`, `UpdatedAt` (boshqa entity'lar undan meros oladi)

**Application** — "shartnoma" qatlami:
- `IProductService`, `IOrderService` ... — **interfeyslar** (metod nomlari, lekin kod yo'q)
- `Dtos/` — DTO (Data Transfer Object): API'ga chiqadigan/kiradigan ma'lumot shakli. Entity'ni to'g'ridan chiqarmaymiz.
- `Common/Exceptions/`: `NotFoundException`, `BadRequestException` — biznes xatolari

**Infrastructure** — haqiqiy ish:
- `Services/` — interfeyslarning **implementatsiyasi** (biznes mantiq shu yerda)
- `Persistence/ApplicationDbContext` — EF Core konteksti (baza bilan bog'lanish)
- `Persistence/Configurations/` — har entity'ning bazadagi sozlamasi (Fluent API)
- `Persistence/Migrations/` — baza sxemasi (EF avtomatik yaratadi)
- `Persistence/Seed/DbSeeder` — boshlang'ich ma'lumot (10 mahsulot, admin)

**API** — kirish nuqtasi:
- `Controllers/` — HTTP endpoint'lar
- `Program.cs` — hamma narsani ulaydi (DI, JWT, CORS, Swagger, migration)
- `Middleware/ExceptionHandlingMiddleware` — xatolarni tutib, to'g'ri HTTP status qaytaradi

---

## 3. Bitta so'rov qanday ishlaydi? (request lifecycle)

Misol: xaridor mahsulotlar ro'yxatini so'raydi — `GET /api/products`

```
Brauzer
  → ProductsController.GetProducts()        [API qatlami: faqat HTTP]
     → _productService.GetProductsAsync()    [interfeys orqali chaqiradi]
        → ProductService (Infrastructure)    [biznes mantiq: filtr, saralash]
           → _db.Products (EF Core)          [SQL so'rovga aylanadi]
              → SQLite bazasi                 [ma'lumot qaytaradi]
        ← PagedResult<ProductListItemDto>     [DTO'ga aylantiriladi]
  ← JSON javob (200 OK)
```

**Muhim nuqta:** Controller **biznes mantiqni bilmaydi** — u faqat servisni chaqirib, natijani qaytaradi. Butun aql — servisda.

---

## 4. Backend servislar — har biri nima qiladi

### 4.1 `ProductService` (namuna servis)
Mahsulotlar CRUD + katalog. Eng muhim metod — `GetProductsAsync`:
1. `IQueryable` bilan boshlanadi (hali SQL ketmaydi — "kechiktirilgan bajarilish").
2. Filtr: qidiruv (`Name.Contains`), kategoriya (`CategoryId`).
3. Saralash: narx yoki nom bo'yicha.
4. Sahifalash: `Skip`/`Take`.
5. `.Select(p => new ProductListItemDto(...))` — **Entity emas, DTO qaytaradi** (proyeksiya).
6. Topilmasa `NotFoundException` — Controller buni 404'ga aylantiradi.

> **Nega DTO?** Entity bazaga bog'liq (navigatsiya, maxfiy maydonlar). DTO — faqat kerakli, xavfsiz ma'lumot. Bu — "API kontrakti".

### 4.2 `CategoryService`
Oddiy: barcha kategoriyalarni `CategoryDto` ro'yxati sifatida qaytaradi (`.Select(...).ToListAsync()`).

### 4.3 `CartService`
Savat **login qilmasdan** ishlaydi — `X-Cart-Id` (GUID) header orqali aniqlanadi.
- Birinchi mahsulot qo'shilganda cartId bo'lmaydi → backend **yangi savat yaratadi** va uning ID'sini qaytaradi.
- Frontend bu ID'ni `localStorage`ga saqlab, keyingi so'rovlarda header sifatida yuboradi.
- `AddItem` / `UpdateItem` / `RemoveItem` / `GetCart`.

### 4.4 `OrderService` — **eng muhim (checkout orkestratsiyasi)**
`CheckoutAsync` — butun zanjirni birlashtiradi:
1. Savatni oladi (mahsulotlari bilan), bo'sh emasligini tekshiradi.
2. Manzil to'ldirilganini tekshiradi.
3. **Stockni qayta tekshiradi** (boshqa xaridor sotib olgan bo'lishi mumkin).
4. Summani hisoblaydi: `subtotal + deliveryCost`.
5. **To'lovni** `IPaymentService` orqali amalga oshiradi.
6. **To'lov muvaffaqiyatsiz bo'lsa** → `BadRequestException` (400), order **saqlanmaydi**, savat **bo'shatilmaydi** (qayta urinish mumkin).
7. Muvaffaqiyatli bo'lsa: `Order` + `OrderItem` + `Delivery` yozadi, **stockni kamaytiradi**, savatni **tozalaydi**.
8. Unikal `OrderNumber` beradi (masalan `ORD-20260705-DFF6A7`).

> Bu — **transaction-ga o'xshash butunlik**: yo hammasi bo'ladi, yo hech nima. To'lov o'tmasa hech narsa o'zgarmaydi.

### 4.5 `DeliveryPricingService`
Bazaga tegmaydi — oddiy `switch`:
- Standard → 25 000 so'm, ETA = bugun + 3 kun
- Express → 50 000 so'm, ETA = bugun + 1 kun

### 4.6 `MockPaymentService` (to'lov imitatsiyasi)
Haqiqiy pul o'tkazmaydi (sandbox):
- `CashOnDelivery` → doim muvaffaqiyatli
- `Card` → karta 16 xonali bo'lmasa yoki **"4000..." bilan boshlansa → rad etiladi** (test uchun), aks holda muvaffaqiyatli.

### 4.7 `AuthService` (admin login)
1. Email bo'yicha adminni topadi.
2. **BCrypt** bilan parolni tekshiradi (`BCrypt.Verify`). Parol bazada **hash** qilib saqlanadi — ochiq matn emas.
3. To'g'ri bo'lsa **JWT token** yaratadi. Token ichida "claims" bor: `sub` (id), `email`, `role=Admin`, muddat (`exp`).
4. Token frontendда saqlanadi va har himoyalangan so'rovда `Authorization: Bearer <token>` sifatida yuboriladi.

### 4.8 `AdminDashboardService`
Statistika: `CountAsync` (buyurtmalar/mahsulotlar soni), `SumAsync` (Success to'lovlar summasi = umumiy savdo).

---

## 5. Backend muhim tushunchalar (suhbat uchun!)

- **Dependency Injection (DI):** Servislar `Program.cs` → `DependencyInjection.cs`da ro'yxatga olinadi (`AddScoped<IProductService, ProductService>()`). Controller konstruktorда interfeys so'raydi, ASP.NET avtomatik beradi. Foydasi: bog'liqlik kamayadi, test oson.
- **`Scoped` umr:** har HTTP so'rov uchun bitta nusxa (DbContext ham Scoped).
- **Entity Framework Core (ORM):** C# obyektlarini SQL'ga o'giradi. `_db.Products.Where(...)` → `SELECT ... WHERE`.
- **Migration:** baza sxemasi (jadvallar) kod orqali. `dotnet ef migrations add` → SQL yaratadi. Ilova ishga tushganда `db.Database.MigrateAsync()` uni qo'llaydi.
- **`async/await`:** baza so'rovlari asinxron — thread bloklanmaydi, server ko'p so'rovni ko'taradi.
- **DTO vs Entity:** Entity = baza modeli; DTO = API modeli. Aralashtirmaymiz.
- **`record` (C#):** o'zgarmas (immutable) ma'lumot konteyneri — DTO'lar uchun ideal.
- **JWT:** stateless auth — server sessiya saqlamaydi, token ichида hamma narsa bor, imzo (secret) bilan tasdiqlanadi.
- **CORS:** brauzer boshqa domendan (Vercel) API'ga (Render) so'rovni faqat backend ruxsat bersa yuboradi. Biz `FRONTEND_URL` orqali ruxsat berdik.
- **Middleware:** so'rov quvuri (pipeline). `ExceptionHandlingMiddleware` — biznes xatolarni (NotFound→404, BadRequest→400) toza JSON'ga aylantiradi.

---

## 6. Frontend tuzilishi

```
src/
├─ api/            ← backend bilan gaplashish (axios)
│  ├─ client.ts    ← axios sozlamasi + interceptor (header'lar)
│  ├─ products.ts, categories.ts, cart.ts, orders.ts, auth.ts, delivery.ts, admin.ts
├─ context/        ← global holat (state)
│  ├─ DataContext  ← mahsulot/kategoriya (API'dan) + admin CRUD
│  ├─ CartContext  ← savat (backend, X-Cart-Id)
│  ├─ AuthContext  ← admin login (JWT) + xaridor (lokal mock)
│  ├─ ToastContext ← pastdagi xabar ("Savatga qo'shildi")
│  ├─ SearchContext← qidiruv/filtr/saralash holati
├─ lib/
│  ├─ mappers.ts   ← backend shakli ↔ UI shakli o'girish
│  ├─ format.ts    ← narx/sana formati
│  ├─ ui.ts        ← ranglar, status badge, kategoriya rangi
├─ types/          ← TypeScript tiplar (API va UI shakllari)
├─ pages/          ← sahifalar (Home, ProductDetail, Cart, Checkout...)
├─ components/     ← qayta ishlatiluvchi bo'laklar (Header, ProductCard, AuthModal...)
├─ router.tsx      ← manzil → sahifa xaritasi (react-router)
└─ main.tsx        ← ilova kirish nuqtasi (provayderlar shu yerda ulanadi)
```

### 6.1 API qatlami — `client.ts` (eng muhim)
```ts
const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL });
apiClient.interceptors.request.use(config => {
  // Har so'rovga avtomatik qo'shiladi:
  config.headers['X-Cart-Id'] = localStorage.getItem('cartId');    // savat
  config.headers.Authorization = `Bearer ${localStorage.adminToken}`; // admin token
});
```
**Interceptor** = har so'rovdan oldin ishlaydigan "ushlagich". Shuning uchun har chaqiruvda header'ni qo'lda yozmaymiz.

### 6.2 Context (global holat) — nega kerak?
React'да ma'lumot yuqoridan pastga (props) uzatiladi. Lekin savat/token'ni **butun ilova** ko'rishi kerak. Context — "global qutича". `useCart()`, `useData()`, `useAuth()` — istalgan komponentдан olinadi.

- **DataContext:** ochilganда `productsApi.getAll()` + `categoriesApi.getAll()` chaqiradi. Admin CRUD (`createProduct`...) API'ga boradi, keyin ro'yxatни yangilaydi.
- **CartContext:** `cartApi` orqali backend savati. `addToCart`, `changeQty`, `removeFromCart`.
- **AuthContext:** admin `authApi.login()` (JWT), xaridor esa **lokal mock** (backend'да buyer auth yo'q — PRD'да bonus).

### 6.3 Mapperlar — `mappers.ts` (nozik joy!)
Backend va UI ma'lumotni **boshqacha nomlaydi**. Mapper — tarjimon:
- `toProduct()`: backend `{categoryName}` → UI `{cat, categoryId, categoryName}` (rang uchun).
- `toOrder()`: backend inglizcha status `New` → o'zbekcha `yangi`; `orderNumber` → ko'rsatiladigan id.
- `statusEnToUz` / `statusUzToEn`: status ikki tomonlama.

> **Nega?** UI dizayni o'zbekcha status va rangli kategoriyani kutadi; backend — inglizcha va id. Mapper ikkalasini bog'laydi, UI kodini o'zgartirmasdan.

### 6.4 Marshrutlash (routing) — `react-router`
- `/` → HomePage, `/products/:id` → detal, `/cart`, `/checkout`, `/order-success`, `/order-fail`
- `/admin/login`, `/admin/dashboard`, `/admin/products`, `/admin/orders`
- **`ProtectedRoute`:** admin sahifalar — token bo'lmasa `/admin/login`ga qaytaradi.

---

## 7. Frontend muhim tushunchalar (suhbat uchun!)

- **Komponent:** UI bo'lagi (funksiya, JSX qaytaradi).
- **State (`useState`):** komponent ichidagi o'zgaruvchan ma'lumot; o'zgarsa qayta chiziladi (re-render).
- **`useEffect`:** yon ta'sirlar (API chaqirish, sahifa ochilganда). `[]` — faqat bir marta.
- **Context API:** global state (props "drilling"siz).
- **Controlled input:** input qiymati state'да (`value={x} onChange={...}`).
- **Conditional rendering:** `{loading && <Spinner/>}`, `{items.length === 0 ? <Empty/> : <List/>}`.
- **TypeScript:** tiplar (interface) — xatoni yozayotganда tutadi (`Product`, `Order`).
- **SPA (Single Page Application):** bitta HTML, JS marshrutni boshqaradi. Shuning uchun Vercel'да `rewrites` kerak (yangilaganда 404 bo'lmasligi uchun).
- **`import.meta.env.VITE_API_URL`:** muhit o'zgaruvchisi (lokalда localhost, Vercel'да Render URL).

---

## 8. To'liq oqim — qaysi fayllar ishtirok etadi

**Xaridor buyurtma beradi:**
1. `HomePage` → `DataContext` → `productsApi.getAll` → **backend** `ProductsController` → `ProductService`
2. `ProductCard` "Savatga qo'shish" → `CartContext.addToCart` → `cartApi.addItem` → `CartController` → `CartService` (yangi savat + `X-Cart-Id`)
3. `CartPage` → savatni ko'rsatadi (`cart.items`)
4. `CheckoutPage` → forma → `ordersApi.checkout` → `OrdersController` → **`OrderService.CheckoutAsync`** (stock, `MockPaymentService`, `DeliveryPricingService`, Order yaratish)
5. Muvaffaqiyat → `OrderSuccessPage` (order raqami). Xato (4000 karta) → `OrderFailPage`.

**Admin boshqaradi:**
1. `AdminLoginPage` → `AuthContext.adminLogin` → `authApi.login` → `AuthController` → `AuthService` (BCrypt + JWT)
2. `AdminDashboardPage` → `adminDashboardApi.getStats` (himoyalangan, token bilan)
3. `AdminProductsPage` → CRUD → `adminProductsApi` → `AdminProductsController` (`[Authorize]`)
4. `AdminOrdersPage` → ro'yxat + status o'zgartirish → `adminOrdersApi`

---

## 9. Deploy (qanday internetda ishlayapti)

- **Backend → Render:** `Dockerfile` bilan (multi-stage: SDK quradi → yengil runtime ishlatadi). Render `PORT` env beradi, HTTPS'ni o'zi hal qiladi. SQLite fayl **vaqtинча** (server qayta ishga tushса seed qайта yoziladi).
- **Frontend → Vercel:** `npm run build` → statik fayllar (`dist`). `VITE_API_URL` env = Render URL. `vercel.json` SPA marshrutlash uchun.
- **CORS:** backend'да `FRONTEND_URL` env = Vercel manzili → brauzer so'rovlariga ruxsat.
- **Avtomatik deploy:** `git push` → Render va Vercel avtomatik yangilaydi.

---

## 10. 🎤 Suhbat savollari + javoblar

**S: Clean Architecture nima, nega ishlatding?**
J: Kodni qatlamlarga (Domain/Application/Infrastructure/API) ajratish. Biznes-mantiqni HTTP va bazadan ajratadi. Foydasi: bazani almashtirish oson (men Postgres→SQLite qildim, faqat Infrastructure o'zgardi), test oson, kod tartibli.

**S: DTO nima uchun kerak, Entity'ni to'g'ridan qaytarsa bo'lmaydimi?**
J: Entity baza modeli — navigatsiya xossalari, maxfiy maydonlar (masalan parol hash) bor. DTO faqat kerakli, xavfsiz ma'lumotni beradi. Bu — barqaror API kontrakti; Entity o'zgarsa API buzilmaydi.

**S: Dependency Injection qanday ishlaydi?**
J: Servislar `Program.cs`da interfeys→klass bilan ro'yxatga olinadi. Controller konstruktorда interfeysni so'raydi, ASP.NET nusxani avtomatik "in'ektsiya" qiladi. Natijada komponentlar bir-biriga qattiq bog'lanmaydi.

**S: JWT qanday ishlaydi? Sessiyadan farqi?**
J: Login'да server imzolangan token beradi (ichida user id, role, muddat). Klient uni har so'rovда yuboradi, server imzoni tekshiradi. Sessiyadan farqi — **stateless**: server hech narsa saqlamaydi, shuning uchun masshtablash oson.

**S: Parolni qanday saqlaysan?**
J: Hech qachon ochiq matnда emas. **BCrypt** bilan hash qilib saqlayman (bir tomonlama, "salt" bilan). Tekshirganда `BCrypt.Verify(kiritilgan, hash)`.

**S: Checkout'да to'lov o'tmasa nima bo'ladi?**
J: `OrderService`da to'lov muvaffaqiyatsiz bo'lsa `BadRequestException` tashlanadi — buyurtma **saqlanmaydi**, stock kamaymaydi, savat bo'shatilmaydi. Foydalanuvchi qayta urina oladi. Ya'ni butunlik saqlanadi.

**S: CORS nima?**
J: Brauzer xavfsizlik qoidasi — bir domendan (Vercel) boshqa domenga (Render) so'rovni faqat server ruxsat bersa yuboradi. Backend'да ruxsat etilgan originlarni belgilayman (`FRONTEND_URL`).

**S: SQLite'ni nega tanladingiz, kamchiligi?**
J: Server o'rnatish shart emas — fayl asosida, deploy oson, MVP uchun ideal. Kamchiligi: bir vaqtда ko'p yozuvга (concurrency) va katta yuklamага mos emas; Render bepul diskда doimiy emas. Production'да Postgres'ga o'tish mumkin (arxitektura buni oson qiladi).

**S: Frontend'да state'ni qanday boshqarasan?**
J: React Context API bilan. Savat, admin token, mahsulotlar — global context'larда. Har komponent `useCart()`, `useAuth()` orqali oladi. Bu Redux'siz, MVP uchun yetarli.

**S: Backend va frontend shakli har xil bo'lsa nima qilding?**
J: `mappers.ts` — o'girgich qatlami yozdim. Backend inglizcha status/kategoriya id beradi, UI o'zbekcha status/rang kutadi. Mapper ikkalasini bog'laydi, UI kodini o'zgartirmasdan.

**S: `async/await` nega kerak?**
J: Baza va tarmoq so'rovlari sekin. `await` bilan thread bloklanmaydi — server o'sha vaqtда boshqa so'rovlarni ko'taradi. Bu — masshtablash uchun muhim.

**S: AI'dan qanday foydalandingiz?** (PRD savoli — 10 ball)
J: Claude bilan: arxitekturani rejalashtirish, boilerplate (DTO/controller) tez yozish, dizaynni React'ga aylantirish, bug topish (masalan checkout redirect race), deploy sozlash. Har bir kodni tushunib, tekshirib qo'shdim — ko'r-ko'rona emas.

---

## 11. Demo ma'lumotlari
- **Sayt:** https://market-place-xi-neon.vercel.app
- **API/Swagger:** https://marketplace-ckqi.onrender.com/swagger
- **Admin:** `admin@marketplace.uz` / `Admin123!`
- **Test to'lov rad etish:** karta `4000 0000 0000 0000`
- Backend ~50s "uyg'onadi" (bepul tarif), keyin tez.
