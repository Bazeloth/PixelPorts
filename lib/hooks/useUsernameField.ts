'use client';

import { useEffect, useState } from 'react';
import useDebounce from '@/lib/hooks/useDebounce';
import { validateUsername } from '@/lib/utils/username';

// Hook dedicated to validating and checking availability for a given username value.
// It does not own the input state, so it works seamlessly with React Hook Form or any controlled input.
export function useUsernameField(value: string, serverError?: string[]) {
    const [clientError, setClientError] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [available, setAvailable] = useState<boolean | null>(null);

    const debouncedUsername = useDebounce(value, 500);

    useEffect(() => {
        setAvailable(null);
        setClientError(null);

        if (!debouncedUsername) {
            setIsChecking(false);
            return;
        }

        // Client-side validation first
        const res = validateUsername(debouncedUsername);
        if (!res.ok) {
            setClientError(res.error);
            setIsChecking(false);
            return;
        }

        // Then check availability on server via API route
        setIsChecking(true);

        const ac = new AbortController();
        let cancelled = false;

        (async () => {
            try {
                const resp = await fetch(
                    `/api/username/availability?u=${encodeURIComponent(debouncedUsername)}`,
                    { signal: ac.signal }
                );
                const r: { ok: true; available: boolean } | { ok: false; error: string } =
                    await resp.json();
                if (cancelled) return;
                setIsChecking(false);
                if (!r.ok) {
                    setAvailable(false);
                    setClientError(r.error);
                    return;
                }
                setAvailable(r.available);
                if (!r.available) setClientError('Username is unavailable');
            } catch (err: any) {
                if (cancelled || err?.name === 'AbortError') {
                    return;
                }
                setIsChecking(false);
                setAvailable(false);
                setClientError('Unable to check availability. Please try again.');
            }
        })();

        return () => {
            cancelled = true;
            ac.abort();
        };
    }, [debouncedUsername]);

    const error = clientError || serverError?.[0] || null;
    const usernameIsAvailable = !isChecking && available === true && !error;
    const usernameIsUnavailable = !isChecking && (available === false || !!error);

    return {
        error,
        isChecking,
        isAvailable: usernameIsAvailable,
        isUnavailable: usernameIsUnavailable,
        clearClientError: () => setClientError(null),
    };
}
