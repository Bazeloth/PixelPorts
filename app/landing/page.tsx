'use client';

import { useState } from 'react';
import { Container } from '@/app/Container';
import { ArrowRightIcon, CheckCircle2 } from 'lucide-react';
import Icon from '@/app/Icon';
import { signupForMarketing } from '@/app/actions/marketing';

export default function LandingPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const result = await signupForMarketing(email);
            if (result.success) {
                setStatus('success');
                setMessage(result.message);
                setEmail('');
            } else {
                setStatus('error');
                setMessage(result.message);
            }
        } catch (err) {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col justify-center">
            <Container className="mx-auto px-8 py-32 text-center">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
                        PixelPorts is coming soon
                    </h1>
                    <p className="text-xl text-neutral-600 mb-12">
                        Help emerging designers showcase their work, connect with peers, and get
                        discovered by people who value ideas and execution over clout.
                    </p>

                    {status === 'success' ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-8 flex flex-col items-center">
                            <Icon icon={CheckCircle2} className="text-green-500 mb-4" size="lg" />
                            <p className="text-green-800 font-medium text-lg">{message}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="flex-1 px-5 py-4 bg-white text-neutral-900 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                    disabled={status === 'loading'}
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 whitespace-nowrap"
                                >
                                    {status === 'loading' ? 'Joining...' : 'Get Early Access'}
                                    <Icon icon={ArrowRightIcon} size="sm" />
                                </button>
                            </div>
                            {status === 'error' && (
                                <p className="text-red-500 mt-4 text-sm font-medium">{message}</p>
                            )}
                        </form>
                    )}

                    <p className="mt-12 text-sm text-neutral-400">
                        Join 500+ designers waiting for the launch.
                    </p>
                </div>
            </Container>
        </main>
    );
}
