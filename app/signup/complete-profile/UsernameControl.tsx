'use client';

import { useEffect, useRef } from 'react';
import { useUsernameField } from '@/lib/hooks/useUsernameField';
import { USERNAME_CONSTRAINTS } from '@/lib/constants/username';
import { UseFormRegisterReturn } from 'react-hook-form';

export function UsernameControl({
    value,
    register,
    serverError,
}: {
    value: string;
    register: UseFormRegisterReturn;
    serverError?: string[];
}) {
    const username = useUsernameField(value, serverError);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        // Clear client error when value changes via external means
        username.clearClientError();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const border = username.isUnavailable
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
                    placeholder="username"
                    {...register}
                    minLength={USERNAME_CONSTRAINTS.minLength}
                    maxLength={USERNAME_CONSTRAINTS.maxLength}
                    pattern={USERNAME_CONSTRAINTS.pattern.source}
                    required
                />
                {username.isChecking && (
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
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </div>
                )}
                {username.isUnavailable && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg
                            className="w-4 h-4 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                )}
                {username.isAvailable && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg
                            className="w-4 h-4 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                )}
            </div>
            {username.isChecking && (
                <p className="text-xs text-gray-500 mt-1">Checking availability...</p>
            )}
            {(username.error || serverError?.[0]) && (
                <p className="text-xs text-red-500 mt-1">{username.error || serverError?.[0]}</p>
            )}
        </div>
    );
}
