import Link from 'next/link';
import { SiteShell, PageIntro, Article, FaqSection, CtaBand } from '../../components/content';
import { pageMetadata } from '../../src/lib/seo';

export const metadata = pageMetadata({
  title: 'How Google Review QR Codes Work',
  description:
    'What happens when a customer scans a Reviewwo QR code, what they see at each rating, how feedback reaches your manager, and what data is stored.',
  path: '/how-it-works',
});

const sections = [
  {
    id: 'the-tap',
    title: '1. The customer scans your QR code',
    body: (
      <>
        <p>
          Each Reviewwo QR code holds a short link, such as <code>reviewwo.divergit.com/r/7MAKR3</code>. Customers point
          their phone camera at it and tap the link that appears. Print it on a table sign, a sticker, a menu or the
          bill; it works the same everywhere. If you prefer, you can also add an{' '}
          <Link href="/nfc-cards">NFC card</Link> that opens the same link with a tap.
        </p>
        <p>
          The link opens a web page in the phone’s browser. There is no app to install and no Reviewwo account to make.
          Each visit is counted against the QR code it came from, so you can see which counters and tables are used most.
        </p>
      </>
    ),
  },
  {
    id: 'the-page',
    title: '2. They see your business and rate the visit',
    body: (
      <>
        <p>
          The page shows your business name and city and asks one question: “How was your visit?”. Nothing is selected to
          begin with. The customer picks between one and five stars.
        </p>
        <p>
          This rating stays on the page. It is not posted to Google and it does not stop anyone from posting on Google.
          It only decides which option is shown first.
        </p>
      </>
    ),
  },
  {
    id: 'four-or-five',
    title: '3a. Four or five stars: straight to Google',
    body: (
      <>
        <p>Customers who had a good visit see:</p>
        <ul>
          <li>An optional list of things that might have stood out, chosen for your type of business, such as “Great coffee” for a café or “Caring doctor” for a clinic.</li>
          <li>A text box. Picking a topic adds a starting sentence, which they can change or delete.</li>
          <li>A button that copies their text and opens the Google review form for your listing.</li>
        </ul>
        <p>
          On Google, they choose their own star rating, paste their words if they want to, and post from their own Google
          account. Below the Google button there is also a link to message the manager privately.
        </p>
      </>
    ),
  },
  {
    id: 'one-to-three',
    title: '3b. One to three stars: tell the manager, and Google if they want',
    body: (
      <>
        <p>
          Customers who had a poor visit are first invited to tell the manager what happened. The form says clearly that
          the message goes to the manager and is not posted publicly. Name and phone number are optional.
        </p>
        <p>
          Directly below the form, the same page offers the Google review option with the heading “Want to leave a Google
          review too?”. Nobody is stopped from posting publicly. This matters: Google’s rules do not allow businesses to
          steer unhappy customers away from reviews, as explained in our guide to{' '}
          <Link href="/guides/google-review-policy">Google’s review rules for businesses</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'the-alert',
    title: '4. Your manager gets a WhatsApp message',
    body: (
      <>
        <p>
          When a customer sends a private message, Reviewwo forwards it to the alert number you set during setup. The
          message includes the business name, the star rating, which QR code it came from, the customer’s comment and any
          contact details they chose to share.
        </p>
        <p>
          Messages are sent from Reviewwo’s own WhatsApp number to yours. Your customers never receive WhatsApp messages
          from Reviewwo. If a message cannot be delivered, the feedback is still saved in your dashboard and marked so you
          know to check it there.
        </p>
      </>
    ),
  },
  {
    id: 'the-dashboard',
    title: '5. You follow up in the dashboard',
    body: (
      <>
        <p>The dashboard has four parts:</p>
        <ul>
          <li><strong>Overview:</strong> scans, open feedback and anything left to set up.</li>
          <li><strong>Feedback:</strong> every private message, with filters for open and resolved, and a note of what you did.</li>
          <li><strong>QR codes:</strong> create, rename and remove QR codes, download them for printing and see scans for each one.</li>
          <li><strong>Settings:</strong> business details, Google Place ID, alert number, your account and plan.</li>
        </ul>
        <p>
          Replies to Google reviews happen in your Google Business Profile. Our guide on{' '}
          <Link href="/guides/respond-to-negative-google-reviews">responding to negative reviews</Link> has example replies.
        </p>
      </>
    ),
  },
  {
    id: 'data',
    title: 'What data is stored',
    body: (
      <>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Stored by Reviewwo?</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Scans (time and which QR code)</td><td>Yes, as a count per QR code</td></tr>
              <tr><td>The star rating on the review page</td><td>Only if the customer sends a private message</td></tr>
              <tr><td>Private message, and optional name and phone</td><td>Yes, in your feedback inbox</td></tr>
              <tr><td>The text a customer copies for Google</td><td>No, it stays on their phone</td></tr>
              <tr><td>The customer’s Google account and review</td><td>No, that is between the customer and Google</td></tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: 'setup',
    title: 'Setting it up',
    body: (
      <>
        <p>After you <Link href="/register">create an account</Link>, a four-step setup asks for:</p>
        <ol>
          <li>Your business name, type and city.</li>
          <li>Your Google Place ID, with a button to check it opens your listing. See <Link href="/guides/find-google-place-id">how to find it</Link>.</li>
          <li>The WhatsApp number that should receive feedback alerts, with a test message.</li>
          <li>A name for your first QR code, which you can then download and print.</li>
        </ol>
        <p>Most businesses finish in about ten minutes.</p>
      </>
    ),
  },
];

const faqs = [
  {
    q: 'Does the customer’s star rating on the review page go to Google?',
    a: 'No. It only decides which option is shown first. Customers choose their Google star rating themselves on Google.',
  },
  {
    q: 'Can unhappy customers still post on Google?',
    a: 'Yes. The Google review option is shown to every customer, whatever rating they pick.',
  },
  {
    q: 'Do customers get WhatsApp messages from Reviewwo?',
    a: 'No. WhatsApp messages only go to the alert number you set for your business.',
  },
  {
    q: 'What does the customer need to post a review?',
    a: 'A phone with a camera, a browser and a Google account.',
  },
];

export default function HowItWorksPage() {
  return (
    <SiteShell>
      <PageIntro
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'How it works', path: '/how-it-works' },
        ]}
        title="How Reviewwo review QR codes work"
        lead="From the moment a customer scans your QR code to the message your manager receives, here is exactly what happens, what customers see, and what is stored."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/r/demo" className="btn btn-primary btn-lg">Try the review page</Link>
          <Link href="/features" className="btn btn-secondary btn-lg">See all features</Link>
        </div>
      </PageIntro>
      <Article
        sections={sections}
        related={[
          { href: '/features', label: 'Everything included in Reviewwo' },
          { href: '/guides/get-more-google-reviews', label: 'How to get more Google reviews' },
          { href: '/pricing', label: 'Pricing and plans' },
        ]}
      />
      <FaqSection faqs={faqs} tinted />
      <CtaBand />
    </SiteShell>
  );
}
