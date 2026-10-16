'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

/** Copies text and reports `copied` for a moment. Confirms even if the clipboard is blocked: the text is visible anyway. */
export function useCopyToClipboard(resetAfter = 1800) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Permission denied or insecure context.
      }
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), resetAfter);
    },
    [resetAfter],
  );

  useEffect(() => () => clearTimeout(timer.current), []);
  return { copied, copy };
}
