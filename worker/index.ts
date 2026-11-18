import { findTier, formatMemberNumber } from '../resources/js/data/membership';
import type {
    AdminMember,
    MemberIdentityInput,
    MemberProfile,
    MemberRegistrationStatus,
    MemberStatus,
    ValidationErrors,
} from '../resources/js/types/member';

type Env = {
    DB: D1Database;
    ASSETS: Fetcher;
    /** Set in Cloudflare: Settings → Variables and Secrets. */
    ADMIN_PASSWORD?: string;
};

type MemberRow = {
    id: number;
    token: string;
    status: MemberStatus;
    full_name: string;
    phone: string;
    email: string | null;
    birth_date: string | null;
    city: string | null;
    requested_tier: string;
    tier: string | null;
    member_number: string | null;
    valid_until: string | null;
    activated_at: string | null;
    created_at: string;
};

const ADMIN_USERNAME = 'admin';
const MEMBER_STATUSES: MemberStatus[] = [
    'pending',
    'active',
    'inactive',
    'rejected',
];
const NO_INDEX = { 'x-robots-tag': 'noindex, nofollow' };

class HttpError extends Error {
    constructor(
        public status: number,
        message: string,
        public errors?: ValidationErrors,
    ) {
        super(message);
    }
}

function json(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-store',
            ...NO_INDEX,
        },
    });
}

function withNoIndex(response: Response): Response {
    const headers = new Headers(response.headers);
    headers.set('x-robots-tag', NO_INDEX['x-robots-tag']);

    return new Response(response.body, { status: response.status, headers });
}

/** Today's date in Makassar (WITA, UTC+8) as YYYY-MM-DD. */
function todayInMakassar(): string {
    return new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** Converts a UTC `datetime('now')` value to its Makassar (WITA) date. */
function makassarDate(utcDateTime: string): string {
    const date = new Date(`${utcDateTime.replace(' ', 'T')}Z`);

    return new Date(date.getTime() + 8 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
}

function addMonths(isoDate: string, months: number): string {
    const date = new Date(`${isoDate}T00:00:00Z`);
    date.setUTCMonth(date.getUTCMonth() + months);

    return date.toISOString().slice(0, 10);
}

function createToken(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(18));

    return btoa(String.fromCharCode(...bytes))
        .replaceAll('+', '-')
        .replaceAll('/', '_')
        .replaceAll('=', '');
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
    try {
        const body: unknown = await request.json();

        if (body && typeof body === 'object' && !Array.isArray(body)) {
            return body as Record<string, unknown>;
        }
    } catch {
        // Falls through to the error below.
    }

    throw new HttpError(400, 'Data yang dikirim tidak valid.');
}

function text(body: Record<string, unknown>, key: string): string {
    const value = body[key];

    return typeof value === 'string' ? value.trim() : '';
}

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

/** Validates and normalises the identity fields shared by every member form. */
function validateIdentity(
    body: Record<string, unknown>,
    errors: ValidationErrors,
): MemberIdentityInput {
    const identity = {
        fullName: text(body, 'fullName').replace(/\s+/g, ' '),
        phone: text(body, 'phone').replace(/[\s.-]/g, ''),
        email: text(body, 'email').toLowerCase(),
        birthDate: text(body, 'birthDate'),
        city: text(body, 'city'),
    };

    if (identity.fullName.length < 2 || identity.fullName.length > 100) {
        errors.fullName = 'Isi nama lengkap (2–100 karakter).';
    }

    if (!/^\+?\d{8,15}$/.test(identity.phone)) {
        errors.phone = 'Isi nomor WhatsApp yang valid, mis. 081234567890.';
    }

    if (
        identity.email &&
        (identity.email.length > 120 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.email))
    ) {
        errors.email = 'Format email tidak valid.';
    }

    if (
        identity.birthDate &&
        (!isoDatePattern.test(identity.birthDate) ||
            identity.birthDate > todayInMakassar())
    ) {
        errors.birthDate = 'Tanggal lahir tidak valid.';
    }

    if (identity.city.length > 60) {
        errors.city = 'Nama kota terlalu panjang.';
    }

    return identity;
}

function validateTier(
    body: Record<string, unknown>,
    errors: ValidationErrors,
): string {
    const tierId = text(body, 'tierId');

    if (!findTier(tierId)) {
        errors.tierId = 'Pilih tier member.';
    }

    return tierId;
}

function validateValidUntil(
    body: Record<string, unknown>,
    errors: ValidationErrors,
    tierId: string,
): string {
    const validUntil = text(body, 'validUntil');

    if (!validUntil) {
        return addMonths(
            todayInMakassar(),
            findTier(tierId)?.durationMonths ?? 12,
        );
    }

    if (!isoDatePattern.test(validUntil)) {
        errors.validUntil = 'Tanggal berlaku tidak valid.';
    }

    return validUntil;
}

function throwIfInvalid(errors: ValidationErrors): void {
    if (Object.keys(errors).length > 0) {
        throw new HttpError(422, 'Periksa lagi isian yang ditandai.', errors);
    }
}

function toAdminMember(row: MemberRow): AdminMember {
    return {
        id: row.id,
        token: row.token,
        status: row.status,
        fullName: row.full_name,
        phone: row.phone,
        email: row.email,
        birthDate: row.birth_date,
        city: row.city,
        requestedTierId: row.requested_tier,
        tierId: row.tier,
        memberNumber: row.member_number,
        validUntil: row.valid_until,
        activatedAt: row.activated_at,
        createdAt: row.created_at,
    };
}

async function findMember(env: Env, id: number): Promise<MemberRow> {
    const row = await env.DB.prepare('SELECT * FROM members WHERE id = ?')
        .bind(id)
        .first<MemberRow>();

    if (!row) {
        throw new HttpError(404, 'Member tidak ditemukan.');
    }

    return row;
}

async function register(request: Request, env: Env): Promise<Response> {
    const body = await readJson(request);

    if (text(body, 'website')) {
        return json(
            { message: 'Pendaftaran diterima.', token: createToken() },
            201,
        );
    }

    const errors: ValidationErrors = {};
    const identity = validateIdentity(body, errors);
    const tierId = validateTier(body, errors);

    if (body.consent !== true) {
        errors.consent = 'Centang persetujuan untuk melanjutkan.';
    }

    throwIfInvalid(errors);

    const token = createToken();

    await env.DB.prepare(
        `INSERT INTO members (token, full_name, phone, email, birth_date, city, requested_tier)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
        .bind(
            token,
            identity.fullName,
            identity.phone,
            identity.email || null,
            identity.birthDate || null,
            identity.city || null,
            tierId,
        )
        .run();

    return json({ message: 'Pendaftaran diterima.', token }, 201);
}

async function memberProfile(token: string, env: Env): Promise<Response> {
    const row = await env.DB.prepare('SELECT * FROM members WHERE token = ?')
        .bind(token)
        .first<MemberRow>();

    if (!row) {
        throw new HttpError(404, 'Kartu tidak dikenali.');
    }

    if (row.status === 'pending' || row.status === 'rejected') {
        const registration: MemberRegistrationStatus = {
            status: row.status,
            fullName: row.full_name,
            tierId: row.requested_tier,
            registeredAt: makassarDate(row.created_at),
        };

        return json(registration);
    }

    if (row.status === 'inactive') {
        throw new HttpError(410, 'Kartu ini sudah tidak aktif.');
    }

    const profile: MemberProfile = {
        status: 'active',
        memberNumber: row.member_number ?? formatMemberNumber(row.id),
        fullName: row.full_name,
        phone: row.phone,
        email: row.email,
        birthDate: row.birth_date,
        city: row.city,
        tierId: row.tier ?? row.requested_tier,
        validUntil: row.valid_until ?? '',
        memberSince: makassarDate(row.activated_at ?? row.created_at),
        isExpired: Boolean(
            row.valid_until && row.valid_until < todayInMakassar(),
        ),
    };

    return json(profile);
}

function timingSafeEqual(left: string, right: string): boolean {
    const encoder = new TextEncoder();
    const leftBytes = encoder.encode(left);
    const rightBytes = encoder.encode(right);

    if (leftBytes.byteLength !== rightBytes.byteLength) {
        return false;
    }

    return crypto.subtle.timingSafeEqual(leftBytes, rightBytes);
}

/** HTTP Basic auth for /admin and /api/admin; returns a response when access is denied. */
function requireAdmin(request: Request, env: Env): Response | null {
    if (!env.ADMIN_PASSWORD) {
        return new Response(
            'ADMIN_PASSWORD belum diatur di Cloudflare (Settings → Variables and Secrets).',
            { status: 503, headers: NO_INDEX },
        );
    }

    const header = request.headers.get('authorization') ?? '';

    if (header.startsWith('Basic ')) {
        try {
            const decoded = atob(header.slice(6));
            const separator = decoded.indexOf(':');
            const username = decoded.slice(0, separator);
            const password = decoded.slice(separator + 1);

            if (
                separator > 0 &&
                timingSafeEqual(username, ADMIN_USERNAME) &&
                timingSafeEqual(password, env.ADMIN_PASSWORD)
            ) {
                return null;
            }
        } catch {
            // Malformed header: fall through to the challenge.
        }
    }

    return new Response('Login admin diperlukan.', {
        status: 401,
        headers: {
            'www-authenticate':
                'Basic realm="Admin Rumah Kelinci", charset="UTF-8"',
            ...NO_INDEX,
        },
    });
}

async function adminApi(
    request: Request,
    env: Env,
    path: string,
): Promise<Response> {
    if (path === '/api/admin/members' && request.method === 'GET') {
        const status =
            new URL(request.url).searchParams.get('status') ?? 'pending';

        if (!MEMBER_STATUSES.includes(status as MemberStatus)) {
            throw new HttpError(422, 'Status tidak dikenal.');
        }

        const { results } = await env.DB.prepare(
            'SELECT * FROM members WHERE status = ? ORDER BY created_at DESC LIMIT 500',
        )
            .bind(status)
            .all<MemberRow>();

        return json(results.map(toAdminMember));
    }

    if (path === '/api/admin/members' && request.method === 'POST') {
        const body = await readJson(request);
        const errors: ValidationErrors = {};
        const identity = validateIdentity(body, errors);
        const tierId = validateTier(body, errors);
        const validUntil = validateValidUntil(body, errors, tierId);
        throwIfInvalid(errors);

        const inserted = await env.DB.prepare(
            `INSERT INTO members (token, status, full_name, phone, email, birth_date, city,
                requested_tier, tier, valid_until, activated_at)
             VALUES (?, 'active', ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
             RETURNING id`,
        )
            .bind(
                createToken(),
                identity.fullName,
                identity.phone,
                identity.email || null,
                identity.birthDate || null,
                identity.city || null,
                tierId,
                tierId,
                validUntil,
            )
            .first<{ id: number }>();

        if (!inserted) {
            throw new HttpError(500, 'Gagal menyimpan member.');
        }

        await env.DB.prepare(
            'UPDATE members SET member_number = ? WHERE id = ?',
        )
            .bind(formatMemberNumber(inserted.id), inserted.id)
            .run();

        return json(toAdminMember(await findMember(env, inserted.id)), 201);
    }

    const match = path.match(
        /^\/api\/admin\/members\/(\d+)(?:\/(activate|deactivate|reject|rotate-token))?$/,
    );

    if (!match) {
        throw new HttpError(404, 'Tidak ditemukan.');
    }

    const id = Number(match[1]);
    const action = match[2];
    const member = await findMember(env, id);

    if (!action && request.method === 'PUT') {
        const errors: ValidationErrors = {};
        const identity = validateIdentity(await readJson(request), errors);
        throwIfInvalid(errors);

        await env.DB.prepare(
            `UPDATE members SET full_name = ?, phone = ?, email = ?, birth_date = ?, city = ?,
                updated_at = datetime('now') WHERE id = ?`,
        )
            .bind(
                identity.fullName,
                identity.phone,
                identity.email || null,
                identity.birthDate || null,
                identity.city || null,
                id,
            )
            .run();
    } else if (action === 'activate' && request.method === 'POST') {
        const body = await readJson(request);
        const errors: ValidationErrors = {};
        const tierId = validateTier(body, errors);
        const validUntil = validateValidUntil(body, errors, tierId);
        throwIfInvalid(errors);

        await env.DB.prepare(
            `UPDATE members SET status = 'active', tier = ?, valid_until = ?,
                member_number = COALESCE(member_number, ?),
                activated_at = COALESCE(activated_at, datetime('now')),
                updated_at = datetime('now') WHERE id = ?`,
        )
            .bind(tierId, validUntil, formatMemberNumber(member.id), id)
            .run();
    } else if (
        (action === 'deactivate' || action === 'reject') &&
        request.method === 'POST'
    ) {
        await env.DB.prepare(
            "UPDATE members SET status = ?, updated_at = datetime('now') WHERE id = ?",
        )
            .bind(action === 'reject' ? 'rejected' : 'inactive', id)
            .run();
    } else if (action === 'rotate-token' && request.method === 'POST') {
        await env.DB.prepare(
            "UPDATE members SET token = ?, updated_at = datetime('now') WHERE id = ?",
        )
            .bind(createToken(), id)
            .run();
    } else {
        throw new HttpError(405, 'Metode tidak didukung.');
    }

    return json(toAdminMember(await findMember(env, id)));
}

async function route(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/api/registrations' && request.method === 'POST') {
        return register(request, env);
    }

    const profileMatch = path.match(/^\/api\/members\/([A-Za-z0-9_-]{16,64})$/);

    if (profileMatch && request.method === 'GET') {
        return memberProfile(profileMatch[1], env);
    }

    if (
        path === '/admin' ||
        path.startsWith('/admin/') ||
        path.startsWith('/api/admin/')
    ) {
        const denied = requireAdmin(request, env);

        if (denied) {
            return denied;
        }

        if (path.startsWith('/api/admin/')) {
            return adminApi(request, env, path);
        }

        return withNoIndex(await env.ASSETS.fetch(request));
    }

    if (path.startsWith('/api/')) {
        throw new HttpError(404, 'Tidak ditemukan.');
    }

    if (path.startsWith('/m/')) {
        return withNoIndex(await env.ASSETS.fetch(request));
    }

    return env.ASSETS.fetch(request);
}

export default {
    async fetch(request, env): Promise<Response> {
        try {
            return await route(request, env);
        } catch (error) {
            if (error instanceof HttpError) {
                return json(
                    { message: error.message, errors: error.errors },
                    error.status,
                );
            }

            console.error(error);

            return json(
                { message: 'Terjadi kesalahan di server. Coba lagi.' },
                500,
            );
        }
    },
} satisfies ExportedHandler<Env>;
