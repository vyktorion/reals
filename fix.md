# Probleme identificate în proiect (Next.js 15)

(Notă: DOAR analiză statică. Niciun fișier sursă nu a fost modificat. Lista este sortată High > Medium > Low, iar în interior după impact: build/runtime > fluxuri critice > calitate cod.)

---

## High

1. [High] [Duplicat / Arhitectură] Dublare componentă critică `MapView`
- Locație:
  - [`src/components/map/MapView.tsx`](src/components/map/MapView.tsx:1)
  - [`src/features/property-listing/components/MapView.tsx`](src/features/property-listing/components/MapView.tsx:1)
- Descriere:
  - Două implementări aproape identice ale `MapView` coexistă în zone diferite ale proiectului (`components` vs `features`), ambele folosind aceeași semnătură și același concept de UI/UX.
  - Versiunea din `features/property-listing` introduce stiluri dedicate (`MapView.css`) și ușoare variații de accesibilitate, ceea ce poate conduce la:
    - comportament divergent între pagini care cred că folosesc același `MapView`,
    - confuzie pentru dezvoltatori asupra sursei "canonice",
    - risc ridicat de bug-uri la refactorizare (se modifică una dintre ele și rămâne cealaltă neschimbată).
- Recomandare:
  - Alege o singură implementare canonică:
    - fie consolidează logica în `src/features/property-listing/components/MapView.tsx` și exportă-o printr-un barrel (`index`),
    - fie mută implementarea comună într-un modul `src/components/map/MapView.tsx` și consumă-l din features.
  - Elimină sau marchează explicit drept legacy varianta nefolosită.
  - Adaugă importuri consistente în toate rutele relevante pentru a evita folosirea accidentală a versiunii greșite.

2. [High] [Duplicat / Arhitectură] Dublare `LayoutContent` (shell de aplicație) cu conținut identic
- Locație:
  - [`src/components/LayoutContent.tsx`](src/components/LayoutContent.tsx:1)
  - [`src/components/layout/LayoutContent.tsx`](src/components/layout/LayoutContent.tsx:1)
  - Referință consumator: [`src/app/client-layout.tsx`](src/app/client-layout.tsx:3)
- Descriere:
  - Aceeași implementare `LayoutContent` este definită în două fișiere distincte cu paths diferite (`components` vs `components/layout`), cu același cod (inclusiv logica de rutare și integrarea `Navigation`/`MobileNavigation`).
  - Acest lucru introduce risc major:
    - un consumator poate importa accidental varianta greșită,
    - un refactor viitor poate actualiza doar una dintre copii, ducând la inconsistențe vizibile în layout sau navigație.
- Recomandare:
  - Stabilește un singur punct de adevăr:
    - păstrează `LayoutContent` doar într-un singur fișier (ex: `src/components/layout/LayoutContent.tsx`) și exportă-l centralizat,
    - actualizează toate importurile să folosească aceeași cale.
  - Elimină duplicatul sau marchează-l clar ca deprecated într-un director `legacy/`.

3. [High] [Duplicat / Suprascriere / Arhitectură] Dublare `ThemeProvider` și `ThemeToggle`
- Locație:
  - `ThemeProvider`:
    - [`src/components/ThemeProvider.tsx`](src/components/ThemeProvider.tsx:1)
    - [`src/components/layout/ThemeProvider.tsx`](src/components/layout/ThemeProvider.tsx:1)
    - Provider alternativ: [`src/contexts/ThemeContext.tsx`](src/contexts/ThemeContext.tsx:43)
  - `ThemeToggle`:
    - [`src/components/ThemeToggle.tsx`](src/components/ThemeToggle.tsx:8)
    - [`src/components/layout/ThemeToggle.tsx`](src/components/layout/ThemeToggle.tsx:8)
- Descriere:
  - Există implementări paralele pentru `ThemeProvider` și `ThemeToggle`, plus un `ThemeContext` custom:
    - unele folosesc `next-themes`, altele propriul context.
  - Risc ridicat de:
    - componentă randată sub provider greșit (theme nedisponibil),
    - comportamente diferite de theming între diverse zone ale aplicației,
    - bug-uri greu de diagnosticat în producție (tema nu se salvează, flicker între teme, mismatches server/client).
- Recomandare:
  - Decide asupra unei singure soluții de theming (ideal `next-themes` sau context custom, nu ambele).
  -:
    - Alege `ThemeProvider` canonic,
    - Expune `ThemeToggle` compatibil cu acel provider,
    - Elimină / marchează drept legacy celelalte implementări pentru a evita importurile greșite.
  - Verifică toate layout-urile/rutele să fie sub același provider.

4. [High] [Suprascriere / Config / Prod] ESLint dezactivează global `no-unused-vars`
- Locație:
  - [`.eslintrc.json`](.eslintrc.json:6-9)
- Descriere:
  - Regula `no-unused-vars` este dezactivată global:
    - ascunde importuri nefolosite, variabile neutilizate și posibile bug-uri reale (ex: folosirea unui identificator greșit, efecte secundare lipsă).
  - Impact direct în producție și mentenanță: cod mort necurățat, creșterea bundle-ului, dificultăți majore în identificarea bug-urilor.
- Recomandare:
  - Reactivați regulile:
    - Pentru TypeScript: `@typescript-eslint/no-unused-vars` configurat cu excepții pentru `_`.
    - Mențineți `no-unused-vars` sau echivalent strict pentru cod JS/TS.
  - Rulați ESLint și curățați importurile/variabilele nefolosite rezultate.

5. [High] [Bug potențial / Arhitectură] Coexistență `useIsMobile` / `use-mobile` / `DeviceContext` / `useDevice` cu responsabilități suprapuse
- Locație:
  - [`src/components/ui/sidebar.tsx`](src/components/ui/sidebar.tsx:10) (folosește `useIsMobile` din `@/hooks/use-mobile`)
  - [`src/hooks/use-mobile.ts`](src/hooks/use-mobile.ts:1)
  - [`src/hooks/ui/use-mobile.ts`](src/hooks/ui/use-mobile.ts:1)
  - [`src/hooks/useDevice.ts`](src/hooks/useDevice.ts:10)
  - [`src/contexts/DeviceContext.tsx`](src/contexts/DeviceContext.tsx:73)
  - [`src/hooks/index.ts`](src/hooks/index.ts:2-9)
- Descriere:
  - Mai multe surse pentru informații de device/responsivitate:
    - hook-uri diferite cu nume foarte similare,
    - context dedicat de device.
  - Risc:
    - calcul inconsistent al breakpoint-urilor,
    - comportamente divergente mobile/desktop între componente,
    - regresii greu de urmărit la modificări.
- Recomandare:
  - Definește un singur strat canonic de detecție device (ex: `DeviceContext` + `useDevice`) sau un singur hook (`useIsMobile`).
  - Marchează restul API-urilor ca legacy și elimină referințele treptat.
  - În codul nou, importă exclusiv dintr-un barrel `src/hooks`.

---

## Medium

6. [Medium] [Duplicat / Arhitectură] Dublare `FloatingActionButton`
- Locație:
  - [`src/components/search/FloatingActionButton.tsx`](src/components/search/FloatingActionButton.tsx:3)
  - [`src/components/FloatingActionButton.tsx`](src/components/FloatingActionButton.tsx:3)
- Descriere:
  - Două componente cu același nume și responsabilitate similară (acțiuni rapide mobile).
  - Risc:
    - importuri ambigue,
    - UX inconsistent (în funcție de varianta importată).
- Recomandare:
  - Păstrează o singură implementare canonică (`search` sau root, nu ambele).
  - Exporteaz-o centralizat și actualizează importurile.
  - Elimină componenta redundantă sau mut-o într-un folder `legacy`.

7. [Medium] [Duplicat / Arhitectură] Dublare `PropertyCard` și `PropertyDetails*` între `components` și `entities/features`
- Locație (exemple relevante):
  - [`src/components/property/PropertyCard.tsx`](src/components/property/PropertyCard.tsx:7)
  - [`src/components/property/PropertyDetails.tsx`](src/components/property/PropertyDetails.tsx:9)
  - [`src/app/sale/shared/components/PropertyDetailsEnhanced.tsx`](src/app/sale/shared/components/PropertyDetailsEnhanced.tsx:15)
  - Referințe în:
    - [`src/features/user-profile/components/FavoritesPage.tsx`](src/features/user-profile/components/FavoritesPage.tsx:2-4)
    - [`src/features/property-listing/components/MapView.tsx`](src/features/property-listing/components/MapView.tsx:4)
- Descriere:
  - Există un nucleu de UI `PropertyCard`/`PropertyDetails` în `components`, iar structura `entities/property` sugerează intenția de a standardiza modelul.
  - Risc: proliferare de variații ale aceluiași concept vizual, divergență între fluxurile sale/rent/hotel, dificultate în aplicarea unui refactor unic.
- Recomandare:
  - Centralizează UI-ul pentru proprietăți în `entities/property/ui` sau `src/components/property`.
  - `features` ar trebui să compună din UI-ul și modelele `entities`, nu să redefiniească aceleași componente.
  - Identifică instanțele unde se creează versiuni ad-hoc și aliniază-le la componenta canonică.

8. [Medium] [Suprascriere / Config] Fișiere `next.config` și configurații dispersate (indicatori)
- Locație:
  - [`src/next.config.ts`](src/next.config.ts:1)
  - `.next/required-server-files.json` indică `configFileName: "next.config.ts"` la rădăcină.
- Descriere:
  - Există un `src/next.config.ts` dar în listarea rădăcină nu apare un `next.config.ts`. Poate indica:
    - fie `next.config.ts` există în afara snapshot-ului,
    - fie config-ul "adevărat" e în altă parte, iar acesta din `src/` este nefolosit sau confuz.
  - Risc:
    - dezvoltatorii pot edita config-ul greșit,
    - așteptări diferite între build local și producție.
- Recomandare:
  - Confirmați care `next.config.ts` este efectiv folosit de Next:
    - dacă fișierul canonic e la root, mutați tot conținutul acolo,
    - dacă cel din `src/` nu e folosit, marcați-l clar sau eliminați-l.
  - Evitați existența mai multor fișiere de config Next "plauzibile".

9. [Medium] [Import nefolosit / Code Quality cu impact] Comentarii și reguli care maschează importuri nefolosite critice
- Locație (exemple):
  - [`src/components/HomePage.tsx`](src/components/HomePage.tsx:6-8)
  - [`src/app/api/auth/register/route.ts`](src/app/api/auth/register/route.ts:75-77)
  - `.eslintrc.json` (no-unused-vars dezactivat)
- Descriere:
  - Există comentarii explicite pentru importuri nefolosite și destructurări cu "_", dar în contextul dezactivării `no-unused-vars`, acestea pot masca bug-uri reale.
- Recomandare:
  - După reactivarea `no-unused-vars`, rulați ESLint și curățați:
    - importurile nefolosite,
    - variabilele moarte,
    - destructurările care păstrează date neutilizate.
  - Aceasta reduce dimensiunea bundle-ului și zgomotul în code review.

10. [Medium] [Arhitectură] Coexistență servicii/API paralele: `src/services/*` vs `src/entities/*/api` vs `src/shared/lib/api`
- Locație (exemple):
  - [`src/services/property.service.ts`](src/services/property.service.ts:1)
  - [`src/services/sale.property.service.ts`](src/services/sale.property.service.ts:1)
  - [`src/features/property-listing/api/properties.api.ts`](src/features/property-listing/api/properties.api.ts:1)
  - [`src/shared/lib/api/index.ts`](src/shared/lib/api/index.ts:1)
- Descriere:
  - Straturi multiple de apel API coexistă fără o separare clară:
    - servicii globale în `src/services`,
    - API-uri legate de features,
    - utilitare API partajate.
  - Risc:
    - logica duplicată pentru aceleași endpoint-uri,
    - dificultate în înlocuirea backend-ului sau în adăugarea de cross-cutting concerns (retry, logging, auth).
- Recomandare:
  - Definiți o arhitectură clară:
    - un strat unic HTTP client (ex: în `shared/lib/api`),
    - `entities` expun API stabil,
    - `features` doar orchestrează.
  - Identificați serviciile care fac același lucru și consolidați-le.

11. [Medium] [Bug potențial] Mapare URL-uri în `LayoutContent` vs rute existente
- Locație:
  - [`src/components/LayoutContent.tsx`](src/components/LayoutContent.tsx:17-47)
  - [`src/components/layout/LayoutContent.tsx`](src/components/layout/LayoutContent.tsx:17-47)
  - Rute existente sub `src/app/` (ex: `/sale`, `/notifications`, `/saved-searches`, `/signin`)
- Descriere:
  - `LayoutContent` transformă `pathname` în `view` pe baza unor stringuri hardcodate.
  - Risc:
    - introducerea unei noi rute sau reorganizarea structurilor `(user)`, `/sale/[id]`, etc. poate rupe mapping-ul,
    - posibile inconsistențe cu rute nested sau segmente dinamice suplimentare.
- Recomandare:
  - Externalizați mapping-ul într-o configurație unică (ex: `routes.ts`).
  - Adaptați logica pentru segmente dinamice multiple și grupuri de layout (Next 13+ app router patterns).

---

## Low

12. [Low] [Accesibilitate] Butoane iconice fără `aria-label` / titlu (ex: close / zoom)
- Locație (exemple):
  - [`src/components/map/MapView.tsx`](src/components/map/MapView.tsx:85-90,102-110)
  - Versiunea `features/property-listing/components/MapView.tsx` are parțial `aria-label`/`title` pe unele butoane.
- Descriere:
  - Unele butoane cu icon-uri (close, zoom) nu oferă text accesibil.
  - Impact redus dar relevant pentru UX și conformitate.
- Recomandare:
  - Asigurați-vă că toate butoanele cu doar icon:
    - au `aria-label` descriptiv,
    - sau includ text vizibil.
  - Aliniați toate versiunile `MapView` la același standard.

13. [Low] [Code Smell] Comentarii legacy și placeholder în cod de producție
- Locație (exemple):
  - [`src/features/property-listing/services/properties.ts`](src/features/property-listing/services/properties.ts:45-47)
  - [`src/features/property-listing/api/properties.api.ts`](src/features/property-listing/api/properties.api.ts:47-49)
  - Referințe în `src/README.md` la componente și structuri care nu reflectă exact codul actual.
- Descriere:
  - Comentarii de tip "For now", "In production" indică zone mock/stub care pot ajunge în producție fără înlocuire.
  - README descrie o structură idealizată care nu este 100% sincronizată cu implementarea curentă, ceea ce poate induce în eroare.
- Recomandare:
  - Marcați explicit aceste zone ca `TODO` cu owner și condiții clare.
  - Actualizați `src/README.md` pentru a reflecta arhitectura și rutele reale.

14. [Low] [Arhitectură] Barrel-uri și exports parțiale potențial inconsistente
- Locație (exemple):
  - [`src/hooks/index.ts`](src/hooks/index.ts:1-9)
  - [`src/features/navigation/index.ts`](src/features/navigation/index.ts:1)
  - `src/entities/*/index.ts`
- Descriere:
  - Index-urile exportă subseturi din funcționalitate; în contextul dublurilor (ex: `use-mobile` în două locuri), există risc de export greșit sau ascundere a implementării canonice.
- Recomandare:
  - Revizuiți toate barrel-urile:
    - asigurați-vă că exportă doar API-urile canonice,
    - eliminați exporturile către implementări legacy.
  - Documentați modul "oficial" de import pentru hooks, UI și entities.
