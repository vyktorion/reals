# Structură Aplicație Real Estate - Feature Sliced Design (FSD)

src/
├── app/                          # Stratul APP - Rute Next.js + Layout-uri
│   ├── (auth)/                   # Grup rute autentificare
│   │   └── signin/page.tsx       # /signin
│   ├── (user)/                   # Grup rute utilizator
│   │   ├── profile/page.tsx      # /profile
│   │   ├── favorites/page.tsx    # /favorites
│   │   ├── saved-searches/page.tsx # /saved-searches
│   │   └── notifications/page.tsx # /notifications
│   ├── property/                 # Rute proprietăți
│   │   ├── page.tsx              # /property (listă)
│   │   ├── [id]/page.tsx         # /property/[id] (detalii)
│   │   └── [id]/edit/page.tsx    # /property/[id]/edit
│   ├── search/page.tsx           # /search
│   ├── post/page.tsx             # /post (adăugare proprietate)
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── auth/register/route.ts
│   │   └── properties/route.ts
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Stiluri globale
│   └── page.tsx                  # Homepage
│
├── processes/                    # Stratul PROCESSES - Procese transversale
│   └── auth/                     # Proces autentificare globală
│       ├── model/                # Logic + State
│       └── index.ts              # Public API
│
├── pages/                        # Stratul PAGES - Pagini specifice (dacă nu sunt în app/)
│
├── widgets/                      # Stratul WIDGETS - Componente mari, complexe
│   ├── property-card/            # Card proprietate cu subcomponente
│   │   ├── ui/                   # UI specifice widget-ului
│   │   ├── model/                # Logic locală
│   │   └── index.ts              # Public API
│   ├── property-filters/         # Widget filtre căutare
│   ├── map-view/                 # Widget hartă proprietăți
│   └── user-menu/                # Widget meniu utilizator
│
├── features/                     # Stratul FEATURES - Funcționalități independente
│   ├── property-listing/         # Feature: Listare proprietăți
│   │   ├── ui/                   # Componente UI specifice
│   │   ├── model/                # Logic + State (selectors, events, stores)
│   │   │   ├── selectors/        # Selectori pentru state
│   │   │   ├── events/           # Evenimente
│   │   │   └── stores/           # State management
│   │   ├── api/                  # API calls pentru feature
│   │   └── index.ts              # Public API
│   ├── user-profile/             # Feature: Profil utilizator
│   │   ├── ui/
│   │   ├── model/
│   │   ├── api/
│   │   └── index.ts
│   ├── auth/                     # Feature: Autentificare
│   │   ├── ui/
│   │   ├── model/
│   │   ├── api/
│   │   └── index.ts
│   ├── search/                   # Feature: Căutare proprietăți
│   ├── favorites/                # Feature: Favorite
│   └── notifications/            # Feature: Notificări
│
├── entities/                     # Stratul ENTITIES - Entități de business
│   ├── property/                 # Entitate Property
│   │   ├── ui/                   # UI specifice entității
│   │   ├── model/                # Model + operații CRUD
│   │   ├── api/                  # API pentru Property
│   │   └── index.ts              # Public API
│   ├── user/                     # Entitate User
│   │   ├── ui/
│   │   ├── model/
│   │   ├── api/
│   │   └── index.ts
│   └── agent/                    # Entitate Agent
│
├── shared/                       # Stratul SHARED - Cod reutilizabil, fără dependențe business
│   ├── ui/                       # Componente UI de bază (shadcn/ui)
│   │   ├── button/
│   │   ├── input/
│   │   └── ...
│   ├── lib/                      # Utilitare tech (axios, date-fns, etc.)
│   │   ├── api/                  # Client HTTP global
│   │   ├── utils/                # Pure functions
│   │   ├── auth/                 # Server-side auth
│   │   └── db/                   # Database connection
│   ├── config/                   # Config global (env, constants)
│   ├── types/                    # Tipuri TypeScript globale
│   ├── constants/                # Constante globale
│   └── index.ts                  # Export global
│
└── index.ts                      # Export global aplicație (opțional)
