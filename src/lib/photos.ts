// Stock photos (see src/assets/photos/CREDITS.md) until ნისეკომპანი has its own.
import hero from '../assets/photos/hero.jpg';
import heating from '../assets/photos/heating.jpg';
import cooling from '../assets/photos/cooling.jpg';
import water from '../assets/photos/water.jpg';
import business from '../assets/photos/business.jpg';
import band from '../assets/photos/band.jpg';
import ventilation from '../assets/photos/ventilation.jpg';

export const photos = { hero, heating, cooling, water, business, band, ventilation };

/** Photo for each service page, by slug. */
export const servicePhoto = {
  gatboba: heating,
  gagrileba: cooling,
  ventilacia: ventilation,
  tskalmomarageba: water,
} as Record<string, typeof hero>;
