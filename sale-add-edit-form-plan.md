Plan formular complet Add/Edit pentru anunturi Sale (aliniat cu DB + structura profesionala)

LEGENDĂ VIZUALĂ (pentru claritate)
- [COMMON] = câmp folosit pentru toate tipurile de proprietăți.
- [APT] = relevant pentru Apartament.
- [HOUSE] = relevant pentru Casă / Vilă.
- [LAND] = relevant pentru Teren.
- [COMM] = relevant pentru Spațiu comercial / Birouri.

Obiectiv:
- Un singur flux/formular profesional (SaleForm), nu 4 formulare diferite.
- CommonFields + secțiuni condiționale pe tip, astfel:
  - cod reutilizabil,
  - UX consistent,
  - mapare clară pe schema actuală din DB,
  - extensibil pentru viitor.

1. Mapare pe schema DB

[COMMON] _id: ObjectId (doar la edit, read-only)
[COMMON] title: string
[COMMON] description: string
[COMMON] price: number
[COMMON] currency: string ("€")
[COMMON] propertyType: string
[COMMON] rooms: number
[COMMON] bathrooms: number
[COMMON] area: number
[COMMON] floor: number
[COMMON] totalFloors: number
[COMMON] yearBuilt: number
[COMMON] location:
  - [COMMON] city: string
  - [COMMON] county: string
  - [COMMON] zone: string
  - [COMMON] address: string
[COMMON] features: string[]
[COMMON] images: string[]
[COMMON] contactInfo:
  - [COMMON] name: string
  - [COMMON] phone: string
  - [COMMON] email: string
  - [COMMON] showPhone: boolean
  - [COMMON] avatar: string
  - [COMMON] role: string
[COMMON] userId: string
[COMMON] isActive: boolean
[COMMON] createdAt: Date
[COMMON] updatedAt: Date

2. Arhitectură SaleForm

Componentă principală:
- SaleForm (unic)
  - [COMMON] gestionează:
    - state, validări, submit,
    - upload imagini,
    - contactInfo,
    - isActive (draft/publicat).
  - primește:
    - mode: "add" | "edit"
    - initialValues?: SaleProperty

În interior:
- [COMMON] CommonFields
- [APT] ApartmentFields
- [HOUSE] HouseFields
- [LAND] LandFields
- [COMM] CommercialFields

Randare condițională:
- dacă propertyType = "Apartament" → ApartmentFields
- dacă propertyType = "Casa" / "Casa/Vila" → HouseFields
- dacă propertyType = "Teren" → LandFields
- dacă propertyType = "Spatiu comercial" / "Birouri" → CommercialFields

3. CommonFields (valabile la toate tipurile)

- [COMMON] Titlu anunț (title)
- [COMMON] Descriere (description)
- [COMMON] Tip proprietate (propertyType)
- [COMMON] Preț (price) + Monedă (currency)
- [COMMON] Localizare (location: city, county, zone, address)
- [COMMON] Imagini (images[])
- [COMMON] Contact (contactInfo)
- [COMMON] Status (isActive: activ/draft)

4. ApartmentFields [APT]

Apare doar dacă propertyType = "Apartament":

- [APT] Numar camere (rooms)
- [APT] Numar bai (bathrooms)
- [APT] Suprafata utila (area)
- [APT] Etaj (floor)
- [APT] Numar etaje bloc (totalFloors)
- [APT] An constructie (yearBuilt)
- [APT] Dotari specifice prin features:
  - Lift, Balcon, Terasă, Parcare,
  - Centrala termica, AC, Geamuri termopan,
  - Interfon, Sistem alarmă etc.

5. HouseFields [HOUSE]

Apare doar dacă propertyType = "Casa" / "Casa/Vila":

- [HOUSE] Numar camere (rooms)
- [HOUSE] Numar bai (bathrooms)
- [HOUSE] Suprafata utila (area)
- [HOUSE] (extensii viitoare posibile, compatibile cu modelul):
  - suprafata teren,
  - locuri parcare,
  - regim inaltime.
- [HOUSE] Dotari:
  - similare cu apartament (features[]).

6. LandFields [LAND]

Apare doar dacă propertyType = "Teren":

- [LAND] Suprafata (area) (interpreta ca teren)
- [LAND] Alte info (in v1 salvabile in features):
  - intravilan / extravilan,
  - utilitati (gaz, apa, curent),
  - deschidere.

7. CommercialFields [COMM]

Apare doar dacă propertyType = "Spatiu comercial" / "Birouri":

- [COMM] Suprafata (area)
- [COMM] Etaj (floor) (daca e in cladire)
- [COMM] Numar bai (optional)
- [COMM] Features:
  - vitrină, acces stradal, vad pietonal, etc.

8. Features (implementare comună)

- [COMMON] features[] = lista de string-uri.
- UI:
  - grupam opțiunile pe categorii și le afișăm în funcție de tip:
    - [APT/HOUSE/COMM] Interior, Siguranță, Clădire, Utilități.
    - [LAND] Utilități teren, tip teren.
- La submit:
  - transformăm bifările în array-ul features[].

9. ContactInfo [COMMON]

- [COMMON] name, phone, email, showPhone, role, avatar
  - preluate din profil, dar editabile.
- Afișarea în detalii folosește direct contactInfo (fără mock).

10. Add vs Edit [COMMON]

Add:
- [COMMON] SaleForm cu valori default.
- [COMMON] userId din sesiune.
- [COMMON] isActive:
  - Publică acum,
  - sau Save draft.

Edit:
- [COMMON] SaleForm cu initialValues din DB.
- [COMMON] Poți:
  - modifica orice câmp permis,
  - schimba activ/inactiv.

11. UX Desktop vs Mobil [COMMON]

Desktop:
- [COMMON] sectiuni pe o singură pagină.

Mobil:
- [COMMON] wizard în pași:
  - P1 CommonFields baza,
  - P2 tip-specific,
  - P3 Media,
  - P4 Features,
  - P5 Contact + publicare.

12. Validări minime pentru PUBLICARE [COMMON]

Pentru isActive = true:
- [COMMON] title
- [COMMON] description
- [COMMON] propertyType
- [COMMON] location.city
- [COMMON] area (interpretată corect per tip)
- [COMMON] price
- [COMMON] minim 3 imagini
- [COMMON] contactInfo.name + (phone sau email)

Altfel:
- doar draft (isActive = false).

13. Tipuri recomandate pentru implementare (domains/adds)

- SalePropertyInput:
  - [COMMON] + [APT/HOUSE/LAND/COMM] câmpuri opționale în funcție de propertyType.
- SalePropertyUpdate:
  - Partial din SalePropertyInput.

Servicii:
- createSaleProperty(input: SalePropertyInput)
- updateSaleProperty(id: string, input: SalePropertyUpdate)

Concluzie

- Planul este acum colorat logic prin tag-uri [COMMON]/[APT]/[HOUSE]/[LAND]/[COMM], ușor de urmărit.
- Arhitectura rămâne profesională:
  - 1 SaleForm unificat,
  - sub-componente pe tip,
  - mapare curată pe DB,
  - fără duplicare, fără câmpuri inutile.