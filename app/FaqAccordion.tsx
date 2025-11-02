'use client';

import { useEffect, useState } from 'react';
import { FaqItem } from '@/app/FaqItem';

export default function FaqAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    useEffect(() => {
        const applyHashBehavior = () => {
            if (typeof window === 'undefined') return;
            const { hash } = window.location;
            if (hash === '#faq-visibility') {
                setOpenIndex(0);
                const el = document.getElementById('faq-visibility');
                if (el) {
                    try {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' } as ScrollIntoViewOptions);
                    } catch {
                        el.scrollIntoView();
                    }
                }
            }
        };

        applyHashBehavior();
        window.addEventListener('hashchange', applyHashBehavior);
        return () => window.removeEventListener('hashchange', applyHashBehavior);
    }, []);

    return (
        <div className="space-y-4">
            <div id="faq-visibility">
                <FaqItem
                    title={'How does the visibility boost work?'}
                    isOpen={openIndex === 0}
                    onToggleAction={() => handleToggle(0)}
                >
                Every upload appears in our Discover and New Designers feeds. The algorithm surfaces
                work based on engagement rate, audience diversity, content quality, and a follower
                handicap. Designers with fewer followers get amplified more to create a level
                playing field.
            </FaqItem>
            </div>

            <FaqItem
                title={'How is PixelPorts different from Dribbble or Behance?'}
                isOpen={openIndex === 1}
                onToggleAction={() => handleToggle(1)}
            >
                PixelPorts uses an algorithm that gives newcomers a visibility boost. Your work gets
                amplified 3-4x in the first few months to help you build an audience, then gradually
                transitions as you grow. We believe good work should be discovered regardless of
                follower count.
            </FaqItem>

            <FaqItem
                title={'Is PixelPorts free?'}
                isOpen={openIndex === 2}
                onToggleAction={() => handleToggle(2)}
            >
                Yes! Visibility is always free on PixelPorts. You'll never have to pay to boost your
                posts or get discovered. We may introduce premium features later for advanced
                analytics and portfolio customization, but getting seen will always be free.
            </FaqItem>

            <FaqItem
                title={'Who should join PixelPorts?'}
                isOpen={openIndex === 3}
                onToggleAction={() => handleToggle(3)}
            >
                PixelPorts is built for emerging designers—bootcamp grads, self-taught designers, or
                anyone who hasn't built a large following yet. If you're struggling to get your work
                seen on other platforms, this is for you.
            </FaqItem>

            <FaqItem
                title={'What happens when I get more followers?'}
                isOpen={openIndex === 4}
                onToggleAction={() => handleToggle(4)}
            >
                The boost gradually decreases as you grow your audience. This is smooth and
                success-based—we don't punish you for gaining followers. The goal is to help you get
                established, then let your work and following speak for themselves.
            </FaqItem>
        </div>
    );
}
