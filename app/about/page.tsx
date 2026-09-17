import type { Metadata } from 'next';
import Link from 'next/link';

import { site } from '@/content/site';
import { deskStats } from '@/content/articles';
import { pad } from '@/lib/format';
import { breadcrumbSchema, faqSchema, JsonLd, pageMeta } from '@/lib/seo';
import { Callout, ContentsRail, NumberedSection, PageHeader } from '@/components/site/PageHeader';
import styles from '@/components/site/Page.module.css';

export const metadata: Metadata = pageMeta({
  title: 'About',
  description:
    'Continuum Publications is an independent research desk. It reads Indian financial, regulatory and public documents, and reports what the evidence supports and what it does not.',
  path: '/about/',
});

const SECTIONS = [
  { id: 'what-this-is', title: 'What this is' },
  { id: 'what-it-is-not', title: 'What it is not' },
  { id: 'how-it-works', title: 'How it works' },
  { id: 'who-it-is-for', title: 'Who it is for' },
  { id: 'the-promise', title: 'The editorial promise' },
];

const FAQ = [
  {
    question: 'Who writes Continuum Publications?',
    answer:
      'Continuum is one publisher working with an AI research and drafting system. It has no bylines and no reporters. A person decides what to publish, verifies claims against original sources, and approves every note before it goes out.',
  },
  {
    question: 'Is Continuum Publications a newsroom?',
    answer:
      'No. It is an independent research desk run by one publisher. It has no reporters, correspondents or bureaus, and it will not describe itself as having them.',
  },
  {
    question: 'Does Continuum Publications give financial advice?',
    answer:
      'No. Continuum does not publish opinion, prediction, product recommendations or personal advice, and nothing on the site is investment, legal or financial advice.',
  },
];

export default function AboutPage() {
  const stats = deskStats();

  return (
    <div className={`u-shell ${styles.page}`}>
      <PageHeader
        kicker="About"
        title="An independent research desk"
        deck={site.positioning}
        meta={[
          `Operating since ${site.since}`,
          `${pad(stats.notes, 2)} notes`,
          `${pad(stats.documents, 2)} documents read`,
          'No bylines',
        ]}
      />

      <div className={styles.body}>
        <div className={styles.split}>
          <ContentsRail items={SECTIONS} />

          <div className={styles.sections}>
            <NumberedSection id="what-this-is" index={1} title="What this is">
              <div className="prose prose--wide">
                <p>
                  Continuum Publications reads Indian financial, regulatory and public documents —
                  annual reports, regulatory returns, filings, circulars, published datasets — and
                  reports what they support and what they do not.
                </p>
                <p>
                  Three words in that description are doing work.{' '}
                  <em>Reads</em>, rather than investigates, because investigation implies an
                  investigator and this publication has no person to be one.{' '}
                  <em>What the evidence supports</em>, rather than what the evidence really shows,
                  because the second commits every piece to a gap between the received account and
                  the truth, and plenty of worthwhile questions do not contain one.{' '}
                  <em>And what it does not</em>, because the limits of the evidence are the actual
                  product.
                </p>
                <p>
                  The work is to take questions where the public record contains an answer nobody
                  has assembled, assemble it, show the working, and state plainly where the record
                  runs out.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="what-it-is-not" index={2} title="What it is not">
              <div className="prose prose--wide">
                <p>
                  This is one publisher working with an AI research and drafting system. It is not a
                  newsroom and will never describe itself as one. There are no reporters, no
                  correspondents, no bureaus and no team, and no page on this site will imply
                  otherwise.
                </p>
                <p>
                  It is not a financial advice platform. It does not publish opinion, prediction,
                  product recommendations or personal advice, and nothing here is investment, legal
                  or financial advice. It does not report on named private individuals.
                </p>
                <p>
                  There are no bylines, and no invented ones. The usual way of judging a publication
                  — who wrote this, and what do they know — is not available to you here. Everything
                  about how the site is built is an attempt to give you a different basis for
                  judgement instead: every claim carries its document and the exact location inside
                  it, so you can check the work rather than trust it.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="how-it-works" index={3} title="How it works">
              <div className="prose prose--wide">
                <p>
                  AI-assisted tools support research, extraction, checking and drafting. Human
                  editorial judgement determines what gets published. Every note is read and
                  approved by a person before publication, and nothing is published automatically.
                </p>
                <p>
                  The full division of labour is written out on{' '}
                  <Link href="/methods/#ai-assistance">Methods</Link>, including the list of things
                  the AI is not permitted to do — inventing sources or statistics, citing anything
                  that was not opened and read, writing corrections, or using a first-person
                  singular voice.
                </p>
                <p>
                  Every claim on this site resolves to one of five evidence states, attached to the
                  claim in the text and countable:{' '}
                  <Link href="/standards/#evidence">documented, calculated, analysis, reported or
                  unresolved</Link>. The last one is not a hedge — it records a specific question,
                  the documents that were searched, and the fact that the answer was not in them.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="who-it-is-for" index={4} title="Who it is for">
              <div className="prose prose--wide">
                <p>
                  The reader is someone who has to act on a factual question and has found that
                  existing coverage does not let them. The person deciding whether a figure they are
                  about to cite means what they think it means. The person who needs to know whether
                  a rule applies to their case. The person who suspects a widely quoted number is
                  being used to answer a question it does not answer.
                </p>
                <p>
                  Readers looking for a general orientation on a topic they have no stake in are
                  well served elsewhere, and serving them would pull this desk toward the explainer
                  format. That is not what this is.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="the-promise" index={5} title="The editorial promise">
              <div className="prose prose--wide">
                <p>
                  Six commitments. Each one is checkable by a reader, which is the only kind of
                  promise a publication without bylines can make.
                </p>
                <ol>
                  <li>Every load-bearing claim names its source before it states its content.</li>
                  <li>Every figure carries the date of the thing it measures.</li>
                  <li>
                    Where we failed to obtain evidence, that failure appears in the note, at the
                    point where the evidence would have been used.
                  </li>
                  <li>
                    Original analysis is published with the steps to reproduce it, not just the
                    result.
                  </li>
                  <li>Errors are corrected within 48 hours of confirmation, dated, and logged publicly.</li>
                  <li>
                    The strongest case against the note&rsquo;s conclusion appears inside the note,
                    in terms its proponents would accept.
                  </li>
                </ol>
              </div>

              <Callout label="Get in touch">
                Corrections, documents, and research questions all go to{' '}
                <a href={`mailto:${site.email.general}`}>{site.email.general}</a>, or through the{' '}
                <Link href="/contact/">contact page</Link>. We do not accept guest posts, sponsored
                placements or link requests.
              </Callout>
            </NumberedSection>
          </div>
        </div>
      </div>

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: site.shortName, path: '/' },
            { name: 'About', path: '/about/' },
          ]),
          faqSchema(FAQ),
        ]}
      />
    </div>
  );
}
