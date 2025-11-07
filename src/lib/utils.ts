import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateText(text: string, maxLength: number = 35): string {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, text.lastIndexOf(' ', maxLength));
  return truncated ? truncated + ' ...' : text.substring(0, maxLength) + ' ...';
}

export function formatPrice(price: number): string {
  return price.toLocaleString('ro-RO');
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) return 'acum';
  if (diffInSeconds < 3600) return `acum ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `acum ${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `acum ${Math.floor(diffInSeconds / 86400)}z`;

  return new Date(date).toLocaleDateString('ro-RO');
}