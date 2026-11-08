import Link from 'next/link';
import GuidePage from '../../../components/GuidePage';
import { pageMetadata } from '../../../src/lib/seo';

const slug = 'google-review-link';

export const metadata = pageMetadata({
  title: 'How to Create a Google Review Link',
  description:
    'Get a direct link to your Google review form from your Business Profile or Place ID, turn it into a QR code, and avoid common mistakes.',
  path: `/guides/${slug}`,
  type: 'article',
});

const sections = [
  {
    id: 'what-is-a-review-link',
    title: 'What a Google review link is',
    body: (
      <>
        <p>
          A Google review link is a web address that opens the “write a review” form for one specific business. The
          customer does not have to search, scroll or tap through your listing. They open the link, choose their stars,
          type a few words and post.
        </p>
        <p>
          It is the building block for every way of asking for reviews: a message on WhatsApp, a line on a printed bill,
          a QR code on a table or the counter all point to the same link.
        </p>
      </>
    ),
  },
  {
    id: 'from-business-profile',
    title: 'Option 1: Copy the link from your Google Business Profile',
    body: (
      <>
        <p>If you manage your listing on Google, the quickest way is to copy the link Google gives you:</p>
        <ol>
          <li>Sign in to the Google account that manages your business.</li>
          <li>Search for your business name on Google or open it in the Google Maps app.</li>
          <li>In the management panel, look for <strong>Ask for reviews</strong> or <strong>Read reviews</strong>, then the option to share your review form.</li>
          <li>Copy the link. It usually starts with <code>g.page/r/</code>.</li>
        </ol>
        <p>
          Google moves these buttons from time to time, so the wording may differ slightly. If you cannot find it, use
          option 2.
        </p>
      </>
    ),
  },
  {
    id: 'from-place-id',
    title: 'Option 2: Build the link from your Place ID',
    body: (
      <>
        <p>
          Every business on Google Maps has a Place ID, a unique code that usually starts with <code>ChIJ</code>. You can
          turn it into a review link by adding it to the end of this address:
        </p>
        <p>
          <code>https://search.google.com/local/writereview?placeid=</code>
        </p>
        <p>
          For example, if your Place ID is <code>ChIJAbC123…</code>, your review link is{' '}
          <code>https://search.google.com/local/writereview?placeid=ChIJAbC123…</code>. This works even if you do not
          manage the listing yourself.
        </p>
        <p>
          Not sure what your Place ID is? Follow our step-by-step guide to{' '}
          <Link href="/guides/find-google-place-id">find your Google Place ID</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'as-a-qr-code',
    title: 'Option 3: Turn the link into a QR code',
    body: (
      <>
        <p>
          A link is only useful if customers open it. On a counter or table, a QR code is the easiest way: customers point
          their camera at it and the page opens. Any free QR generator can make one from your link.
        </p>
        <p>
          With Reviewwo you add your Place ID once during setup and get a QR code that opens a short page with your business
          name, a star rating and a button that copies the customer’s words and opens your Google review form. Customers
          can also send a private message to the manager if something went wrong. See{' '}
          <Link href="/how-it-works">how it works</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'where-to-share',
    title: 'Where to share your review link',
    body: (
      <>
        <ul>
          <li><strong>At the till or table:</strong> as a printed QR code.</li>
          <li><strong>On WhatsApp:</strong> in the thank-you message after a delivery, appointment or stay.</li>
          <li><strong>On bills and invoices:</strong> as a short line with a QR code.</li>
          <li><strong>In your email signature:</strong> for service businesses that work by email.</li>
          <li><strong>On Instagram:</strong> in your bio link or story highlights.</li>
        </ul>
        <p>
          Wherever you share it, send it to every customer rather than picking the ones you expect to be happy. Google
          does not allow selectively asking for positive reviews; see{' '}
          <Link href="/guides/google-review-policy">Google’s review rules for businesses</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'what-customers-see',
    title: 'What happens when a customer opens the link',
    body: (
      <>
        <p>
          On Android, the link usually opens the Google Maps app with the review form ready. On iPhone it may open in the
          browser or in Google Maps if it is installed. Either way the customer needs to be signed in to a Google
          account; if they are not, Google asks them to sign in first.
        </p>
        <p>
          Test your link on both an Android phone and an iPhone before printing it. Make sure it opens the right branch
          if you have more than one location.
        </p>
      </>
    ),
  },
  {
    id: 'common-mistakes',
    title: 'Common mistakes',
    body: (
      <>
        <ul>
          <li><strong>Linking to a search result</strong> instead of the review form. Customers then have to find you and may pick a competitor with a similar name.</li>
          <li><strong>Linking to the listing</strong> rather than the form. It works, but adds steps.</li>
          <li><strong>The wrong branch.</strong> Chains often copy one link for every outlet. Each branch needs its own Place ID.</li>
          <li><strong>Printing before testing.</strong> A typo in a printed QR code is expensive to fix.</li>
          <li><strong>A link shortener that later expires.</strong> If you shorten the link, use a service you control.</li>
        </ul>
      </>
    ),
  },
];

const faqs = [
  {
    q: 'Is a Google review link free?',
    a: 'Yes. Google does not charge for review links. You can copy one from your Business Profile or build one from your Place ID at no cost.',
  },
  {
    q: 'Does a Google review link expire?',
    a: 'Links copied from your Business Profile and links built from your Place ID keep working as long as the listing exists. Google can occasionally change a Place ID, so test your link every few months.',
  },
  {
    q: 'Can I make a QR code for my Google review link?',
    a: 'Yes. Any QR code generator can turn the link into a code. Reviewwo creates your QR codes automatically, and you can download it as PNG or SVG.',
  },
  {
    q: 'Can one review link work for several branches?',
    a: 'No. Each branch has its own Google listing and Place ID, so each needs its own link. Using one link for every branch sends all reviews to a single location.',
  },
];

export default function Page() {
  return (
    <GuidePage
      slug={slug}
      lead="A direct review link takes customers straight to your Google review form. Here are three ways to get one, where to use it, and the mistakes that send customers to the wrong page."
      sections={sections}
      faqs={faqs}
    />
  );
}
