import Link from 'next/link';
import GuidePage from '../../../components/GuidePage';
import { pageMetadata } from '../../../src/lib/seo';

const slug = 'google-review-policy';
const POLICY = 'https://support.google.com/contributionpolicy/answer/7400114';

export const metadata = pageMetadata({
  title: 'Google Review Rules for Businesses',
  description:
    'What businesses can and cannot do when asking for Google reviews: incentives, review gating, staff reviews, and what happens if you break the rules.',
  path: `/guides/${slug}`,
  type: 'article',
});

const sections = [
  {
    id: 'summary',
    title: 'The short version',
    body: (
      <>
        <p>Google wants reviews to reflect real experiences from real customers. In practice that means:</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Allowed</th>
                <th>Not allowed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Asking every customer to leave a review</td>
                <td>Asking only customers you expect to be happy</td>
              </tr>
              <tr>
                <td>Sending a direct link or showing a QR code</td>
                <td>Offering discounts, gifts or contest entries for reviews</td>
              </tr>
              <tr>
                <td>Giving customers ideas of what to mention</td>
                <td>Writing the review for them or posting on their behalf</td>
              </tr>
              <tr>
                <td>Offering a private way to raise a complaint</td>
                <td>Steering unhappy customers away from posting publicly</td>
              </tr>
              <tr>
                <td>Replying to every review</td>
                <td>Reviews from owners, staff, family or paid services</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          This guide is a plain-language summary, not legal advice. The rules that apply are Google’s own{' '}
          <a href={POLICY} target="_blank" rel="noreferrer">contribution policies</a>, which Google updates from time to
          time.
        </p>
      </>
    ),
  },
  {
    id: 'incentives',
    title: 'Incentives: no discounts or freebies for reviews',
    body: (
      <>
        <p>
          Google does not allow businesses to offer anything in exchange for a review. That includes a percentage off the
          next visit, a free dessert, loyalty points, a lucky draw entry, or a staff bonus tied to individual customers
          leaving reviews. It does not matter whether you ask for a positive review or “any honest review”: the reward is
          the problem.
        </p>
        <p>
          You can still thank customers in general and run promotions, as long as they are not conditional on a review.
        </p>
      </>
    ),
  },
  {
    id: 'review-gating',
    title: 'Review gating: ask everyone, not just happy customers',
    body: (
      <>
        <p>
          Review gating means checking whether a customer is happy first, then sending only the happy ones to Google and
          quietly sending everyone else somewhere private. Google’s policies say businesses should not discourage negative
          reviews or selectively ask for positive ones, which rules this out.
        </p>
        <p>
          A private feedback channel is not the problem. Many customers prefer to tell the manager directly, and that is
          good for everyone. The line is crossed when unhappy customers are not given the option to post publicly, or are
          not told that their message is private.
        </p>
        <div className="note">
          <p>
            Reviewwo’s review page shows the Google review option to every customer, whatever rating they choose. Customers who
            rate one to three stars are also invited to message the manager first, and the page tells them clearly that
            the message is private and is not posted on Google.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'writing-for-customers',
    title: 'The review has to be the customer’s own',
    body: (
      <>
        <p>
          Reviews must be written by the person who had the experience, from their own Google account. That rules out:
        </p>
        <ul>
          <li>Handing customers a finished paragraph to paste.</li>
          <li>Posting reviews from a shop phone or tablet on a customer’s behalf.</li>
          <li>Collecting feedback on paper and typing it into Google yourself.</li>
        </ul>
        <p>
          Prompts are fine. Asking “what stood out today, the food or the service?” helps people start, and they still
          choose their own words and their own star rating.
        </p>
      </>
    ),
  },
  {
    id: 'conflicts',
    title: 'Owners, staff and family',
    body: (
      <>
        <p>
          People with a conflict of interest should not review the business. That covers owners, current and former
          employees, relatives, and competitors reviewing each other. Google also removes reviews posted in bulk from the
          same device or network, which is one reason reviews written on a shop device tend to disappear.
        </p>
      </>
    ),
  },
  {
    id: 'consequences',
    title: 'What happens if the rules are broken',
    body: (
      <>
        <p>Google uses automated systems and manual review to find fake engagement. Depending on what it finds, it can:</p>
        <ul>
          <li>Remove the reviews it believes are fake or incentivised.</li>
          <li>Temporarily stop new reviews from being posted on the listing.</li>
          <li>In some regions, show a notice on the listing telling people that fake reviews were removed.</li>
          <li>Suspend the Business Profile in serious or repeated cases.</li>
        </ul>
        <p>
          Losing reviews you worked for, or having a warning on your listing, costs far more than the shortcut saved.
        </p>
      </>
    ),
  },
  {
    id: 'india',
    title: 'Rules in India',
    body: (
      <>
        <p>
          In 2022 the Bureau of Indian Standards published IS 19000:2022, a standard on how online consumer reviews
          should be collected, moderated and published. It covers the same ground as Google’s rules: reviews should be
          genuine, not paid for, and not selectively published. Consumer protection authorities in India have also
          taken a close interest in fake and misleading reviews.
        </p>
        <p>
          If you work in a regulated profession, such as medicine, check your professional body’s rules on testimonials
          and patient communication before asking for reviews.
        </p>
      </>
    ),
  },
  {
    id: 'doing-it-right',
    title: 'Getting more reviews the right way',
    body: (
      <>
        <p>
          The honest approach also works best over time: ask everyone, make it quick, and fix problems when you hear
          about them. Our guide on <Link href="/guides/get-more-google-reviews">how to get more Google reviews</Link>{' '}
          covers timing, wording and a weekly routine.
        </p>
      </>
    ),
  },
];

const faqs = [
  {
    q: 'Is it against Google’s rules to ask for reviews?',
    a: 'No. Asking customers for reviews is allowed. Google’s rules are about how you ask: you should ask everyone, not offer anything in return, and not write the review for them.',
  },
  {
    q: 'What is review gating?',
    a: 'Review gating is asking customers how they feel first and then only sending the happy ones to Google, while steering unhappy customers elsewhere. Google’s policies do not allow selectively soliciting positive reviews or discouraging negative ones.',
  },
  {
    q: 'Can I collect private feedback as well as Google reviews?',
    a: 'Yes, as long as every customer can still leave a public review and knows that private feedback is private. Offering both is common and helps you fix problems quickly.',
  },
  {
    q: 'Can my staff leave reviews for our business?',
    a: 'No. Current and former employees have a conflict of interest, and Google can remove their reviews.',
  },
];

export default function Page() {
  return (
    <GuidePage
      slug={slug}
      lead="Asking for reviews is allowed. How you ask is what matters. Here is a plain-language summary of Google’s rules for businesses, and how to stay on the right side of them."
      sections={sections}
      faqs={faqs}
    />
  );
}
