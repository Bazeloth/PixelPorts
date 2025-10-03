'use client';

import { useEffect, useState } from 'react';
import useDebounce from '@/lib/hooks/useDebounce';
import { logger } from '@/lib/consoleUtils';

export function UsernameControl() {
    const [username, setUsername] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

    const debouncedUsername = useDebounce(username, 300);

    useEffect(() => {
        setIsAvailable(null);

        if (!debouncedUsername) {
            setIsChecking(false);
            return;
        }

        setIsChecking(true);
        logger.Info('Username search triggered for:', debouncedUsername);
        setTimeout(() => {
            setIsChecking(false);
            setIsAvailable(true);
        }, 1000);
    }, [debouncedUsername]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const usernameIsAvailable = !isChecking && isAvailable === true;
    const usernameIsUnavailable = !isChecking && isAvailable === false;
    const border = usernameIsUnavailable
        ? 'border-red-300 focus-within:ring-red-500 focus-within:border-red-500'
        : 'border-gray-300 focus-within:ring-blue-500 focus-within:border-blue-500';

    return (
        <div>
            <div className={`relative flex rounded-md border focus-within:ring-2 ${border}`}>
                <span className="inline-flex items-center px-3 rounded-l-md border-r border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    PixelPorts.com/
                </span>
                <input
                    type="text"
                    className="flex-1 rounded-r-md border-0 py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
                    placeholder={'username'}
                    value={username}
                    onChange={handleChange}
                    disabled={isChecking}
                />
                {isChecking && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg
                            className="animate-spin w-4 h-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    </div>
                )}
                {usernameIsUnavailable && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg
                            className="w-4 h-4 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </div>
                )}
                {usernameIsAvailable && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg
                            className="w-4 h-4 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </div>
                )}
            </div>
            {isChecking && <p className="text-xs text-gray-500 mt-1">Checking availability...</p>}
            {!isChecking && usernameIsUnavailable && (
                <p className="text-xs text-red-500 mt-1">Username is unavailable</p>
            )}
        </div>
    );
}
