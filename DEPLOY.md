# 🚀 Deploy yo'riqnomasi — MarketPlace MVP

Bepul deploy: **Frontend → Vercel**, **Backend → Render** (Docker). Baza — SQLite (tashqi baza kerak emas).

> ⚠️ Bilish kerak:
> - Render bepul backend **15 daqiqa harakatsizlikdan keyin uxlaydi** → birinchi so'rov ~50s sekin (keyin tez).
> - Render bepul diskда SQLite **doimiy emas** — server qayta ishga tushsa baza tozalanadi va seed qayta yoziladi (demo uchun normal).

---

## 0. Loyihani GitHub'ga yuklash

Terminalда loyiha ildizida (`D:\TRK_Backend_MarketPlays`):

```bash
git add .
git commit -m "MarketPlace MVP: full-stack, deploy-ready"
```

Keyin GitHub'da yangi **bo'sh** repozitoriya yarating (masalan `marketplace-mvp`), so'ng:

```bash
git remote add origin https://github.com/<FOYDALANUVCHI>/<REPO>.git
git branch -M main
git push -u origin main
```

---

## 1. Backend → Render

1. https://render.com ga kiring (GitHub bilan).
2. **New +** → **Web Service** → GitHub repongizni ulang/tanlang.
3. Sozlamalar:
   - **Root Directory:** `backend`
   - **Runtime / Language:** `Docker` (Dockerfile avtomatik topiladi: `backend/Dockerfile`)
   - **Instance Type:** `Free`
   - **Branch:** `main`
4. **Create Web Service** — birinchi build ~3-5 daqiqa.
5. Tayyor bo'lgach URL beriladi, masalan: `https://marketplace-api-xxxx.onrender.com`
   - Tekshirish: shu URL'ni brauzerda ochsangiz — Swagger ochiladi (`/swagger`ga yo'naltiradi).

> Bazani boshlang'ich to'ldirish (seed) va migration dastur ishga tushganda avtomatik bajariladi.
> Admin: **admin@marketplace.uz** / **Admin123!**

---

## 2. Frontend → Vercel

1. https://vercel.com ga kiring (GitHub bilan).
2. **Add New** → **Project** → repongizni **Import** qiling.
3. Sozlamalar:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite` (avtomatik aniqlanadi)
   - Build/Output default qoldiring (`npm run build` → `dist`)
4. **Environment Variables** bo'limiga qo'shing:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://<RENDER-BACKEND-URL>/api`
     (masalan `https://marketplace-api-xxxx.onrender.com/api` — **`/api` bilan tugashi shart**)
5. **Deploy** — ~1-2 daqiqa. URL beriladi, masalan: `https://marketplace-mvp.vercel.app`

---

## 3. Backend'da CORS'ni frontendga ochish

Frontend URL'ini backend bilishi kerak (aks holda brauzer CORS xatosi beradi).

1. Render → backend service → **Environment** bo'limi.
2. Yangi env qo'shing:
   - **Key:** `FRONTEND_URL`
   - **Value:** `https://marketplace-mvp.vercel.app` (Vercel URL'ingiz, oxirида `/` yo'q)
   - (bir nechta bo'lsa vergul bilan: `https://a.vercel.app,https://b.vercel.app`)
3. **Save** — backend avtomatik qayta deploy bo'ladi.

---

## 4. Sinash

1. Vercel URL'ini oching → katalog backend'dan yuklanadi (birinchi marta backend uyg'onishi ~50s).
2. Mahsulot → savat → checkout → buyurtma → success.
3. `/admin/login` → `admin@marketplace.uz` / `Admin123!` → dashboard, mahsulotlar, buyurtmalar.
4. Test to'lov rad etish: karta raqami **4000...** bilan boshlansa — to'lov rad etiladi.

---

## Keyinchalik kodni yangilaganда

`git push` qilsangiz — Render ham, Vercel ham **avtomatik** qayta deploy qiladi. Qo'shimcha ish yo'q.

## Muammolar (troubleshooting)

- **Katalog bo'sh / "yuklanmadi":** backend hali uyg'onmagan (~50s kuting) yoki `VITE_API_URL` noto'g'ri (oxirida `/api` bormi?).
- **CORS xatosi (console):** Render'да `FRONTEND_URL` to'g'ri qo'yilganmi, backend qayta deploy bo'ldimi?
- **Render build xato:** Root Directory `backend` ekanini va Runtime `Docker` ekanini tekshiring.
- **Sahifani yangilaganда 404 (Vercel):** `frontend/vercel.json` commit qilinganini tekshiring (SPA rewrite).
