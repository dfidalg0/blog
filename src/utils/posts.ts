import type { CollectionEntry } from 'astro:content';
import { creationTimes } from 'virtual:creation-times';

export type BlogPost = CollectionEntry<'blog'>;

export type DateFormat = 'iso-string' | 'date' | 'unix' | 'formatted';

const formatter = Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const formattersMap = {
  'iso-string': (time) => time.toISOString(),
  'formatted': (time) => formatter.format(time),
  'unix': (time) => Number(time),
  'date': (time) => time,
} satisfies Record<DateFormat, (time: Date) => unknown>;

type FormattersMap = typeof formattersMap;

type FormatMap = {
  [K in keyof FormattersMap]: ReturnType<FormattersMap[K]>;
}

export function getCreationTime<F extends DateFormat = 'date'>(
  post: BlogPost,
  format: F = 'date' as F
): FormatMap[F] {
  const time = creationTimes[`src/content/blog/${post.id}`] ?? new Date();

  return formattersMap[format](time) as FormatMap[F];
}
