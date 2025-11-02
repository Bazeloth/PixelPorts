'use client';

import { useEffect, useRef } from 'react';
import type { PropsWithChildren } from 'react';

/**
 * Wrap server-rendered <details> and close it when clicking outside, pressing Escape,
 * or selecting an item inside the menu (e.g., Link or button).
 * The <details> element inside must have the data-close-on-click-away attribute.
 */
export default function ClickAwayCloseDetails({ children }: PropsWithChildren) {
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const details = root.querySelector<HTMLDetailsElement>('details[data-close-on-click-away]');
        if (!details) return;

        const summaryEl = details.querySelector('summary');

        const close = () => {
            if (details.open) details.open = false;
        };

        // Close when clicking anywhere outside the details
        const onPointerDownDocument = (e: PointerEvent) => {
            if (!details.open) return;
            const target = e.target as Node;
            if (target && !details.contains(target)) {
                close();
            }
        };

        // Close with Escape key
        const onKeyDownDocument = (e: KeyboardEvent) => {
            if (!details.open) return;
            if (e.key === 'Escape') {
                close();
            }
        };

        // Also close when clicking inside the menu content (not the summary)
        const shouldIgnore = (target: EventTarget | null) => {
            if (!target || !(target as Node)) return false;
            const node = target as Node;
            return !!(summaryEl && summaryEl.contains(node));
        };

        // Capture click to support keyboard activation (Enter/Space) on links/buttons
        // Defer closing so that Link navigation or form submission can proceed.
        const onClickCaptureDetails = (e: MouseEvent) => {
            if (!details.open) return;
            if (shouldIgnore(e.target)) return;
            setTimeout(() => {
                close();
            }, 0);
        };

        // Track native open/close as well to ensure state stays in sync
        const onToggle = () => {
            // no-op, but could be used if we later add state
        };

        document.addEventListener('pointerdown', onPointerDownDocument);
        document.addEventListener('keydown', onKeyDownDocument);
        details.addEventListener('click', onClickCaptureDetails, true);
        details.addEventListener('toggle', onToggle);

        return () => {
            document.removeEventListener('pointerdown', onPointerDownDocument);
            document.removeEventListener('keydown', onKeyDownDocument);
            details.removeEventListener('click', onClickCaptureDetails, true);
            details.removeEventListener('toggle', onToggle);
        };
    }, []);

    return <div ref={rootRef}>{children}</div>;
}
