export class AppError extends Error {
    constructor(
        public status: number,
        public code: string,
        message: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export function respondOk(data: unknown) {
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'content-type': 'application/json' },
    });
}

export function respondError(e: unknown) {
    if (e instanceof AppError) {
        return new Response(
            JSON.stringify({ error: e.message, code: e.code, details: e.details }),
            { status: e.status, headers: { 'content-type': 'application/json' } }
        );
    }

    console.error(e);
    return new Response(JSON.stringify({ error: 'Server error' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
    });
}
