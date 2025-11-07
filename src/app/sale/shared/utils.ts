// Funcții helper pentru secțiunea sale

/**
 * Formatează prețul în RON cu separator de mii
 */
export function formatPrice(price: number, currency: string = 'RON'): string {
  return `${price.toLocaleString('ro-RO')} ${currency}`;
}

/**
 * Formatează data în format românesc
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Formatează dată relativă (ex: "acum 2 ore", "ieri")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return 'acum câteva minute';
  } else if (diffInHours < 24) {
    return `acum ${diffInHours} ${diffInHours === 1 ? 'oră' : 'ore'}`;
  } else if (diffInDays < 7) {
    return `acum ${diffInDays} ${diffInDays === 1 ? 'zi' : 'zile'}`;
  } else {
    return formatDate(date);
  }
}

/**
 * Trunchiază textul la lungimea specificată
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Convertește statusul în română
 */
export function formatStatus(status: string): string {
  switch (status) {
    case 'active':
      return 'Activ';
    case 'sold':
      return 'Vândut';
    case 'rented':
      return 'Închiriat';
    default:
      return status;
  }
}

/**
 * Convertește tipul proprietății în română
 */
export function formatPropertyType(type: string): string {
  switch (type) {
    case 'house':
      return 'Casă';
    case 'apartment':
      return 'Apartament';
    case 'villa':
      return 'Vilă';
    case 'penthouse':
      return 'Penthouse';
    case 'condo':
      return 'Condo';
    case 'townhouse':
      return 'Townhouse';
    case 'estate':
      return 'Proprietate';
    default:
      return type;
  }
}