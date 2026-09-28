// Stock photos (see src/assets/photos/CREDITS.md) until ნისეკომპანი has its own.
import hero from '../assets/photos/hero.jpg';
import heating from '../assets/photos/heating.jpg';
import cooling from '../assets/photos/cooling.jpg';
import water from '../assets/photos/water.jpg';
import business from '../assets/photos/business.jpg';
import band from '../assets/photos/band.jpg';

export const photos = { hero, heating, cooling, water, business, band };

/** Photo for each service page, by slug. */
export const servicePhoto = {
  gatboba: heating,
  gagrileba: cooling,
  tskalmomarageba: water,
} as Record<string, typeof hero>;
