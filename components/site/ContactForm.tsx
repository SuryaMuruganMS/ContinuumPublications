'use client';

import { useMemo, useState } from 'react';

import { site } from '@/content/site';
import { useCopy } from '@/hooks/useMotion';
import styles from './Contact.module.css';

/**
 * The contact composer.
 *
 * This is a static site with no backend and no form handler, and rather than
 * pretend otherwise, the form builds a real email in the reader's own client.
 * Nothing is transmitted to us until they press send, nothing is stored, and
 * there is no third-party form service in the middle of it.
 *
 * We ask for a category, a subject and a message. We do not ask for a name, a
 * phone number, an organisation or anything else we would not use.
 */

const CATEGORIES = [
  {
    key: 'correction',
    label: 'Correction',
    to: site.email.corrections,
    lead: 'Something on the site is wrong.',
    helps:
      'The note and the specific sentence, what you think is wrong, and the source you think we should have used.',
    template:
      'Note:\nSentence:\n\nWhat I think is wrong:\n\nThe source I think you should have used:\n',
  },
  {
    key: 'document',
    label: 'Source or document',
    to: site.email.documents,
    lead: 'You hold a document we should read.',
    helps:
      'What the document is, who issued it, and what you think it establishes. Tell us if it is already public.',
    template:
      'What the document is:\nWho issued it:\nDate:\n\nWhat I think it establishes:\n\nIs it already public?\n',
  },
  {
    key: 'question',
    label: 'Research question',
    to: site.email.general,
    lead: 'A figure or a rule you cannot get to the bottom of.',
    helps:
      'The figure or claim, where you saw it, and what you have already checked. The questions that work best are ones the public record can answer.',
    template:
      'The figure or claim:\nWhere I saw it:\n\nWhat I have already checked:\n\nWhat I still cannot establish:\n',
  },
  {
    key: 'professional',
    label: 'Professional enquiry',
    to: site.email.general,
    lead: 'Syndication, permissions, or something else.',
    helps:
      'We do not accept guest posts, sponsored placements or link requests, and we do not take payment for coverage.',
    template: '',
  },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]['key'];

export function ContactForm() {
  const [category, setCategory] = useState<CategoryKey>('correction');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [copied, copy] = useCopy();

  const active = CATEGORIES.find((c) => c.key === category)!;

  const mailto = useMemo(() => {
    const composedSubject = subject.trim() || `${active.label} — Continuum`;
    const body = message.trim() || active.template;
    return `mailto:${active.to}?subject=${encodeURIComponent(composedSubject)}&body=${encodeURIComponent(body)}`;
  }, [active, subject, message]);

  return (
    <div className={styles.root}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>What is this about?</legend>
        <div className={styles.categories}>
          {CATEGORIES.map((entry) => (
            <button
              key={entry.key}
              type="button"
              className={styles.category}
              aria-pressed={entry.key === category}
              onClick={() => {
                setCategory(entry.key);
                if (!message.trim()) setMessage('');
              }}
            >
              <span className={styles.categoryMark} aria-hidden="true" />
              <span className={styles.categoryLabel}>{entry.label}</span>
              <span className={styles.categoryLead}>{entry.lead}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <p className={styles.helps}>
        <span className={styles.helpsLabel}>It helps if you include</span>
        {active.helps}
      </p>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="contact-subject">
          Subject
        </label>
        <input
          id="contact-subject"
          className={styles.input}
          type="text"
          value={subject}
          placeholder={`${active.label} — Continuum`}
          onChange={(event) => setSubject(event.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          className={styles.textarea}
          rows={9}
          value={message}
          placeholder={active.template || 'Write your message here.'}
          onChange={(event) => setMessage(event.target.value)}
        />
        {active.template && !message.trim() && (
          <button
            type="button"
            className={styles.useTemplate}
            onClick={() => setMessage(active.template)}
          >
            Use this outline
          </button>
        )}
      </div>

      <div className={styles.actions}>
        <a className={styles.send} href={mailto}>
          Open in your email app
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
            <path d="M0 5h12M8.5 1 12.5 5l-4 4" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </a>

        <button
          type="button"
          className={styles.copyAddress}
          data-copied={copied}
          onClick={() => copy(active.to)}
        >
          {copied ? 'Address copied' : `Copy ${active.to}`}
        </button>
      </div>

      <p className={styles.privacy}>
        This form does not send anything. It composes a message in your own email application, and
        nothing reaches us until you press send there. We do not run a form service, we do not
        store drafts, and there is no analytics or tracking on this page.
      </p>
    </div>
  );
}
