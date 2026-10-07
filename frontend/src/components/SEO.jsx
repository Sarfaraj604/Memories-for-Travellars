import { useBusiness } from '../context/BusinessContext';

export default function SEO({ title = 'Memories for Travellers | Homestay & Tour Packages', description = 'Discover comfortable homestays, memorable journeys and customized tour experiences with Memories for Travellers.' }) {
  const { business } = useBusiness();
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: business.businessName,
    alternateName: business.legalName,
    telephone: business.phoneLabel,
    email: business.email,
    address: business.address,
    areaServed: business.serviceArea,
    url: business.website,
  };

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <script type="application/ld+json">{JSON.stringify(localBusiness)}</script>
    </>
  );
}
