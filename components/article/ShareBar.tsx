'use client';

import { useCopy } from '@/hooks/useMotion';
import styles from './Article.module.css';

/**
 * Share. Understated on purpose: these are plain links to each service's own
 * share URL, so nothing third-party is loaded, nothing is tracked, and no
 * script runs before the reader has decided to share anything.
 */
export function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, copy] = useCopy();

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ];

  return (
    <div className={styles.share}>
      <span className={styles.shareLabel}>Share</span>

      <button
        type="button"
        className={styles.shareItem}
        data-copied={copied}
        onClick={() => copy(url)}
      >
        {copied ? 'Copied' : 'Copy link'}
      </button>

      {targets.map((target) => (
        <a
          key={target.label}
          className={styles.shareItem}
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {target.label}
          <span className="u-sr"> (opens in a new tab)</span>
        </a>
      ))}
    </div>
  );
}
