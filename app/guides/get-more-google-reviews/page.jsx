import Link from 'next/link';
import GuidePage from '../../../components/GuidePage';
import { pageMetadata } from '../../../src/lib/seo';

const slug = 'get-more-google-reviews';

export const metadata = pageMetadata({
  title: 'How to Get More Google Reviews (2026 Guide)',
  description:
    'When to ask, what to say, how to make reviewing one tap, and what Google does not allow. A practical guide for shops, restaurants, salons and clinics in India.',
  path: `/guides/${slug}`,
  type: 'article',
});

const sections = [
  {
    id: 'why-reviews-matter',
    title: 'Why Google reviews matter for a local business',
    body: (
      <>
        <p>
          When someone searches for “salon near me” or “best biryani in Koramangala”, Google shows a map and a short
          list of businesses. Next to each name is a star rating and a review count. For many people that small line of
          text decides where they go.
        </p>
        <p>
          Google says its local results are based on three things: how relevant a listing is to the search, how far it
          is from the searcher, and how prominent the business is. Reviews feed into prominence. Google’s own help pages
          say that more reviews and positive ratings can improve a business’s local ranking. Reviews also do a second
          job: they answer questions before people call you. Is it clean? Is parking easy? Do they take walk-ins?
        </p>
        <p>
          Recent reviews matter too. A listing with 400 reviews where the newest one is two years old looks less alive
          than one with 120 reviews and three from this week. A steady flow of new reviews is worth more than a single
          push before Diwali.
        </p>
      </>
    ),
  },
  {
    id: 'why-customers-dont-review',
    title: 'Why happy customers don’t leave reviews',
    body: (
      <>
        <p>
          Most businesses have far more satisfied customers than reviews. The gap is rarely about goodwill. It is about
          effort. To leave a review a customer has to:
        </p>
        <ol>
          <li>Remember to do it after they leave.</li>
          <li>Open Google Maps and find your exact listing, not a similar name down the road.</li>
          <li>Scroll to the reviews section and tap the right button.</li>
          <li>Be signed in to a Google account.</li>
          <li>Think of something to write.</li>
        </ol>
        <p>
          Each step loses people. By the time someone gets home, the moment has passed. The good news is that most of
          these steps can be removed. You can ask while they are still with you, send them straight to the review form,
          and help them get started with what to write.
        </p>
      </>
    ),
  },
  {
    id: 'ask-at-the-right-moment',
    title: 'Ask at the right moment',
    body: (
      <>
        <p>
          The best time to ask is right after the customer has experienced the thing they came for, while they are
          still in front of you. That moment is different for each business:
        </p>
        <ul>
          <li><strong>Restaurants and cafés:</strong> when the bill arrives, or as you hand back the card machine.</li>
          <li><strong>Salons and spas:</strong> when the customer is looking in the mirror and happy with the result.</li>
          <li><strong>Clinics:</strong> at the billing desk after the consultation, never in the consulting room.</li>
          <li><strong>Shops and showrooms:</strong> at the counter while the purchase is being packed.</li>
          <li><strong>Hotels and homestays:</strong> at checkout, when the stay is fresh in their mind.</li>
        </ul>
        <p>
          Who asks matters as much as when. A request from the person who served them, the stylist, the waiter or the
          doctor, works far better than a sign alone. Keep the ask short and specific. For example:
        </p>
        <blockquote>
          “If you enjoyed it today, would you mind leaving us a quick Google review? Just scan this code.
          It takes under a minute.”
        </blockquote>
        <blockquote>
          “Aapko accha laga ho toh ek Google review de dijiye. Bas yeh QR code scan kijiye.”
        </blockquote>
        <p>
          Ask everyone, not only the customers who seem delighted. That is both fairer and, as covered below, what
          Google requires.
        </p>
      </>
    ),
  },
  {
    id: 'make-it-one-step',
    title: 'Make leaving a review one step',
    body: (
      <>
        <p>
          The single biggest improvement is to send customers straight to your review form instead of telling them to
          “find us on Google”. There are a few ways to do that:
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>How it works</th>
                <th>Good for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Verbal request</td>
                <td>Staff ask and the customer searches for you later</td>
                <td>Low effort, but most people forget</td>
              </tr>
              <tr>
                <td>Review link</td>
                <td>A direct link to your review form, sent on WhatsApp or printed on a bill</td>
                <td>Customers you already message</td>
              </tr>
              <tr>
                <td>Printed QR code</td>
                <td>Customer opens the camera and scans</td>
                <td>Tables, receipts and posters</td>
              </tr>
              <tr>
                <td>Review page QR code</td>
                <td>Customer scans, rates the visit, then goes to the review form</td>
                <td>Counters and tables; also gives unhappy customers a private option</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          A <Link href="/guides/google-review-link">direct Google review link</Link> is the foundation of all of these.
          You can build one from your <Link href="/guides/find-google-place-id">Google Place ID</Link>. A{' '}
          <Link href="/how-it-works">Reviewwo QR code</Link> adds a short page with your name before the review form,
          and works with any phone camera.
        </p>
      </>
    ),
  },
  {
    id: 'help-them-start-writing',
    title: 'Help customers get started with what to write',
    body: (
      <>
        <p>
          A blank text box is the last hurdle. Many people want to say something nice but cannot think how to begin. A
          few prompts help: “What stood out? The food, the service, the price?” Customers who pick “friendly staff” and
          “quick service” find it much easier to write a sentence of their own.
        </p>
        <p>
          The review must still be theirs. Do not write reviews for customers, hand them a finished paragraph to post,
          or post on their behalf. Google treats reviews that are not based on the reviewer’s own experience as fake
          engagement. Prompts are fine; scripts are not.
        </p>
      </>
    ),
  },
  {
    id: 'reply-to-every-review',
    title: 'Reply to every review',
    body: (
      <>
        <p>
          Replies show future customers that someone is listening. Google recommends that businesses respond to reviews,
          and a short, specific thank-you to a five-star review takes ten seconds. Replies to critical reviews matter even
          more, because people read them to judge how you handle problems.
        </p>
        <p>
          Our guide on <Link href="/guides/respond-to-negative-google-reviews">responding to negative Google reviews</Link>{' '}
          has example replies you can adapt.
        </p>
      </>
    ),
  },
  {
    id: 'what-not-to-do',
    title: 'What not to do',
    body: (
      <>
        <p>Some shortcuts can get reviews removed or your listing flagged. Avoid:</p>
        <ul>
          <li><strong>Offering something in return for a review</strong>, such as a discount, free dessert or entry into a draw.</li>
          <li><strong>Asking only happy customers</strong>, or steering unhappy customers away from Google. This is known as review gating.</li>
          <li><strong>Reviews from staff, family or friends</strong> about your own business.</li>
          <li><strong>Buying reviews</strong> or using services that post them.</li>
          <li><strong>Writing reviews for customers</strong> or posting from a shop phone or tablet on their behalf.</li>
        </ul>
        <p>
          It is fine to give customers a private way to tell the manager about a problem, as long as everyone can still
          leave a public review if they want to. Read more in our summary of{' '}
          <Link href="/guides/google-review-policy">Google’s review rules for businesses</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'weekly-routine',
    title: 'A simple weekly routine',
    body: (
      <>
        <p>Getting reviews is a habit, not a campaign. A routine that works for most small businesses:</p>
        <ol>
          <li>Keep a review QR code at every till or table where customers finish their visit.</li>
          <li>Brief staff once: who asks, when, and the exact words.</li>
          <li>Once a week, read your new reviews and reply to each one.</li>
          <li>Check which QR codes are scanned most and move the quiet ones somewhere more visible.</li>
          <li>Read private feedback, fix the cause, and tell the team what changed.</li>
        </ol>
        <div className="note">
          <p>
            Reviewwo shows scans per QR code and keeps private feedback in one inbox, so this check takes a few minutes.{' '}
            <Link href="/features">See what is included</Link>.
          </p>
        </div>
      </>
    ),
  },
];

const faqs = [
  {
    q: 'How many Google reviews does a local business need?',
    a: 'There is no fixed number. Customers compare you with nearby businesses, so aim to match or beat the competitors who appear alongside you, and keep new reviews coming every week so your listing looks current.',
  },
  {
    q: 'Can I give a discount for leaving a Google review?',
    a: 'No. Google’s policies do not allow offering incentives such as discounts, freebies or contest entries in exchange for reviews. Reviews obtained this way can be removed.',
  },
  {
    q: 'Is it allowed to ask customers for a Google review?',
    a: 'Yes. Asking customers to share their experience is allowed and encouraged. What is not allowed is asking only the customers you expect to be positive, or discouraging people from leaving negative reviews.',
  },
  {
    q: 'Do customers need a Google account to leave a review?',
    a: 'Yes. Customers must be signed in to a Google account to post a review. Most Android users already are; iPhone users may be asked to sign in the first time.',
  },
  {
    q: 'What is the fastest way for a customer to leave a review?',
    a: 'Sending them straight to your review form while they are still with you. A QR code on the counter or table does this best, because customers can scan it before they leave.',
  },
];

export default function Page() {
  return (
    <GuidePage
      slug={slug}
      lead="Most happy customers never leave a review because it takes too many steps. This guide covers when to ask, what to say, how to make reviewing one tap, and what Google does not allow."
      sections={sections}
      faqs={faqs}
      extraRelated={[{ href: '/how-it-works', label: 'How Reviewwo review QR codes work' }]}
    />
  );
}
