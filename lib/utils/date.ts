/**
 * Utility functions for formatting join dates into human-friendly buckets
 * like "today", "yesterday", "this week", etc.
 */

function startOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}

function daysBetween(a: Date, b: Date) {
    const msPerDay = 24 * 60 * 60 * 1000;
    const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utcA - utcB) / msPerDay);
}

function startOfWeek(d: Date) {
    // ISO week: Monday as the first day of the week
    const x = startOfDay(d);
    const day = x.getDay(); // 0=Sun,1=Mon,...
    const diff = day === 0 ? 6 : day - 1; // convert so Mon=0
    x.setDate(x.getDate() - diff);
    return x;
}

export function formatJoinRelative(input: string | Date | null | undefined): string {
    if (!input) return 'unknown';

    const now = new Date();
    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date.getTime())) return 'unknown';

    const todayStart = startOfDay(now);
    const dateStart = startOfDay(date);

    const dayDiff = daysBetween(todayStart, dateStart); // positive if in past

    if (dayDiff === 0) return 'today';
    if (dayDiff === 1) return 'yesterday';

    const thisWeekStart = startOfWeek(now);
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);

    if (dateStart >= thisWeekStart) return 'this week';
    if (dateStart >= lastWeekStart) return 'last week';

    // Month boundaries
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    if (dateStart >= thisMonthStart) return 'this month';
    if (dateStart >= lastMonthStart) return 'last month';

    // Year boundaries
    const thisYearStart = new Date(now.getFullYear(), 0, 1);
    const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);

    if (dateStart >= thisYearStart) return 'this year';
    if (dateStart >= lastYearStart) return 'last year';

    // Fallback to a concise date
    const formatter = new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
    return formatter.format(date);
}

export function pickGradientFromId(id: string | number): string {
    const gradients = [
        'from-purple-500 to-purple-700',
        'from-pink-500 to-red-500',
        'from-blue-400 to-cyan-400',
        'from-pink-400 to-yellow-400',
        'from-emerald-400 to-teal-600',
        'from-indigo-400 to-indigo-700',
        'from-orange-400 to-amber-600',
        'from-sky-400 to-blue-600',
    ];
    const str = String(id);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return gradients[hash % gradients.length];
}
