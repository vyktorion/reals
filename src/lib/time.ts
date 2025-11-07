export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) return 'acum';
  if (diffInSeconds < 3600) return `acum ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `acum ${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `acum ${Math.floor(diffInSeconds / 86400)}z`;

  return new Date(date).toLocaleDateString('ro-RO');
}