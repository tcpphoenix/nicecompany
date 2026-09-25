// JSON-LD builders. Google reads these to understand the business and pages.
import { site, type Faq, type Service } from '../data/site';

const abs = (siteUrl: URL, path: string) => new URL(path.replace(/^\//, ''), siteUrl).href;

export function businessSchema(siteUrl: URL) {
  return {
    '@type': ['HVACBusiness', 'Plumber'],
    '@id': abs(siteUrl, '/#business'),
    name: site.name,
    alternateName: site.nameLatin,
    url: abs(siteUrl, '/'),
    logo: abs(siteUrl, '/icon-512.png'),
    image: abs(siteUrl, '/og.png'),
    telephone: site.phone.replace(/\s/g, ''),
    priceRange: '₾₾',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Tbilisi',
      addressCountry: 'GE',
    },
    areaServed: [
      { '@type': 'City', name: 'თბილისი' },
      ...site.districts.map((name) => ({ '@type': 'AdministrativeArea', name })),
    ],
    ...(site.hours.length ? { openingHours: site.hours.map((h) => h.schema) } : {}),
  };
}

export function serviceSchema(siteUrl: URL, service: Service) {
  return {
    '@type': 'Service',
    name: service.h1,
    serviceType: service.name,
    description: service.description,
    url: abs(siteUrl, `/${service.slug}/`),
    provider: { '@id': abs(siteUrl, '/#business') },
    areaServed: { '@type': 'City', name: 'თბილისი' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: service.name,
      itemListElement: service.items.map((i) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: i.title, description: i.text },
      })),
    },
  };
}

export function faqSchema(faq: Faq[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function breadcrumbSchema(siteUrl: URL, crumbs: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(siteUrl, c.path),
    })),
  };
}
