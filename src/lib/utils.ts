import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generate a random ID (csprng-based) */
export function nanoid(len = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/** Format phone number to E.164 */
export function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('1') && digits.length === 11) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return `+${digits}`;
}

/** Truncate text for TTS (ElevenLabs max ~2500 chars per request) */
export function truncateForTTS(text: string, maxLen = 2000): string {
  if (text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen);
  const lastSentence = truncated.lastIndexOf('.');
  return lastSentence > maxLen * 0.7
    ? truncated.slice(0, lastSentence + 1)
    : truncated + '…';
}

/** Strip markdown from text before sending to TTS */
export function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, '')     // headings
    .replace(/\*\*(.+?)\*\*/g, '$1') // bold
    .replace(/\*(.+?)\*/g, '$1')     // italic
    .replace(/`([^`]+)`/g, '$1')     // inline code
    .replace(/```[\s\S]*?```/g, '')  // code blocks
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // links
    .replace(/^\s*[-*+]\s/gm, '')   // list bullets
    .replace(/^\s*\d+\.\s/gm, '')  // numbered lists
    .trim();
}

export function formatTimestamp(ms: number): string {
  return new Date(ms).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });
}
