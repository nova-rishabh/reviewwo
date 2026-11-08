import { JsonLd } from '../../components/content';
import { pageMetadata, absoluteUrl, SITE_NAME } from '../../src/lib/seo';

export const metadata = pageMetadata({
  title: 'Pricing: Google Review QR Codes from ₹149 a Month',
  description:
    'Starter ₹149/month for 1 Google review QR code, Growth ₹299/month for 5, Agency ₹799/month for 25. Save 20% yearly. Pay by UPI, card or net banking.',
  path: '/pricing',
});

const plans = [
  ['Starter', 149, 1],
  ['Growth', 299, 5],
  ['Agency', 799, 25],
];

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Reviewwo Google review QR codes',
  description: 'Subscription for Google review QR codes with a review page, private feedback inbox and WhatsApp alerts.',
  brand: { '@type': 'Brand', name: SITE_NAME },
  url: absoluteUrl('/pricing'),
  offers: plans.map(([name, price, codes]) => ({
    '@type': 'Offer',
    name: `${name} plan (${codes} QR code${codes === 1 ? '' : 's'})`,
    price,
    priceCurrency: 'INR',
    url: absoluteUrl('/pricing'),
    availability: 'https://schema.org/InStock',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price,
      priceCurrency: 'INR',
      unitText: 'month',
      billingDuration: 'P1M',
    },
  })),
};

export default function Layout({ children }) {
  return (
    <>
      <JsonLd data={productSchema} />
      {children}
    </>
  );
}
