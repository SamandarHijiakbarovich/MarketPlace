# AI vositalaridan foydalanish

## Qaysi vosita

Claude Code (Anthropic) — loyihaning boshidan oxirigacha AI-juftlashgan dasturlash (pair programming) rejimida ishlatildi.

## Qanday ishlatildi

1. **Talabni tahlil qilish** — berilgan PRD (topshiriq) hujjati AI'ga o'qitildi, undan kelib
   chiqib texnologik stack, arxitektura uslubi (Clean Architecture) va marketplace yo'nalishi
   (elektronika do'koni) birgalikda tanlandi.
2. **Skeleton generatsiyasi** — AI butun loyiha strukturasini (backend: Domain/Application/
   Infrastructure/API 4 ta loyiha, frontend: React+Vite+TS) qo'lda buyruqlar orqali (dotnet new,
   npm create vite) yaratdi, NuGet/npm paketlarini o'rnatdi.
3. **Ma'lumotlar modeli va shartnomalar** — barcha Domain entity'lar va Application qatlamidagi
   DTO/interfeyslar AI tomonidan PRD'dagi "Ma'lumotlar modeli" bo'limiga asoslanib yozildi.
4. **Ish taqsimoti** — murakkab/infratuzilma qismlari (EF Core konfiguratsiyasi, JWT
   autentifikatsiya, checkout orkestratsiyasi) AI tomonidan to'liq yozildi; oddiyroq
   business-logika (kategoriyalar, yetkazib berish narxi, to'lov simulyatsiyasi, admin
   statistikasi va barcha controller/sahifalar) o'quv maqsadida inson tomonidan, AI qoldirgan
   TODO izohlari va bitta to'liq "namuna" (ProductService/ProductsController/HomePage) asosida
   yozildi.
5. **Tekshiruv** — har bosqichda `dotnet build` va `tsc -b` bilan kompilyatsiya, so'ng frontend
   brauzerda ishga tushirilib tekshirildi (backend hali ulanmagan holatda ham ilova qulamasligi
   tasdiqlandi).

## Nima uchun bu yondashuv tanlandi

3 kunlik muddatda to'liq stack (backend + frontend + DB) qurish vaqt talab qiladigan
"boilerplate" (loyiha skeleton, DI wiring, JWT sozlash) qismlarni tezlashtirish, shu bilan
birga business-logikani (savat, checkout, admin CRUD) o'zi yozib, texnologiyani chuqur
tushunish uchun imkon berish maqsadida tanlandi.

---
_Bu fayl loyiha davomida to'ldirilishi kerak — qaysi promptlar ishlatilgani, qaysi joylarda
AI natijasi qo'lda tuzatilgani haqida qisqa misollar qo'shing._
