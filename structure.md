src/
├─ app/
│  ├─ listings/  
│  │  │  ├─ ListingsGrid.tsx
│  │  │  ├─ PropertyCard.tsx
│  │  │  └─ PropertyDetails.tsx              
│  │    ├─ page.tsx              ← /listings (listă + filtre)
│  │    └─ [id]/
│  │       └─ page.tsx           ← /listings/:id (detalii proprietate)
│  │              ← layout comun pentru secțiunea listings (opțional)
│  │
│  ├─ (user)/                     ← grup logic user
│  │  ├─ profile/page.tsx         ← /profile
│  │  ├─ favorites/page.tsx       ← /favorites
│  │  ├─ saved-searches/page.tsx  ← /saved-searches
│  │  └─ notifications/page.tsx   ← /notifications
│  │
│  ├─ (auth)/                     ← grup logic pentru auth
│  │  └─ signin/page.tsx          ← /signin
│  │
│  ├─ api/
│  │  └─ auth/
│  │     ├─ [...nextauth]/route.ts
│  │     └─ register/route.ts
│  │
│  ├─ layout.tsx                  ← root layout
│  └─ globals.css
│  └─ page.tsx
│
├─ features/
│  ├─ listings/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  │  └─ useListingsSearch.ts
│  │  └─ services/
│  │     └─ listings.api.ts
│  │
│  ├─ user/
│  ├─ auth/
│  └─ navigation/
│
├─ components/
│  ├─ ui/*
│  └─ common/*
│
├─ shared/
│  ├─ utils/*            ← pure logic, fără framework
│  ├─ constants.ts
│  └─ types/*
│
├─ lib/
│  ├─ db/*               ← acces DB
│  ├─ auth/*             ← server-side auth
│  └─ utils/*            ← utilities legate de Next/React/Server
│
├─ services/
│  └─ api.ts             ← client HTTP global
│
└─ hooks/*               ← hooks generice
