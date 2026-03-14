import { describe, it, expect } from 'vitest';
import { nanoid, toE164, truncateForTTS, stripMarkdown, formatTimestamp } from '@/lib/utils';

describe('nanoid', () => {
  it('generates a string of the requested length', () => {
    const id = nanoid(16);
    expect(id.length).toBe(16);
  });

  it('defaults to 12 characters', () => {
    const id = nanoid();
    expect(id.length).toBe(12);
  });

  it('produces unique values', () => {
    const ids = new Set(Array.from({ length: 100 }, () => nanoid()));
    expect(ids.size).toBe(100);
  });
});

describe('toE164', () => {
  it('formats 10-digit US number', () => {
    expect(toE164('5551234567')).toBe('+15551234567');
  });

  it('formats 11-digit number with leading 1', () => {
    expect(toE164('15551234567')).toBe('+15551234567');
  });

  it('strips non-digit characters', () => {
    expect(toE164('(555) 123-4567')).toBe('+15551234567');
  });

  it('handles already-formatted numbers', () => {
    expect(toE164('+15551234567')).toBe('+15551234567');
  });
});

describe('truncateForTTS', () => {
  it('returns short text unchanged', () => {
    const text = 'Hello world.';
    expect(truncateForTTS(text)).toBe(text);
  });

  it('truncates long text at sentence boundary', () => {
    const text = 'A'.repeat(1500) + '. ' + 'B'.repeat(1000);
    const result = truncateForTTS(text, 2000);
    expect(result.length).toBeLessThanOrEqual(2001); // +1 for ending char
  });

  it('adds ellipsis when no sentence boundary found', () => {
    const text = 'A'.repeat(3000);
    const result = truncateForTTS(text, 2000);
    expect(result.endsWith('…')).toBe(true);
  });
});

describe('stripMarkdown', () => {
  it('removes markdown headings', () => {
    expect(stripMarkdown('## Hello World')).toBe('Hello World');
  });

  it('removes bold markers', () => {
    expect(stripMarkdown('This is **bold** text')).toBe('This is bold text');
  });

  it('removes italic markers', () => {
    expect(stripMarkdown('This is *italic* text')).toBe('This is italic text');
  });

  it('removes inline code', () => {
    expect(stripMarkdown('Use `console.log()`')).toBe('Use console.log()');
  });

  it('removes markdown links', () => {
    expect(stripMarkdown('Visit [Google](https://google.com)')).toBe('Visit Google');
  });
});

describe('formatTimestamp', () => {
  it('returns a formatted time string', () => {
    const result = formatTimestamp(Date.now());
    expect(result).toMatch(/\d{1,2}:\d{2}\s*(AM|PM)/);
  });
});
