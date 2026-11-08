import { SiteShell, PageIntro, Article, FaqSection, CtaBand, JsonLd } from './content';
import { articleSchema, UPDATED } from '../src/lib/seo';
import { guideBySlug, relatedGuides } from '../src/content/guides';

export default function GuidePage({ slug, lead, sections, faqs, extraRelated = [] }) {
  const guide = guideBySlug(slug);
  const path = `/guides/${slug}`;
  const updated = new Date(UPDATED).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <SiteShell>
      <JsonLd data={articleSchema({ title: guide.title, description: guide.description, path })} />
      <PageIntro
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: guide.short, path },
        ]}
        title={guide.title}
        lead={lead}
      >
        <p className="mt-5 text-sm text-ink-subtle">
          Updated {updated}. {guide.readMinutes} minute read.
        </p>
      </PageIntro>
      <Article sections={sections} related={[...extraRelated, ...relatedGuides(slug)]} />
      {faqs && <FaqSection faqs={faqs} tinted />}
      <CtaBand />
    </SiteShell>
  );
}
