# Plan UX/UI actualizat pentru /sale/[id] (conform cerințelor curente)

Obiectiv:
Pagină de detaliu premium, clară, aliniată cu /adds/sale, folosind:
- date reale din DB (title, price, images, location, meta),
- mock data controlată pentru a umple layout-ul (contact, info suplimentare, similar listings),
- structură coerentă pentru evoluție ulterioară (contactInfo, features, recomandări reale).

---

## 0. Layout global

- max-w-7xl, mx-auto, px-4/px-6, spacing vertical 5–8.
- Grid desktop:
  - 5 coloane:
    - stânga: col-span-3 (~60–65%) → galerie + key facts + descriere.
    - dreapta: col-span-2 (~35–40%) → card contact compact.
- Pe mobil: 1 coloană (stacked).

Fonturi:
- Folosim aceleași fonturi ca /adds/sale:
  - Titlu + preț: font serif existent.
  - Meta, label-uri, descriere: sans-serif existent.
- Nu introducem fonturi noi.

---

## 1. Top bar sticky

Poziționat sub header global, full width, sticky.

Conținut:
- Stânga:
  - Buton “Înapoi la rezultate”:
    - icon ArrowLeft
    - text
    - comportament:
      - onBack dacă e definit,
      - altfel router.back().
- Dreapta:
  - Dacă există createdAt:
    - “Publicat la {data}”
  - Dacă există și updatedAt:
    - “• Actualizat la {data}”
  - Buton “Distribuie”:
    - Share2
    - navigator.share(title, url) sau copy to clipboard fallback.

Stil:
- bg-card/80, border-b, backdrop-blur-sm
- text-xs / [10px], discret.

---

## 2. Coloana stânga (~65%) – Titlu, locație, preț, galerie, key facts, descriere

### 2.1. Header conținut

Structură:

1) Titlu:
   - font serif, 2xl–3xl
   - ex: “Apartament 3 camere Rahova”

2) Bară imediat sub titlu:
   - Left: locație
     - MapPin + “City, County, Zonă, Adresă (dacă există)”
   - Right: preț:
     - Preț:
       - mare, 2xl, serif, coloristică ca /adds/sale.
     - Badge tip:
       - propertyType / type (ex: Apartament)
     - Badge status (dacă există):
       - Activ / Rezervat / Vândut etc.

Reguli:
- Locația și prețul stau pe același rând pentru claritate imediată.
- Badges compacte (text-[9–10px] uppercase).

### 2.2. Galerie imagini (hero slider + thumbnails)

Hero:
- aspect-video,
- rounded-2xl,
- object-cover,
- folosește images[] din DB (fallback placeholder dacă nu sunt).

Slider:
- Dacă images.length > 1:
  - buton Prev pe stânga (mijloc vertical),
  - buton Next pe dreapta,
  - navigare circulară (safeIndex).

Thumbnails:
- Afișăm TOATE imaginile (nu +X foto).
- Așezate într-un rând scroll-abil orizontal sub hero.
- Comportament:
  - click pe thumb:
    - setează currentIndex,
    - face scrollIntoView pentru thumb selectat (să fie vizibil chiar dacă sunt multe).
- Stil:
  - thumb activ:
    - border-primary + ring discret,
  - thumb inactiv:
    - border-border, hover:border-primary/60,
  - aria-label “Vezi imaginea X” pentru accesibilitate.

---

## 3. Key facts (sub galerie, stânga)

Cerințe:
- Fără text redundant mare deasupra,
- Toate 5 principale să poată încăpea pe un rând pe desktop.

Fields:
- Camere (rooms)
- Băi (bathrooms)
- Suprafață utilă (area)
- Etaj (floor / totalFloors)
- An construcție (yearBuilt)

Layout:
- grid:
  - mobile: 2 coloane
  - desktop: 5 coloane (sm:grid-cols-5)
- Carduri mici:
  - bg-card, border, rounded-xl,
  - label mic uppercase (text-[10px], muted),
  - valoare bold (text-xs/sm).

Reguli:
- Afișăm doar câmpurile existente.
- Fără iconuri complicate acum; accent pe claritate.

---

## 4. Descriere (stânga)

- Titlu: “Descriere”
- Conținut:
  - property.description
  - whitespace-pre-line
  - text-sm, line-height confortabil
- Doar date reale, fără mock.

---

## 5. Coloana dreapta (~35–40%) – Contact card

Scop:
- Card curat, profesional, fără extra zgomot.

Conținut:
- Avatar:
  - Dacă avem contactInfo.avatar: Image rotund.
  - Altfel: inițiale din nume (cum e acum).
- Nume: contactInfo.name sau mock (Mos Teanu).
- Rol: contactInfo.role (“Dezvoltator” / “Agent” / “Proprietar”).
- Badge “Activ” dacă isActive.

Text scurt:
- 1–2 linii despre “Contact direct pentru vizionare”.

Acțiuni:
- “Sună acum” (Phone)
- “Scrie mesaj” (MessageCircle)
- “Trimite email” (Mail)
- Doar UI (fără logică reală încă).

Reguli:
- Card sticky top-28 pe desktop.
- Doar acest card în sidebar; extra info mutată jos.

---

## 6. Secțiune jos: Informații suplimentare / Siguranță / În apropiere (mock premium)

Mutate sub layout-ul principal, ca bloc premium comun.

3 carduri în grid (lg:grid-cols-3):

1) “Informații suplimentare”
   - Clasă energetică: A
   - Încălzire: Centrală proprie
   - Parcare: Inclusă
   - Disponibilitate: Imediat
   - Cheltuieli: 400-500 RON
2) “Siguranță”
   - Interfon
   - Supraveghere video
   - Sistem alarmă
3) “În apropiere”
   - Badge-uri: Școală, Grădiniță, Mall, Transport public

Note:
- Toate mock, strict front-end.
- Grupate într-un singur loc, ușor de înlocuit cu date reale.

---

## 7. Anunțuri asemănătoare

Secțiune la bottom, după extra info:

- Titlu: “Anunțuri asemănătoare”
- Grid:
  - sm:grid-cols-4 → 4 carduri pe rând pe desktop.
- Card structură:
  - poză (aspect-video),
  - titlu scurt,
  - locație scurtă,
  - preț.

Fază curentă:
- folosește mock (4 carduri) pentru layout.

Fază următoare:
- conectăm la DB:
  - fie prin lista de properties (ex: fetchSaleList),
  - fie endpoint dedicat (similar by location/price/rooms),
  - filtrăm și afișăm primele 4.

---

## 8. Integrare cu date reale & avatar

- Când avem contactInfo în SaleProperty:
  - folosim direct:
    - avatar, name, role, phone, email, showPhone, isActive.
- Când avem features[]:
  - înlocuim dotările mock cu cele reale.
- Când avem recomandări reale:
  - înlocuim Anunțuri asemănătoare mock cu map peste date reale.

Mock data:
- izolată în PropertyDetails,
- ușor de șters / înlocuit,
- nu modifică schema backend.

---

## Rezumat

Planul id.md (acum actualizat) include:

- Galerie:
  - hero slider aspect-video,
  - thumbs scrollabile, fără pierdere după 6 imagini,
  - imagine activă evidențiată.
- Layout:
  - 3/5 stânga (conținut),
  - 2/5 dreapta (contact),
  - top bar sticky.
- Key facts:
  - 5 carduri compacte, un rând pe desktop.
- Descriere clară.
- Contact:
  - avatar + info, curat, focus.
- Extra info + Siguranță + În apropiere:
  - jos, nu în sidebar.
- Anunțuri asemănătoare:
  - 4 carduri pe rând, pregătite pentru legare la DB.

Acesta este blueprint-ul actual și reflectă toate noile cerințe.