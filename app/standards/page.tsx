import type { Metadata } from 'next';
import Link from 'next/link';

import { site } from '@/content/site';
import { deskEvidenceTotals } from '@/content/articles';
import { evidenceOrder, evidenceStates } from '@/content/evidence-states';
import { pad } from '@/lib/format';
import { breadcrumbSchema, JsonLd, pageMeta } from '@/lib/seo';
import { Callout, ContentsRail, NumberedSection, PageHeader } from '@/components/site/PageHeader';
import styles from '@/components/site/Page.module.css';
import research from '@/components/site/Research.module.css';

export const metadata: Metadata = pageMeta({
  title: 'Editorial standards',
  description:
    'What Continuum Publications publishes and will not publish: evidence, sourcing, certainty, interpretation, corrections, conflicts, AI assistance and editorial independence.',
  path: '/standards/',
});

const SECTIONS = [
  { id: 'what-we-publish', title: 'What we publish' },
  { id: 'evidence', title: 'Evidence and certainty' },
  { id: 'sourcing', title: 'Sourcing' },
  { id: 'uncertainty', title: 'Uncertainty' },
  { id: 'interpretation', title: 'Interpretation and disagreement' },
  { id: 'quotation', title: 'Quotation and copyright' },
  { id: 'corrections', title: 'Corrections' },
  { id: 'conflicts', title: 'Conflicts of interest' },
  { id: 'independence', title: 'Independence and AI assistance' },
  { id: 'challenge', title: 'How to challenge a claim' },
];

export default function StandardsPage() {
  const totals = deskEvidenceTotals();

  return (
    <div className={`u-shell ${styles.page}`}>
      <PageHeader
        kicker="Editorial standards"
        title="What we will and will not print"
        deck="We have no bylines. That means the usual way of judging a publication — who wrote this, and what do they know — is not available to you. Everything below is written to give you a different basis for judgement: you should be able to check our work rather than trust it."
        meta={['Version 1.0', `Last updated ${new Date().getUTCFullYear()}`, 'Applies to every note']}
      />

      <div className={styles.body}>
        <div className={styles.split}>
          <ContentsRail items={SECTIONS} />

          <div className={styles.sections}>
            <NumberedSection id="what-we-publish" index={1} title="What we publish">
              <div className="prose prose--wide">
                <p>Four kinds of note, and nothing else.</p>
                <ul>
                  <li>
                    <strong>Analysis of public data.</strong> We open published datasets and count
                    what is in them.
                  </li>
                  <li>
                    <strong>Claim tracing.</strong> We follow a widely repeated figure back to the
                    source it came from, and report what that source actually says.
                  </li>
                  <li>
                    <strong>Document reporting.</strong> We read a primary document in full and
                    report its contents, including the parts summaries leave out.
                  </li>
                  <li>
                    <strong>Assembly.</strong> We combine scattered evidence into a single account
                    where no one source gives you one.
                  </li>
                </ul>
                <p>
                  We do not publish opinion, prediction, product recommendations, or personal
                  advice. We do not report on named private individuals. We do not publish pieces
                  whose value is a rearrangement of coverage that already exists. Nothing on this
                  site is investment, legal or financial advice.
                </p>
                <p>
                  If a note&rsquo;s central finding is that the commonly accepted account is
                  correct, we publish it. That is a result, not a failure.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="evidence" index={2} title="Evidence and certainty">
              <div className="prose prose--wide">
                <p>
                  We use a fixed vocabulary to mark how strong a claim is. The words mean the same
                  thing in every note, so you can read our confidence off the page without
                  interpreting our tone. Each one is attached to the claim it governs, in the text,
                  and is countable.
                </p>
              </div>

              <div className={research.totals} style={{ marginTop: '1.5rem' }}>
                <p className={research.totalsHead}>The five states, and what the desk holds</p>
                <div className={research.totalsGrid}>
                  {evidenceOrder.map((kind) => (
                    <div key={kind} className={research.totalsCell} data-kind={kind}>
                      <span className={research.totalsValue}>{pad(totals[kind], 2)}</span>
                      <span className={research.totalsLabel}>{evidenceStates[kind].label}</span>
                      <span className={research.totalsDefinition}>
                        {evidenceStates[kind].definition}
                      </span>
                    </div>
                  ))}
                </div>
                <p className={research.totalsFoot}>
                  Counted from the sources attached to every published note. Nothing here is typed
                  in by hand.
                </p>
              </div>

              <div className="prose prose--wide" style={{ marginTop: '1.5rem' }}>
                <dl>
                  {evidenceOrder.map((kind) => (
                    <div key={kind} style={{ display: 'contents' }}>
                      <dt>{evidenceStates[kind].label}</dt>
                      <dd>{evidenceStates[kind].standard}</dd>
                    </div>
                  ))}
                </dl>
                <p>
                  Two things are worth knowing about <em>unresolved</em>. It describes our search,
                  not the state of the world. And when nobody has ever measured something, we say
                  that in plain words instead of marking it unresolved.
                </p>
                <p>Every number we publish carries the date of the thing it measures.</p>
              </div>
            </NumberedSection>

            <NumberedSection id="sourcing" index={3} title="Sourcing">
              <div className="prose prose--wide">
                <p>
                  We rank sources by how well they fit the specific claim, not by prestige. A
                  company&rsquo;s own documentation is authoritative for what the company says it
                  does, and tells you nothing about whether it works.
                </p>
                <p>
                  In rough order of preference: primary documents and official records; original
                  research with a published method; institutional and government sources; direct
                  company documentation; reporting from outlets with a corrections policy;
                  identified expert commentary; and community or practitioner sources, which we use
                  only as evidence that a view exists, never as evidence that it is correct.
                </p>
                <ul>
                  <li>We do not cite a source we have not opened.</li>
                  <li>We check that the passage we cite says what we say it says.</li>
                  <li>If four sources all trace back to one source, that is one source, and we say so.</li>
                  <li>We archive sources when we collect them, so the evidence survives if the page does not.</li>
                  <li>Where a source has an interest in the finding, we say whose interest it is.</li>
                </ul>
              </div>
            </NumberedSection>

            <NumberedSection id="uncertainty" index={4} title="Uncertainty">
              <div className="prose prose--wide">
                <p>We state it where the claim is, not in a note at the bottom.</p>
                <p>
                  When we could not obtain something, we say so in the note, in the place where that
                  evidence would have been used. If we requested data and did not receive it, that
                  appears in the text.
                </p>
                <p>
                  When we publish original analysis, we name the single assumption that, if wrong,
                  would break the finding. Not a general caveat — the specific point of failure.
                </p>
                <p>
                  We do not hedge uniformly. Applying the same doubt to a strong source and a weak
                  one is not caution; it is a failure to tell you which is which.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="interpretation" index={5} title="Interpretation and disagreement">
              <div className="prose prose--wide">
                <p>
                  Where a number or finding is ours rather than a source&rsquo;s, we say so and
                  describe how we produced it. Our own analysis is never presented in the same
                  register as a documented fact from a primary source. Where we are interpreting
                  evidence rather than reporting it, the note says which is which.
                </p>
                <p>
                  Where credible sources conflict, we say what each one measured, what method it
                  used, and what would settle the difference. Often the disagreement turns out to be
                  two sources answering different questions, and we say that rather than presenting
                  it as a contradiction.
                </p>
                <p>
                  We state the strongest case against our own conclusion, in the terms someone who
                  holds that view would recognise, before we respond to it. We do not manufacture
                  balance. And we are willing to leave a question unresolved — when we do, we name
                  the specific evidence that would resolve it.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="quotation" index={6} title="Quotation and copyright">
              <div className="prose prose--wide">
                <p>
                  Quotations are short, exact, and attributed with enough detail for you to find the
                  original. We do not paraphrase inside quotation marks, and we do not stitch
                  fragments from different parts of a document into a single quote. Where we cut
                  words, we mark the cut, and we do not cut anything that changes the meaning.
                </p>
                <p>
                  Where the same phrase appears differently in two documents — a report and the
                  return behind it, say — we quote each to its own source and never merge them.
                </p>
                <p>
                  We quote briefly and attribute. We do not reproduce substantial portions of
                  anyone&rsquo;s work, and we do not reconstruct an article by summarising it
                  closely. Where we rely on a source, we link to it so you can read it in full
                  rather than reading our version of it.
                </p>
                <p>
                  Images are used only where they carry information — a chart we made from data we
                  describe, a reproduction of a table. We do not use stock photography as
                  decoration, and we do not use AI-generated images of real places, events or
                  people. Any hypothetical or invented example is labelled as such where it appears.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="corrections" index={7} title="Corrections">
              <div className="prose prose--wide">
                <p>
                  When we confirm an error, we correct it within 48 hours. The note carries a dated
                  notice saying what was wrong and what changed, and the correction is added to the
                  public <Link href="/corrections/">corrections ledger</Link> with the original
                  wording printed beside the new one.
                </p>
                <p>
                  We do not silently change substantive claims. Typographical fixes and broken links
                  are repaired without a note. We log every challenge we receive, whether or not we
                  uphold it.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="conflicts" index={8} title="Conflicts of interest">
              <div className="prose prose--wide">
                <p>
                  We disclose any financial, commercial or personal interest in a subject we cover,
                  in the note itself, at the top. We do not accept payment, gifts or access in
                  exchange for coverage, and we do not take payment for links. Where a source has an
                  interest in the finding — including where it is the body being examined — we say
                  so at the point we cite it.
                </p>
                <p>
                  We do not currently publish sponsored content or affiliate links. If that changes,
                  sponsored material will be labelled in the headline area, before the note begins,
                  and will not be written in our editorial voice; affiliate links will be disclosed
                  at the top of the note rather than in a footer.
                </p>
                <Callout label="Status">
                  We have no commercial relationships to disclose. No monetisation decisions have
                  been made. If that changes, this page will be updated before the first affected
                  note is published.
                </Callout>
              </div>
            </NumberedSection>

            <NumberedSection id="independence" index={9} title="Independence and AI assistance">
              <div className="prose prose--wide">
                <p>
                  Continuum is independent. It is one publisher working with an AI research and
                  drafting system, and it is not a newsroom. No page, note or promotional text will
                  imply reporters, correspondents, bureaus or a team, because there are none.
                </p>
                <p>
                  Every note is read and approved by a person before publication. No note is
                  published automatically. The full division of labour — what the AI does, what a
                  person does, and what the AI is not permitted to do — is set out on{' '}
                  <Link href="/methods/#ai-assistance">Methods</Link>.
                </p>
                <p>
                  If you ever find text on this site that implies first-hand experience of an event,
                  that is an error, and we want to hear about it.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="challenge" index={10} title="How to challenge a claim">
              <div className="prose prose--wide">
                <p>
                  Write to{' '}
                  <a href={`mailto:${site.email.corrections}`}>{site.email.corrections}</a>. It
                  helps if you include:
                </p>
                <ul>
                  <li>the note and the specific sentence</li>
                  <li>what you think is wrong</li>
                  <li>the source you think we should have used</li>
                </ul>
                <p>
                  We keep a table behind every note listing each claim, its source, and the exact
                  passage supporting it. When you challenge a claim, we go to that row. If our source
                  does not support what we wrote, or if you have a better one, we correct it and log
                  it. If we disagree with your challenge, we will tell you why. We log the challenge
                  either way.
                </p>
                <hr />
                <p className="small">
                  This page describes current practice. Where a policy is committed to but not yet
                  operating, we say so rather than describing an intention as a practice.
                </p>
              </div>
            </NumberedSection>
          </div>
        </div>
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: site.shortName, path: '/' },
          { name: 'Editorial standards', path: '/standards/' },
        ])}
      />
    </div>
  );
}
