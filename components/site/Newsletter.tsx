'use client';

import { useState } from 'react';
import { site } from '@/content/site';
import styles from './Newsletter.module.css';

interface Props {
  variant?: 'panel' | 'bare';
  heading?: string;
  sub?: string;
  /** Heading level, so the component slots into any page outline correctly. */
  as?: 'h2' | 'h3';
}

/**
 * Signup.
 *
 * If NEXT_PUBLIC_NEWSLETTER_ACTION is configured the form does a plain,
 * old-fashioned POST to the provider — no JavaScript SDK, no third-party
 * script, nothing that runs before the reader has asked for it.
 *
 * If it is not configured we do not render a button that pretends to work.
 * The reader gets a real mailto instead.
 */
export function Newsletter({
  variant = 'panel',
  heading = site.newsletter.heading,
  sub = site.newsletter.sub,
  as: Heading = 'h2',
}: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const configured = Boolean(site.newsletter.action);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!email.includes('@') || email.trim().length < 5) {
      event.preventDefault();
      setError('That does not look like an email address.');
      return;
    }
    setError('');
    // Configured: let the browser POST to the provider natively.
  };

  return (
    <div className={styles.root} data-variant={variant}>
      <div className={styles.head}>
        <Heading className={styles.heading}>{heading}</Heading>
        <p className={styles.sub}>{sub}</p>
      </div>

      {configured ? (
        <>
          <form
            className={styles.form}
            action={site.newsletter.action}
            method="post"
            target="_blank"
            rel="noopener"
            onSubmit={onSubmit}
            noValidate
          >
            <div className={styles.field}>
              <label className="u-sr" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                className={styles.input}
                type="email"
                name={site.newsletter.field}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError('');
                }}
                placeholder="you@example.com"
                autoComplete="email"
                required
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'newsletter-error' : 'newsletter-note'}
              />
            </div>
            <button type="submit" className={styles.submit}>
              Subscribe
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                <path d="M0 5h12M8.5 1 12.5 5l-4 4" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </button>
          </form>

          {error && (
            <p className={styles.error} id="newsletter-error" role="alert">
              {error}
            </p>
          )}
        </>
      ) : (
        <a
          className={styles.fallback}
          href={`mailto:${site.email.subscribe}?subject=${encodeURIComponent('Subscribe')}&body=${encodeURIComponent('Please add this address to the Continuum list.')}`}
        >
          Email to subscribe
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
            <path d="M0 5h12M8.5 1 12.5 5l-4 4" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </a>
      )}

      <p className={styles.note} id="newsletter-note">
        {configured
          ? 'Your address is used for the research note and nothing else. One email when we publish. Unsubscribe from the footer of any issue. '
          : `Send a blank email to ${site.email.subscribe} and we will add you. Your address is used for the research note and nothing else. `}
        <a href="/privacy/">How we handle it</a>.
      </p>
    </div>
  );
}
