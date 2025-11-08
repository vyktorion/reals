'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  MapPin,
  Share2,
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  Shield,
  MapPinHouse,
  BedDouble,
  Bath,
  Ruler,
  Building2,
  Calendar,
} from 'lucide-react';
import type { SaleProperty } from '../model/types';

/**
 * PropertyDetails
 *
 * Implementare conform planului din id.md:
 * - max-w-7xl, layout 2 coloane (stânga 75%, dreapta 25%).
 * - Top bar sticky: Înapoi + info publicare/actualizare + Distribuie.
 * - Coloană stânga:
 *    - Header: titlu, locație, preț, badge-uri (tip, status).
 *    - Galerie: hero aspect-video + slider prev/next + thumbnails evidențiate.
 *    - Key facts: camere, băi, mp, etaj, an, etc.
 *    - Descriere.
 * - Coloană dreapta:
 *    - Card premium cu contact + info suplimentare (mock credibil, controlat).
 * - Folosește fonturile/stilul din /adds/sale (serif pentru titlu/preț, sans pentru meta).
 * - Mock data este izolată în cardul din dreapta și în mici detalii, ușor de înlocuit ulterior.
 */

export interface PropertyDetailsProps {
  property: SaleProperty;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onBack?: () => void;
}

export function PropertyDetails({ property, onBack }: PropertyDetailsProps) {
  const router = useRouter();

  // Imagery
  const images = Array.isArray(property.images) && property.images.length > 0
    ? property.images
    : ['/placeholder-property.jpg'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const thumbsContainerRef = useRef<HTMLDivElement>(null);

  const safeIndex = (index: number) => {
    if (images.length === 0) return 0;
    return (index + images.length) % images.length;
  };

  const handlePrev = () => {
    setCurrentIndex(prev => safeIndex(prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => safeIndex(prev + 1));
  };

  const handleThumbClick = (index: number) => {
    setCurrentIndex(index);
  };

  const mainImage = images[currentIndex] ?? images[0];

  // Dates
  const createdAtLabel =
    property.createdAt &&
    new Date(property.createdAt).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const updatedAtLabel =
    property.updatedAt &&
    new Date(property.updatedAt).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  // Navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  // Share
  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const title = property.title;

    if (navigator.share) {
      navigator
        .share({ title, text: title, url })
        .catch(() => {});
    } else if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  };

    // Sidebar mock premium info (izolat, ușor de înlocuit ulterior cu contactInfo real)
    const mockContact = {
      name: 'Mos Teanu',
      role: 'Dezvoltator',
      phone: '0721 234 567',
      email: 'contact@exemplu.ro',
      isActive: true,
    };

  const mockExtra = {
    energyClass: 'A',
    heating: 'Centrală proprie pe gaz',
    parking: 'Loc de parcare inclus',
    availableFrom: 'Imediat',
    charges: 'Cheltuieli estimate: 400-500 RON/lună',
    safety: ['Interfon', 'Supraveghere video', 'Sistem alarmă'],
    nearby: ['Școală', 'Grădiniță', 'Mall', 'Transport public'],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar sticky */}
      <div className="w-full border-b border-border bg-card/80 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-[11px] sm:text-xs text-muted-foreground hover:bg-accent transition"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Înapoi la rezultate</span>
          </button>
          <div className="flex items-center gap-3">
            {createdAtLabel && (
              <span className="hidden sm:inline text-[10px] text-muted-foreground">
                Publicat la {createdAtLabel}
                {updatedAtLabel ? ` • Actualizat la ${updatedAtLabel}` : ''}
              </span>
            )}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[10px] sm:text-xs text-muted-foreground hover:bg-accent transition"
            >
              <Share2 className="w-3 h-3" />
              <span>Distribuie</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-25 gap-6">
          {/* LEFT COLUMN ~68% */}
          <div className="lg:col-span-17 space-y-6">
            {/* Header content: titlu, sub el bară locație stânga / preț + badge-uri dreapta */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-serif text-foreground leading-snug">
                {property.title}
              </h1>

              <div className="flex items-center justify-between gap-3">
                {/* Locație stânga */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">
                    {property.location.city}
                    {property.location.county ? `, ${property.location.county}` : ''}
                    {property.location.zone ? `, ${property.location.zone}` : ''}
                    {property.location.address ? `, ${property.location.address}` : ''}
                  </span>
                </div>
                {/* Preț dreapta (fără badge-uri sale/activ pentru un look mai clean) */}
                <div className="flex flex-col items-end gap-1">
                  <div className="text-2xl sm:text-3xl font-serif text-blue-900 dark:text-blue-100 leading-none">
                    {property.price.toLocaleString('ro-RO')} {property.currency}
                  </div>
                </div>
              </div>
            </div>

            {/* Galerie: hero slider + thumbnails */}
            <div className="space-y-2">
              {/* Hero */}
              <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden">
                <Image
                  src={mainImage}
                  alt={property.title}
                  fill
                  className="object-cover"
                />

                {images.length > 1 && (
                  <>
                    {/* Prev */}
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Imagine anterioară"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
                    >
                      ‹
                    </button>
                    {/* Next */}
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Imagine următoare"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails: toate imaginile, scrollIntoView la selectare, scrollbar subțire */}
              {images.length > 1 && (
                <div
                  ref={thumbsContainerRef}
                  className="flex gap-2 mt-1 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full"
                >
                  {images.map((img, index) => {
                    const isActive = currentIndex === index;
                    return (
                      <button
                        key={`${img}-${index}`}
                        type="button"
                        onClick={() => {
                          handleThumbClick(index);
                          const container = thumbsContainerRef.current;
                          const thumb = container?.children[index] as HTMLElement | undefined;
                          if (thumb && typeof thumb.scrollIntoView === 'function') {
                            thumb.scrollIntoView({
                              behavior: 'smooth',
                              block: 'nearest',
                              inline: 'center',
                            });
                          }
                        }}
                        aria-label={`Vezi imaginea ${index + 1}`}
                        className={`relative w-20 h-14 md:w-24 md:h-16 rounded-xl overflow-hidden border transition shrink-0 ${
                          isActive
                            ? 'border-primary ring-1 ring-primary'
                            : 'border-border hover:border-primary/60'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${property.title} - ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Key facts: 5 indicatori compacți pe un rând */}
            {/* Key facts: 5 item-uri inline pe tot width-ul, cu icon + valoare + label */}
            <div className="grid grid-cols-5 gap-3 mt-4 text-sm">
              {property.rooms !== undefined && (
                <div className="px-4 py-3 rounded-xl bg-card border border-border flex items-center justify-center gap-2">
                  <BedDouble className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-[15px] text-foreground">
                    {property.rooms}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Camere
                  </span>
                </div>
              )}
              {property.bathrooms !== undefined && (
                <div className="px-4 py-3 rounded-xl bg-card border border-border flex items-center justify-center gap-2">
                  <Bath className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-[15px] text-foreground">
                    {property.bathrooms}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Băi
                  </span>
                </div>
              )}
              {property.area !== undefined && (
                <div className="px-4 py-3 rounded-xl bg-card border border-border flex items-center justify-center gap-2">
                  <Ruler className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-[15px] text-foreground">
                    {property.area}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    mp
                  </span>
                </div>
              )}
              {(property.floor !== undefined || property.totalFloors !== undefined) && (
                <div className="px-4 py-3 rounded-xl bg-card border border-border flex items-center justify-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-[15px] text-foreground">
                    {property.floor !== undefined && property.totalFloors !== undefined
                      ? `${property.floor}/${property.totalFloors}`
                      : property.floor !== undefined
                      ? `${property.floor}`
                      : '–'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    
                  </span>
                </div>
              )}
              {property.yearBuilt !== undefined && (
                <div className="px-4 py-3 rounded-xl bg-card border border-border flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-[15px] text-foreground">
                    {property.yearBuilt}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    
                  </span>
                </div>
              )}
            </div>

            {/* Descriere */}
            {property.description && (
              <div className="space-y-2 mt-4">
                <h2 className="text-base font-semibold text-foreground">
                  Descriere
                </h2>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {property.description}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN ~32% - Contact card simplu */}
          <div className="lg:col-span-8 flex justify-end">
            {/* Card contact adaptat la coloană 32%: max-w-sm pentru echilibru vizual */}
            <div className="sticky top-28 space-y-4 w-full max-w-sm">
              <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold overflow-hidden">
                    {mockContact.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-base font-semibold text-foreground">
                      {mockContact.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {mockContact.role}
                      {mockContact.isActive && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px]">
                          Activ
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Contact direct pentru programare vizionări și detalii
                    suplimentare despre proprietate.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button className="inline-flex items-center justify-center gap-2 w-full px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition">
                    <Phone className="w-3 h-3" />
                    Sună acum
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 w-full px-3 py-1.5 rounded-lg border border-border text-sm text-foreground hover:bg-accent transition">
                    <MessageCircle className="w-3 h-3" />
                    Scrie mesaj
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 w-full px-3 py-1.5 rounded-lg border border-border text-sm text-foreground hover:bg-accent transition">
                    <Mail className="w-3 h-3" />
                    Trimite email
                  </button>
                </div>
              </div>
              {/* Notă: cardurile extra (siguranță / în apropiere) mutate jos ca secțiune premium comună */}
            </div>
          </div>
        </div>

        {/* Secțiune premium jos: extra info + siguranță + în apropiere */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm text-muted-foreground">
          <div className="bg-card border border-border rounded-2xl p-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-xs font-semibold">
                Informații suplimentare
              </span>
            </div>
            <ul className="space-y-1 list-disc list-inside">
              <li>Clasă energetică: {mockExtra.energyClass}</li>
              <li>{mockExtra.heating}</li>
              <li>{mockExtra.parking}</li>
              <li>{mockExtra.availableFrom}</li>
              <li>{mockExtra.charges}</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-xs font-semibold">Siguranță</span>
            </div>
            <ul className="space-y-1 list-disc list-inside">
              {mockExtra.safety.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <MapPinHouse className="w-3 h-3 text-primary" />
              <span className="text-xs font-semibold">În apropiere</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {mockExtra.nearby.map((item, i) => (
                <span
                  key={i}
                  className="px-2 py-1.5 rounded-full bg-background border border-border text-xs font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Anunțuri asemănătoare - folosim ce avem în "DB"/pipeline:
            - alte proprietăți din aceeași zonă (același city/zone)
            - excludem proprietatea curentă
            - afișăm maxim 4 carduri */}
        <div className="mt-10 space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            Anunțuri asemănătoare
          </h2>
          {/* TODO: Integrează aici anunțuri similare reale din service-ul de sale
              (ex: filtrezi după oraș/zonă și excluzi id-ul curent) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition"
              >
                <div className="relative aspect-video bg-muted">
                  <Image
                    src="/placeholder-property.jpg"
                    alt={`Anunț similar ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-sm font-semibold text-foreground line-clamp-1">
                    Apartament 3 camere, zonă premium
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    București, Nord, aproape de metrou
                  </div>
                  <div className="text-sm font-semibold text-blue-900">
                    120.000 €
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}