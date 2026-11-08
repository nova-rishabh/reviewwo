import Link from 'next/link';
import GuidePage from '../../../components/GuidePage';
import { pageMetadata } from '../../../src/lib/seo';

const slug = 'respond-to-negative-google-reviews';

export const metadata = pageMetadata({
  title: 'How to Respond to Negative Google Reviews',
  description:
    'Reply to bad Google reviews calmly: a four-part structure, example replies for restaurants, salons, shops and clinics, and when Google removes reviews.',
  path: `/guides/${slug}`,
  type: 'article',
});

const sections = [
  {
    id: 'why-reply',
    title: 'Why replying matters more than the review itself',
    body: (
      <>
        <p>
          A single negative review rarely puts customers off on its own. What people look at is the pattern, and how you
          responded. A calm, specific reply tells everyone reading that problems get taken seriously. Silence, or an
          angry reply, tells them the opposite.
        </p>
        <p>
          Remember who the reply is really for. The reviewer has already made up their mind. The hundreds of people who
          read the review over the next year have not.
        </p>
      </>
    ),
  },
  {
    id: 'before-you-reply',
    title: 'Before you reply',
    body: (
      <>
        <ul>
          <li><strong>Wait until you are calm.</strong> Reply within a day or two, but not in the first ten minutes.</li>
          <li><strong>Check what happened.</strong> Talk to the staff on shift and look at the bill or booking if you can.</li>
          <li><strong>Decide what you can offer.</strong> A call, a replacement, a refund, or simply an explanation.</li>
          <li><strong>Keep private details private.</strong> Do not share phone numbers, bill amounts or anything personal in a public reply.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'structure',
    title: 'A simple four-part structure',
    body: (
      <>
        <ol>
          <li><strong>Thank them</strong> for taking the time to write.</li>
          <li><strong>Acknowledge the specific problem</strong> in their words, without arguing about details.</li>
          <li><strong>Say what you are doing</strong> about it, or what has already changed.</li>
          <li><strong>Offer a way to talk</strong> privately, and sign with a real name.</li>
        </ol>
        <p>Keep it to three or four sentences. Long replies read as defensive.</p>
      </>
    ),
  },
  {
    id: 'examples',
    title: 'Example replies you can adapt',
    body: (
      <>
        <h3>Restaurant: slow service</h3>
        <blockquote>
          Thank you for telling us, Rahul. A 40-minute wait for mains on a Saturday is not acceptable, and we are sorry
          your evening was spoiled. We have added a second person to the kitchen pass on weekends. If you are open to
          it, please message us on our number on Google and we would like to make it up to you. Anita, Manager
        </blockquote>
        <h3>Salon: unhappy with the result</h3>
        <blockquote>
          Thank you for the honest feedback, Priya. We are sorry the colour did not turn out as you hoped. We would like
          to fix it at no charge with our senior colourist. Please call the salon and ask for Meera. Meera, Owner
        </blockquote>
        <h3>Shop: return or billing problem</h3>
        <blockquote>
          Thank you for letting us know. You should not have been told that exchanges were not possible; our policy
          allows exchanges within seven days with the bill. Please visit us or call, and we will sort it out straight
          away. Arjun, Store Manager
        </blockquote>
        <h3>Clinic: long waiting time</h3>
        <blockquote>
          Thank you for your feedback about waiting times. We are sorry for the delay you experienced. We are reviewing
          how appointments are scheduled in the evenings. Please contact the front desk if you would like to discuss it.
          Clinic Manager
        </blockquote>
        <div className="note">
          <p>
            Clinics and doctors should never confirm in a reply that the reviewer is a patient, or mention any medical
            details, even if the reviewer did. Keep replies general and move the conversation offline.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'what-to-avoid',
    title: 'What to avoid',
    body: (
      <>
        <ul>
          <li>Arguing about facts in public, or calling the reviewer a liar.</li>
          <li>Copy-pasting the same reply under every review.</li>
          <li>Offering a discount in exchange for removing or changing the review.</li>
          <li>Revealing personal information about the customer.</li>
          <li>Replying from a personal account instead of the business account.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'removal',
    title: 'When you can ask Google to remove a review',
    body: (
      <>
        <p>
          Google will not remove a review just because it is negative or you disagree with it. It can remove reviews that
          break its policies, for example reviews that are:
        </p>
        <ul>
          <li>Spam or fake, including reviews from people who were never customers.</li>
          <li>Off-topic, such as political rants or complaints about a different business.</li>
          <li>Written by a competitor or a former employee with a conflict of interest.</li>
          <li>Harassing, hateful, or containing personal information or explicit content.</li>
        </ul>
        <p>
          To report one, open the review on Google Maps or in your Business Profile, choose the option to report it, and
          pick the reason that fits. Google reviews the report; it can take several days.
        </p>
      </>
    ),
  },
  {
    id: 'hear-it-first',
    title: 'Hear about problems before they become reviews',
    body: (
      <>
        <p>
          The best negative review is the one you fixed while the customer was still in the shop. That is why Reviewwo
          QR codes give every customer a private way to message the manager, alongside the option to post on Google. The
          message arrives on the manager’s WhatsApp straight away, so someone can walk over and help.
        </p>
        <p>
          Customers stay free to post a public review too. Fixing the problem quickly just makes it more likely that the
          review they write is a fair one. See <Link href="/how-it-works">how it works</Link>.
        </p>
      </>
    ),
  },
];

const faqs = [
  {
    q: 'Should I reply to every negative Google review?',
    a: 'Yes. Replying to every review, positive or negative, shows future customers that you listen. Prioritise negative reviews and reply within a day or two.',
  },
  {
    q: 'Can I delete a negative Google review?',
    a: 'No. Business owners cannot delete reviews. You can report a review that breaks Google’s policies, and Google decides whether to remove it.',
  },
  {
    q: 'Can a customer change their review after I reply?',
    a: 'Yes. Customers can edit or delete their own reviews at any time. Many update a review after a problem is fixed, but you should never ask them to in exchange for something.',
  },
  {
    q: 'Can I edit my reply later?',
    a: 'Yes. You can edit or delete your reply from your Business Profile or the Google Maps app.',
  },
];

export default function Page() {
  return (
    <GuidePage
      slug={slug}
      lead="A good reply to a bad review can win back the customer and reassure everyone who reads it later. Here is a simple structure, example replies for different businesses, and what to do if a review breaks Google’s rules."
      sections={sections}
      faqs={faqs}
    />
  );
}
