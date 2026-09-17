import type { Metadata } from 'next';
import Link from 'next/link';

import { site } from '@/content/site';
import { deskStats } from '@/content/articles';
import { breadcrumbSchema, JsonLd, pageMeta } from '@/lib/seo';
import { Callout, ContentsRail, NumberedSection, PageHeader } from '@/components/site/PageHeader';
import styles from '@/components/site/Page.module.css';

export const metadata: Metadata = pageMeta({
  title: 'Methods',
  description:
    'How a Continuum note is built: primary documents, secondary sources, extraction, arithmetic checks, evidence mapping, adversarial review, human approval and corrections.',
  path: '/methods/',
});

const STAGES = [
  {
    id: 'primary-documents',
    title: 'Primary documents',
    body: (
      <>
        <p>
          Work starts at the document, not at the coverage of it. Annual reports, regulatory
          returns, filings, circulars, published datasets — whatever the question actually rests
          on. Where several articles cite the same figure, the job is to find the original, because
          four articles tracing back to one source are one source.
        </p>
        <p>
          We do not cite a source we have not opened. Documents are archived when they are
          collected, so the evidence survives if the page does not, and every figure carries the
          date of the thing it measures rather than the date the source was published.
        </p>
        <p>
          Where a document reached us through a mirror rather than the issuer&rsquo;s own site, we
          say so and confirm it against the original.
        </p>
      </>
    ),
  },
  {
    id: 'secondary-sources',
    title: 'Secondary sources',
    body: (
      <>
        <p>
          Reporting, trade press and aggregators are read early — not for what they establish, but
          for what they leave unanswered and what they repeat without checking. A secondary source
          is evidence of what was published. It is never evidence of what a primary document means.
        </p>
        <p>
          When a note assesses published coverage, each figure is judged against the primary
          document alone and given one of four verdicts: correct, ambiguous, misleading or
          incorrect. We say plainly when an outlet got it right — that obligation is as real as the
          other one.
        </p>
      </>
    ),
  },
  {
    id: 'extraction',
    title: 'Extraction',
    body: (
      <>
        <p>
          Figures are pulled cell by cell and recorded with the page, table, sheet or cell they came
          from. A citation that names a document but not a location inside it is not a citation, so
          the locator is a required field rather than a nicety.
        </p>
        <p>
          Where a document is paginated twice — a printed page number and a PDF index that disagree
          — both are recorded, and the printed number is the one quoted. Where a report&rsquo;s own
          index gives a table a different title from the table itself, we quote the table.
        </p>
      </>
    ),
  },
  {
    id: 'arithmetic',
    title: 'Arithmetic checks',
    body: (
      <>
        <p>
          Every extracted figure is read back against the source, and every sum is recomputed from
          the printed values rather than carried across. Where a document states a derived figure —
          an average, a ratio, a percentage — we reproduce it independently and report whether it
          comes out.
        </p>
        <p>
          Published analysis carries the working, in plain language, so you can repeat it in a
          spreadsheet without running anything of ours. If the method cannot be described in a way
          you could follow, the result does not get published.
        </p>
        <p>
          Our arithmetic is never presented in the same register as a figure printed by the source.
          Calculated figures are marked as calculated.
        </p>
      </>
    ),
  },
  {
    id: 'evidence-mapping',
    title: 'Evidence mapping',
    body: (
      <>
        <p>
          Before anything is written, every factual claim the note will make goes into a table with
          its source, its location, what it proves, and — the column that does the most work — what
          it does <em>not</em> prove. Claims that are not in that table do not go in the note.
        </p>
        <p>
          Each row carries a competing interpretation where one exists, a risk level, and a
          publish decision: publish, publish with a caveat, or do not publish. Rows marked{' '}
          <em>do not publish</em> stay out even when they are the most quotable thing in the file.
          The matrix is closed before drafting begins; adding a row after closure requires a second
          adversarial pass.
        </p>
      </>
    ),
  },
  {
    id: 'adversarial-review',
    title: 'Adversarial review',
    body: (
      <>
        <p>
          We search deliberately for evidence that our own conclusion is wrong. This is a required
          stage, not an optional one, and it has changed what notes say.
        </p>
        <p>
          The strongest case against the finding is written out in the terms someone who holds that
          view would accept, and it appears in the body of the note rather than in a footnote at the
          bottom. Where the strongest counter-evidence sits inside our own source material, it is
          named and shown at full strength.
        </p>
        <p>
          We do not manufacture balance. If the evidence is one-sided we say so. And we are willing
          to leave a question unresolved — when we do, we name the specific evidence that would
          resolve it.
        </p>
      </>
    ),
  },
  {
    id: 'human-approval',
    title: 'Human approval',
    body: (
      <>
        <p>
          Every note is read and approved by a person before publication. Nothing is published
          automatically. A person decides what to publish, verifies claims against the original
          sources independently, makes every judgement about fairness and legal risk, and writes
          every correction.
        </p>
        <p>
          Publication requires the evidence attached and the open questions stated. A note with a
          finding and no boundary on it is not finished.
        </p>
      </>
    ),
  },
  {
    id: 'corrections',
    title: 'Corrections',
    body: (
      <>
        <p>
          Confirmed errors are corrected within 48 hours. The note carries a dated notice saying what
          was wrong and what changed, and the change is added to the public{' '}
          <Link href="/corrections/">corrections ledger</Link> with the original wording printed
          beside the new one.
        </p>
        <p>
          Substantive claims are never changed silently. Typographical fixes and broken links are
          repaired without a note. Every challenge we receive is logged, whether or not we uphold
          it — and if we disagree with a challenge, we say why.
        </p>
      </>
    ),
  },
];

export default function MethodsPage() {
  const stats = deskStats();

  return (
    <div className={`u-shell ${styles.page}`}>
      <PageHeader
        kicker="Methods"
        title="How a note is built"
        deck="Eight stages from primary document to publication. They are described here in enough detail that you can check our work rather than trust it — which is the only kind of promise a publication without bylines can make."
        meta={[
          'Eight stages',
          `${stats.citations} citations published`,
          `${stats.unresolved} recorded as unresolved`,
        ]}
      />

      <div className={styles.body}>
        <div className={styles.split}>
          <ContentsRail items={STAGES.map((s) => ({ id: s.id, title: s.title }))} />

          <div className={styles.sections}>
            {STAGES.map((stage, index) => (
              <NumberedSection
                key={stage.id}
                id={stage.id}
                index={index + 1}
                title={stage.title}
              >
                <div className="prose prose--wide">{stage.body}</div>
              </NumberedSection>
            ))}

            <section id="ai-assistance" className={styles.section} data-reveal>
              <header className={styles.sectionHead}>
                <span className={styles.sectionIndex}>09</span>
                <h2 className={styles.sectionTitle}>Where AI assistance sits in this</h2>
              </header>

              <div className="prose prose--wide">
                <p>
                  Continuum is one publisher working with an AI research and drafting system
                  (Claude, made by Anthropic). It is not a newsroom, and it will not describe itself
                  as one. You should know exactly what that means in practice.
                </p>

                <dl>
                  <dt>The AI does</dt>
                  <dd>
                    Web research and source retrieval; reading and summarising documents that are
                    then checked; building the claim-and-source table behind each note; drafting and
                    editing; running structured checks for accuracy, sourcing and language; and
                    proposing angles.
                  </dd>

                  <dt>A person does</dt>
                  <dd>
                    Deciding what to publish; independently verifying claims against original
                    sources; approving every note before it goes out; every judgement about
                    fairness, legal risk and whether a topic is worth doing; and writing and
                    approving all corrections.
                  </dd>

                  <dt>The AI is not permitted to</dt>
                  <dd>
                    Invent statistics, quotations, sources, studies, events or examples. Write
                    anything implying we were present at an event or observed something directly.
                    Cite a source that was not opened and read. Publish anything without human
                    approval. Decide that a claim is verified without a located source. Write
                    corrections. Or use a first-person singular voice — there is no person behind
                    these notes, and we will not invent one.
                  </dd>
                </dl>

                <p>
                  What this page does not do is publish the prompts, the internal drafting notes or
                  the model&rsquo;s intermediate reasoning. Those are working materials, and they are
                  not evidence of anything. What is offered instead is the thing that can actually be
                  checked: every claim, its document, and the exact location inside it.
                </p>
              </div>
            </section>

            <Callout label="If you think we have got something wrong">
              Write to us at <a href={`mailto:${site.email.corrections}`}>{site.email.corrections}</a>{' '}
              with the note, the specific sentence, what you think is wrong, and the source you think
              we should have used. We go to the row in the evidence table behind that sentence. If our
              source does not support what we wrote, or if you have a better one, we correct it and log
              it. See <Link href="/standards/">editorial standards</Link> and{' '}
              <Link href="/corrections/">corrections</Link>.
            </Callout>
          </div>
        </div>
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: site.shortName, path: '/' },
          { name: 'Methods', path: '/methods/' },
        ])}
      />
    </div>
  );
}
