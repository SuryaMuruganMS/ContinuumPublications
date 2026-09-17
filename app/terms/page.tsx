import type { Metadata } from 'next';
import Link from 'next/link';

import { site } from '@/content/site';
import { breadcrumbSchema, JsonLd, pageMeta } from '@/lib/seo';
import { Callout, ContentsRail, NumberedSection, PageHeader } from '@/components/site/PageHeader';
import styles from '@/components/site/Page.module.css';

export const metadata: Metadata = pageMeta({
  title: 'Terms',
  description:
    'Terms of use for Continuum Publications: what the site is, what it is not, how our work may be reused, and the limits of what we warrant.',
  path: '/terms/',
});

const SECTIONS = [
  { id: 'what-this-is', title: 'What this site is' },
  { id: 'not-advice', title: 'Not advice' },
  { id: 'accuracy', title: 'Accuracy and corrections' },
  { id: 'reuse', title: 'Using our work' },
  { id: 'source-documents', title: 'Source documents' },
  { id: 'liability', title: 'Liability' },
  { id: 'changes', title: 'Changes' },
];

export default function TermsPage() {
  return (
    <div className={`u-shell ${styles.page}`}>
      <PageHeader
        kicker="Terms"
        title="Terms of use"
        deck="Plain terms for a site that publishes research notes and asks nothing of you in return. Reading this site means accepting what follows."
        meta={['Version 1.0', `Last updated ${new Date().getUTCFullYear()}`, 'Free to read']}
      />

      <div className={styles.body}>
        <div className={styles.split}>
          <ContentsRail items={SECTIONS} />

          <div className={styles.sections}>
            <NumberedSection id="what-this-is" index={1} title="What this site is">
              <div className="prose prose--wide">
                <p>
                  {site.name} is an independent research desk publishing notes on primary documents
                  and public data. Everything published here is free to read. There is no account,
                  no paywall and no subscriber-only tier.
                </p>
                <p>
                  The desk is one publisher working with an AI research and drafting system, as set
                  out on <Link href="/about/">About</Link> and{' '}
                  <Link href="/methods/#ai-assistance">Methods</Link>. It is not a newsroom and does
                  not claim to be.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="not-advice" index={2} title="Not advice">
              <div className="prose prose--wide">
                <p>
                  Nothing on this site is investment, financial, legal, tax or professional advice,
                  and nothing here is a recommendation to buy, sell or hold anything. We do not
                  publish opinion, prediction or product recommendations, and we do not offer
                  personalised guidance of any kind.
                </p>
                <p>
                  Notes examine documents. What you do with what a document says is your decision,
                  taken on your own responsibility and, where it matters, with advice from someone
                  qualified to give it.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="accuracy" index={3} title="Accuracy and corrections">
              <div className="prose prose--wide">
                <p>
                  Notes are checked against primary documents before publication, and every claim
                  carries the document and the location inside it. That is a method, not a
                  guarantee. Documents can be misread, and figures can be mis-extracted.
                </p>
                <p>
                  Where a note marks something as unresolved, that is exactly what it means: we
                  looked and did not find it. Do not read an unresolved marker as an implication.
                </p>
                <p>
                  Confirmed errors are corrected within 48 hours and recorded in the public{' '}
                  <Link href="/corrections/">corrections ledger</Link>. If you believe something is
                  wrong, <Link href="/contact/">tell us</Link> — that is the mechanism, and we use
                  it.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="reuse" index={4} title="Using our work">
              <div className="prose prose--wide">
                <p>
                  Quote us. Short extracts with attribution and a link back are welcome, and no
                  permission is needed for them.
                </p>
                <p>
                  What we ask, and it is the same thing we ask of ourselves: quote exactly, do not
                  paraphrase inside quotation marks, and do not stitch fragments from different
                  parts of a note into a single quote. If a note marks a figure as calculated,
                  analysis or unresolved, carry that distinction across. Detaching a figure from its
                  evidence state misrepresents it, which is the specific failure several of our
                  notes are about.
                </p>
                <p>
                  Do not republish a note in full, and do not reconstruct one by summarising it
                  closely. For syndication or anything beyond a short extract, write to{' '}
                  <a href={`mailto:${site.email.general}`}>{site.email.general}</a>.
                </p>
                <p>
                  Figures and tables we build from public data are ours; the underlying public data
                  is not, and carries its issuer&rsquo;s own terms.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="source-documents" index={5} title="Source documents">
              <div className="prose prose--wide">
                <p>
                  Documents we cite belong to the bodies that issued them and are subject to their
                  terms. We quote briefly, attribute, and link to the original so you can read it in
                  full rather than reading our version of it.
                </p>
                <p>
                  Links to external documents are provided because the evidence is there. We do not
                  control those sites, we are not responsible for their content, and a link is not
                  an endorsement.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="liability" index={6} title="Liability">
              <div className="prose prose--wide">
                <p>
                  This site is provided as it is. To the fullest extent permitted by law, we exclude
                  warranties of any kind, including that the site will be available without
                  interruption or that its content is free of error.
                </p>
                <p>
                  To the fullest extent permitted by law, we are not liable for loss arising from
                  reliance on anything published here. Nothing in these terms limits liability that
                  cannot be limited by law.
                </p>
                <p>
                  These terms are governed by the laws of India, and the courts of India have
                  jurisdiction over any dispute arising from them.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="changes" index={7} title="Changes">
              <div className="prose prose--wide">
                <p>
                  These terms may change. Substantive changes will be noted here with the date they
                  took effect, in the same spirit as the corrections policy: we do not rewrite a
                  page and act as though it always said that.
                </p>
              </div>

              <Callout label="Questions about any of this">
                Write to <a href={`mailto:${site.email.general}`}>{site.email.general}</a>. For
                editorial questions — how a claim was sourced, why something is marked unresolved —
                see <Link href="/standards/">editorial standards</Link>, which is the page that
                actually governs what gets published.
              </Callout>
            </NumberedSection>
          </div>
        </div>
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: site.shortName, path: '/' },
          { name: 'Terms', path: '/terms/' },
        ])}
      />
    </div>
  );
}
