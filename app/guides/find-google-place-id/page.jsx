import Link from 'next/link';
import GuidePage from '../../../components/GuidePage';
import { pageMetadata } from '../../../src/lib/seo';

const slug = 'find-google-place-id';
const FINDER = 'https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder';

export const metadata = pageMetadata({
  title: 'How to Find Your Google Place ID (Step by Step)',
  description:
    'Find the Google Place ID for your business in under two minutes with Google’s free Place ID finder, check that it is correct, and fix common problems.',
  path: `/guides/${slug}`,
  type: 'article',
});

const sections = [
  {
    id: 'what-is-a-place-id',
    title: 'What a Google Place ID is',
    body: (
      <>
        <p>
          A Place ID is a code Google uses to identify one place on Google Maps. Your business name can be shared by
          other businesses, and your address can change, but the Place ID points to exactly one listing. Most Place IDs
          start with <code>ChIJ</code> and are 27 or more characters long, for example <code>ChIJN1t_tDeuEmsRUsoyG83frY4</code>.
        </p>
        <p>
          You need it to build a direct <Link href="/guides/google-review-link">Google review link</Link>, and Reviewwo
          asks for it during setup so that your QR code opens the review form for your business and nobody else’s.
        </p>
      </>
    ),
  },
  {
    id: 'steps',
    title: 'Find your Place ID in five steps',
    body: (
      <>
        <ol>
          <li>
            Open Google’s free{' '}
            <a href={FINDER} target="_blank" rel="noreferrer">Place ID finder</a> in your browser. It works on a phone
            or a computer.
          </li>
          <li>Type your business name into the search box on the map, followed by your area or city.</li>
          <li>Pick your business from the suggestions. Check the address carefully if there are several similar names.</li>
          <li>A marker appears on the map with a small box showing the name, the Place ID and the address.</li>
          <li>Copy the Place ID. Take care not to include spaces before or after it.</li>
        </ol>
        <div className="note">
          <p>
            Search with the name exactly as it appears on Google Maps. If your listing says “Sharma Sweets &amp;
            Restaurant”, searching “Sharma Sweets” plus your area is usually enough.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'check-it',
    title: 'Check that the Place ID is correct',
    body: (
      <>
        <p>
          Before you print anything, open this address in a browser with your Place ID added at the end:
        </p>
        <p>
          <code>https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID</code>
        </p>
        <p>
          It should open the review form with your business name at the top. If it shows a different business, an error,
          or a blank page, the ID is wrong. Reviewwo’s setup has a “Check it opens your listing” button that does this
          test for you.
        </p>
      </>
    ),
  },
  {
    id: 'problems',
    title: 'Common problems and fixes',
    body: (
      <>
        <h3>My business does not appear in the search</h3>
        <p>
          New listings can take a few days to show up after they are created or verified. Try searching by your full
          address instead of the name. If it still does not appear, open Google Maps, find your shop on the map and check
          that the listing is published.
        </p>
        <h3>There are two listings for my business</h3>
        <p>
          Duplicates happen when a listing is created twice, often after a move or a name change. Use the one that has
          your reviews and is verified. You can ask Google to merge or remove the duplicate from your Business Profile.
        </p>
        <h3>I have several branches</h3>
        <p>
          Each branch has its own listing and its own Place ID. Find each one separately and keep a note of which ID
          belongs to which outlet.
        </p>
        <h3>The Place ID stopped working</h3>
        <p>
          Google can update a Place ID, for example when a listing is merged or moved. Google’s documentation recommends
          refreshing stored Place IDs from time to time. If your review link suddenly opens the wrong page, look up the
          Place ID again and update it in your settings.
        </p>
      </>
    ),
  },
  {
    id: 'using-it',
    title: 'Using your Place ID with Reviewwo',
    body: (
      <>
        <p>
          During <Link href="/register">sign-up</Link>, Reviewwo asks for your Place ID in step two and lets you test it
          straight away. You can change it later under Settings, and every QR code you have already printed will start using
          the new ID immediately, because it points to your Reviewwo page rather than to Google directly.
        </p>
      </>
    ),
  },
];

const faqs = [
  {
    q: 'Can I find my Place ID in the Google Maps app?',
    a: 'Not directly. The Maps app does not show Place IDs. Use Google’s Place ID finder in a browser, which works on phones too.',
  },
  {
    q: 'Is the Place ID the same as my Google Business Profile ID?',
    a: 'No. Your Business Profile has its own internal IDs. The Place ID is the identifier used by Google Maps, and it is the one you need for review links.',
  },
  {
    q: 'Does it cost anything to look up a Place ID?',
    a: 'No. Google’s Place ID finder is free to use and does not need an account.',
  },
  {
    q: 'Do I need to own the listing to get its Place ID?',
    a: 'No. Anyone can look up the Place ID of any public listing. You should only use it for review requests if it is your own business.',
  },
];

export default function Page() {
  return (
    <GuidePage
      slug={slug}
      lead="Your Google Place ID is the code that points to your exact listing on Google Maps. You need it to send customers straight to your review form. Here is how to find it in under two minutes."
      sections={sections}
      faqs={faqs}
    />
  );
}
