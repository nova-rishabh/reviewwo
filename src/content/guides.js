/** Guide registry: used by the guides index, sitemap and "keep reading" links. */
export const GUIDES = [
  {
    slug: 'get-more-google-reviews',
    title: 'How to get more Google reviews for your business',
    short: 'Get more Google reviews',
    description:
      'A practical guide for Indian shops, restaurants, salons and clinics: when to ask, how to make reviewing one step, what to say, and what Google does not allow.',
    readMinutes: 9,
  },
  {
    slug: 'google-review-link',
    title: 'How to create a Google review link for your business',
    short: 'Create a Google review link',
    description:
      'Three ways to get a direct link that opens your Google review form, where to share it, and the mistakes that send customers to the wrong page.',
    readMinutes: 6,
  },
  {
    slug: 'find-google-place-id',
    title: 'How to find your Google Place ID',
    short: 'Find your Google Place ID',
    description:
      'Step-by-step instructions to find the Google Place ID for your business, check it is correct, and fix the common problems.',
    readMinutes: 5,
  },
  {
    slug: 'respond-to-negative-google-reviews',
    title: 'How to respond to negative Google reviews',
    short: 'Respond to negative reviews',
    description:
      'How to reply to a bad Google review calmly and quickly, with example replies for restaurants, salons, shops and clinics, and when you can ask Google to remove one.',
    readMinutes: 8,
  },
  {
    slug: 'google-review-policy',
    title: 'Google review rules for businesses: what you can and cannot do',
    short: 'Google review rules for businesses',
    description:
      'A plain-language summary of Google’s review policies for business owners: asking for reviews, discounts, review gating, staff reviews, and what happens if you break the rules.',
    readMinutes: 7,
  },
];

export const guideBySlug = (slug) => GUIDES.find((g) => g.slug === slug);

export function relatedGuides(slug, count = 3) {
  return GUIDES.filter((g) => g.slug !== slug)
    .slice(0, count)
    .map((g) => ({ href: `/guides/${g.slug}`, label: g.title }));
}
