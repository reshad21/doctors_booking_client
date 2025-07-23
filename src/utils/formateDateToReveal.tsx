export default function formatDateToReadable(dateString: string): string {
  const date: Date = new Date(dateString);

  if (isNaN(date.getTime())) return "Invalid date";

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  };

  return date.toLocaleDateString('en-GB', options); // e.g., "14 July 2025"
}
