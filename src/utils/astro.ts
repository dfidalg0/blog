import type { AstroGlobal } from 'astro';

export function getCidProps(astro: Readonly<AstroGlobal>) {
  const entries = Object.entries(astro.props);
  return Object.fromEntries(
    entries.filter(([key]) => key.startsWith('data-astro-cid-'))
  );
}
