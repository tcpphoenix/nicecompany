const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Internal link that respects Astro's `base` (e.g. when hosted under a sub-path). */
export const href = (path: string) => `${base}${path.startsWith('/') ? path : `/${path}`}`;
