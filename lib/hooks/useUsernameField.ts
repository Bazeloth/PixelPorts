'use client';

import { useState, useEffect } from 'react';
import { userSchema } from '@/lib/validations/user';
import { checkUsernameAvailability } from '@/app/actions/user';
import useDebounce from '@/lib/hooks/useDebounce';
import { logger } from '@/lib/consoleUtils';

export function useUsernameField(serverError?: string[]) {
    const [username, setUsername] = useState('');
    const [clientError, setClientError] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

    const debouncedUsername = useDebounce(username, 500);

    useEffect(() => {
        setIsAvailable(null);
        setClientError(null);

        if (!debouncedUsername) {
            setIsChecking(false);
            return;
        }

        // Client-side validation first
        const result = userSchema
            .pick({ username: true })
            .safeParse({ username: debouncedUsername });

        if (!result.success) {
            setClientError(result.error.flatten().fieldErrors.username?.[0] || 'Invalid username');
            setIsChecking(false);
            return;
        }

        // Then check availability on server
        setIsChecking(true);
        logger.Info('Username search triggered for:', debouncedUsername);

        checkUsernameAvailability(debouncedUsername).then(({ available, error }) => {
            setIsChecking(false);
            setIsAvailable(available);
            if (error) setClientError(error);
            if (!available && !error) setClientError('Username is unavailable');
        });
    }, [debouncedUsername]);

    const error = clientError || serverError?.[0];
    const usernameIsAvailable = !isChecking && isAvailable === true && !error;
    const usernameIsUnavailable = !isChecking && (isAvailable === false || !!error);

    return {
        name: 'username' as const,
        value: username,
        error,
        isChecking,
        isAvailable: usernameIsAvailable,
        isUnavailable: usernameIsUnavailable,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setUsername(e.target.value);
            setClientError(null);
        },
    };
}
