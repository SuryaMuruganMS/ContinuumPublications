import type { Metadata } from 'next';
import Link from 'next/link';

import { site } from '@/content/site';
import { breadcrumbSchema, JsonLd, pageMeta } from '@/lib/seo';
import { Callout, ContentsRail, NumberedSection, PageHeader } from '@/components/site/PageHeader';
import styles from '@/components/site/Page.module.css';

export const metadata: Metadata = pageMeta({
  title: 'Privacy',
  description:
    'What Continuum Publications collects, which is very little: no analytics, no tracking cookies, no third-party scripts.',
  path: '/privacy/',
});

const SECTIONS = [
  { id: 'summary', title: 'The short version' },
  { id: 'site', title: 'Visiting the site' },
  { id: 'newsletter', title: 'The newsletter' },
  { id: 'email', title: 'Emailing us' },
  { id: 'third-parties', title: 'Third parties' },
  { id: 'rights', title: 'Your rights' },
];

export default function PrivacyPage() {
  const configuredNewsletter = Boolean(site.newsletter.action);

  return (
    <div className={`u-shell ${styles.page}`}>
      <PageHeader
        kicker="Privacy"
        title="What we collect, which is very little"
        deck="This site has no analytics, no tracking cookies, no advertising and no third-party scripts. That is not a promise about the future — it is a description of what is served to your browser today."
        meta={['No analytics', 'No tracking cookies', 'No advertising']}
      />

      <div className={styles.body}>
        <div className={styles.split}>
          <ContentsRail items={SECTIONS} />

          <div className={styles.sections}>
            <NumberedSection id="summary" index={1} title="The short version">
              <div className="prose prose--wide">
                <dl>
                  <dt>Analytics</dt>
                  <dd>None. We do not know how many people read a note, and we are content not to.</dd>

                  <dt>Cookies</dt>
                  <dd>
                    None set by us. There is no consent banner because there is nothing to consent
                    to.
                  </dd>

                  <dt>Third-party scripts</dt>
                  <dd>
                    None. Fonts are self-hosted, so your browser does not contact a font service to
                    render this page.
                  </dd>

                  <dt>Local storage</dt>
                  <dd>
                    One entry, <code>continuum:motion</code>, if you use the motion toggle in the
                    footer. It stays in your browser and is never transmitted.
                  </dd>

                  <dt>Personal data we hold</dt>
                  <dd>
                    Your email address, if you subscribe. Whatever you write to us, if you write to
                    us. Nothing else.
                  </dd>
                </dl>
              </div>
            </NumberedSection>

            <NumberedSection id="site" index={2} title="Visiting the site">
              <div className="prose prose--wide">
                <p>
                  The site is static: every page is a file, served as it was built. There is no
                  application server, no database of readers and no login.
                </p>
                <p>
                  Whoever hosts the files will keep standard server logs, which typically include IP
                  addresses, timestamps and requested URLs. That is a function of how the web works
                  rather than a choice we make, and we do not use those logs to build a picture of
                  any reader. They are held by the host under its own retention policy.
                </p>
                <p>
                  The motion toggle in the footer writes a single value to your browser&rsquo;s
                  local storage so the site remembers your preference. Clearing your site data
                  removes it. If you never touch the toggle, nothing is written.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="newsletter" index={3} title="The newsletter">
              <div className="prose prose--wide">
                {configuredNewsletter ? (
                  <>
                    <p>
                      If you subscribe, your email address is held by our email provider for the
                      purpose of sending you the research note. It is used for that and nothing
                      else. We do not sell it, rent it, or pass it to anyone for advertising.
                    </p>
                    <p>
                      The signup form is a plain form submission to the provider. No third-party
                      JavaScript runs on this site to make it work.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      No email service is currently connected to this site. Subscribing means
                      emailing{' '}
                      <a href={`mailto:${site.email.subscribe}`}>{site.email.subscribe}</a>, and
                      your address is held in that mailbox for the purpose of sending you the
                      research note.
                    </p>
                    <p>
                      When an email service is connected, this section will be updated to name what
                      it is and what it holds, before the first issue is sent through it.
                    </p>
                  </>
                )}
                <p>
                  We do not publish subscriber numbers. Unsubscribing removes the address; there is
                  an unsubscribe link in every issue, and you can also just ask us.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="email" index={4} title="Emailing us">
              <div className="prose prose--wide">
                <p>
                  The <Link href="/contact/">contact page</Link> does not send anything. It composes
                  a message in your own email application, and nothing reaches us until you press
                  send there. There is no form service in the middle and no draft is stored.
                </p>
                <p>
                  When you do write to us, we keep the correspondence for as long as it is useful —
                  corrections and challenges are logged as a matter of editorial policy, and that
                  log records the substance of the challenge rather than your personal details. If
                  you would rather we did not keep your address, say so and we will delete it once
                  the exchange is finished.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="third-parties" index={5} title="Third parties">
              <div className="prose prose--wide">
                <p>
                  Share links on a note are ordinary links to each service&rsquo;s own share URL.
                  Nothing from those services is loaded into this page, and they learn nothing about
                  you unless you click.
                </p>
                <p>
                  Links to source documents point at the issuing body&rsquo;s own site. Once you
                  follow one you are on their site under their policy, not ours.
                </p>
                <p>
                  The two parties that necessarily see something are the host that serves these
                  files and, if you subscribe, the email provider. We do not add any others.
                </p>
              </div>
            </NumberedSection>

            <NumberedSection id="rights" index={6} title="Your rights">
              <div className="prose prose--wide">
                <p>
                  You can ask what we hold about you, ask for it to be corrected, or ask for it to
                  be deleted. Given the above, the answer is usually short: an email address, or an
                  exchange of messages.
                </p>
                <p>
                  Write to <a href={`mailto:${site.email.general}`}>{site.email.general}</a>. We aim
                  to answer within a week.
                </p>
              </div>

              <Callout label="If this page ever stops being true">
                We would have to add something — an analytics script, an embed, an advertising
                partner — for it to stop being true. If that happens, this page will say so before
                the change goes live, and it will name what was added and why.
              </Callout>
            </NumberedSection>
          </div>
        </div>
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: site.shortName, path: '/' },
          { name: 'Privacy', path: '/privacy/' },
        ])}
      />
    </div>
  );
}
