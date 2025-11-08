Plan arhitectural "adds app" (Sale/Rent/Hotel)

Principii cheie:
- 1: Păstrăm UI/UX actual (design, layout, componente) – schimbăm doar arhitectura și sursa de date.
- 2: Introducem un domain clar pentru anunțuri: "adds app" modulară.
- 3: Migrarea se face incremental, fără să stricăm ce există; ștergem fișiere vechi doar după ce nu mai sunt referințe.
- 4: Toate rutele /adds/sale, /adds/rent, /adds/hotel devin entry points oficiale; /sale, /rent, /hotel devin alias/redirect.

Răspuns la întrebările tale:

1) Ce facem cu fișierele folosite acum?
- NU le ștergem imediat.
- Strategie:
  - Pas 1: Copiem/mutăm logica utilă (UI, layout, helpers) în noul domain adds.
  - Pas 2: Actualizăm rutele (/adds/*, /sale/*) să folosească noul domain.
  - Pas 3: Când confirmăm că nu mai există importuri/usage către vechile fișiere:
    - marcăm fișierele vechi ca deprecated (comentariu + eventual folder _legacy).
    - fie le ștergem în mod controlat, fie le păstrăm doar ca referință temporară.
- Obiectiv: la final să rămână:
  - logica business + data access în domains/adds
  - paginile Next foarte subțiri (doar orchestrare)
  - fără duplicări (ex: două SaleDesktop diferite).

2) Scriem tot planul în plan.md pentru tracking
- Acest fișier (plan.md) va fi sursa noastră de adevăr pentru pași și status.
- Îl vom actualiza pe măsură ce implementăm.

3) Important: păstrăm UI/UX design-ul actual
- NU schimbăm vizual:
  - card-uri
  - filtre
  - layout desktop/mobile
  - modul în care arată detaliile.
- Doar:
  - extragem logica în domeniul adds,
  - facem rutele curate,
  - conectăm la DB / servicii reale.
- Dacă modificăm UI, va fi doar tehnic (componente reorganizate), nu vizual.

Plan de implementare detaliat (execuție)

Faza 1: Introducerea domeniului adds (fără schimbări majore în comportament)

1.1. Creează structura domain:
- src/domains/adds/
  - model/
    - types.ts
      - PropertyBase (id, title, price, location, images etc.)
      - SaleProperty, RentProperty, HotelProperty (extinderi specifice)
      - Filters (priceRange, propertyType, status etc.)
    - mappers.ts
      - salePropertyToProperty
      - rentPropertyToProperty
      - hotelPropertyToProperty
  - api/
    - adds.api.ts
      - getSaleList(filters)
      - getSaleById(id)
      - (placeholder pentru rent/hotel)
  - services/
    - sale.service.ts
      - wrap peste adds.api.ts + mappers
    - rent.service.ts
    - hotel.service.ts
    - search.service.ts (cross-type, dacă e nevoie)
  - ui/
    - AddsLayout.tsx       // wrapper comun: header "Anunțuri", container etc.
    - AddsTabs.tsx         // tab-urile Sale/Rent/Hotel (folosite în /adds/[tab])
    - PropertyCard.tsx     // variantă unificată pentru card (poate importa designul actual)
    - PropertyDetails.tsx sau PropertyDetailsEnhanced.tsx (mutat din sale/shared)
    - SaleList.tsx         // lista + filtre pentru sale, folosind serviciile new
    - SaleDesktop.tsx      // layout desktop, dar consumă SaleList
    - SaleMobile.tsx       // layout mobil, dar consumă SaleList
    - (ulterior) RentList.tsx, HotelList.tsx
  - hooks/
    - useAddsList.ts       // listare & filtre (generic)
    - useSaleList.ts       // wrapper pentru sale
    - useSaleDetails.ts
    - useRentList.ts, useHotelList.ts (în fazele următoare)

1.2. Integrare fără a rupe nimic:
- În această fază:
  - SaleDesktop existent este rescris să folosească servicii din domains/adds (nu shared/data mock).
  - PropertyDetailsEnhanced mutat logic în domains/adds/ui, importat de pagini.

Faza 2: /adds ca hub oficial

2.1. Stabilizează rutele:
- /adds/page.tsx:
  - redirect('/adds/sale')
- /adds/[tab]/page.tsx:
  - use client
  - import AddsLayout + AddsTabs din domains/adds/ui
  - value pentru Tabs din param [tab]
  - onValueChange → push('/adds/{tab}')
  - content per tab:
    - sale → <SaleDesktop /> din domains/adds/ui
    - rent → placeholder (viitoarea RentList)
    - hotel → placeholder (viitoarea HotelList)
- UI/UX:
  - Tabs și layout arată ca acum (design păstrat).

Faza 3: /sale migrează complet pe adds domain

3.1. Listare sale:
- /sale poate avea 2 opțiuni:
  - Variantă temporară:
    - folosește direct SaleDesktop din domains/adds/ui (același UI).
  - Variantă finală:
    - redirect permanent la /adds/sale.

3.2. Detalii sale:
- /sale/[id]/page.tsx:
  - nu mai folosește shared/data mock.
  - folosește sale.service.ts din domains/adds/services.
  - randă PropertyDetails din domains/adds/ui.

3.3. Edit/New sale:
- Introducem /adds/sale/new, /adds/sale/edit/[id] folosind servicii din domain adds.
- /sale/add etc pot redirecta către aceste noi rute.

Faza 4: Rent și Hotel pe aceeași arhitectură

4.1. Definim tipuri & servicii:
- În domains/adds/model/types.ts:
  - RentProperty, HotelProperty
- În domains/adds/services/:
  - rent.service.ts, hotel.service.ts

4.2. Integrare în tabs:
- /adds/[tab]/page.tsx:
  - pentru rent: <RentList />
  - pentru hotel: <HotelList />

4.3. Redirect-uri:
- /rent → /adds/rent
- /hotel → /adds/hotel

Faza 5: Curățare fișiere vechi

5.1. După migrarea completă:
- Verifici cu search:
  - cine mai importă vechile:
    - src/app/sale/desktop/SaleDesktop.tsx (vechi),
    - src/app/sale/shared/*,
    - etc.
- Dacă nu mai sunt referințe:
  - marchezi ca deprecated (_legacy) sau le ștergi.
- Important:
  - nu ștergem până nu:
    - toate paginile folosesc domains/adds,
    - redirect-urile sunt setate,
    - UI/UX este identic vizual.

Faza 6: Compatibilitate finală și QA

- /adds/sale, /adds/rent, /adds/hotel:
  - rute principale.
- /sale, /rent, /hotel:
  - devin redirect-uri permanente către /adds/*.
- /properties:
  - redirect către /adds/sale sau eliminat dacă nu mai e folosit.
- Verificări:
  - UI/UX identic (sau mai bun) față de versiunea actuală.
  - SEO ok: pagini distincte, conținut randat server-side sau hibrid corect.
  - Codebase curat: domain adds centralizează logica; paginile sunt subțiri.
