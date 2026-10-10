import { business, mapLink, siteUrl } from "@/content/site";
import { services } from "@/content/services";

/** LocalBusiness structured data using only details confirmed on the business card. */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteUrl}/#business`,
    name: business.name,
    slogan: business.tagline,
    description: business.description,
    url: siteUrl,
    logo: `${siteUrl}/logo-mark.svg`,
    image: `${siteUrl}/og-image.jpg`,
    telephone: business.phones.map((p) => p.tel),
    hasMap: mapLink,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${business.address.street}, ${business.address.landmark}`,
      addressLocality: business.address.area,
      addressRegion: business.address.city,
      addressCountry: business.address.countryCode,
    },
    areaServed: { "@type": "City", name: "Lagos" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Aluminium and glass services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, description: s.summary },
      })),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
