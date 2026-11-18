import type {
    AdminMember,
    ApiError,
    MemberIdentityInput,
    MemberProfile,
    MemberStatus,
    RegistrationInput,
    ValidationErrors,
} from '@/types/member';

export class MemberApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public errors: ValidationErrors = {},
    ) {
        super(message);
    }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    let response: Response;

    try {
        response = await fetch(path, {
            ...init,
            headers: {
                accept: 'application/json',
                ...(init.body ? { 'content-type': 'application/json' } : {}),
            },
        });
    } catch {
        throw new MemberApiError(
            0,
            'Tidak bisa terhubung. Periksa koneksi internet lalu coba lagi.',
        );
    }

    const body = (await response.json().catch(() => null)) as
        | T
        | ApiError
        | null;

    if (!response.ok) {
        const error = body as ApiError | null;

        throw new MemberApiError(
            response.status,
            error?.message ?? 'Terjadi kesalahan. Coba lagi.',
            error?.errors ?? {},
        );
    }

    return body as T;
}

export function registerMember(input: RegistrationInput): Promise<ApiError> {
    return request('/api/registrations', {
        method: 'POST',
        body: JSON.stringify(input),
    });
}

export function fetchMemberProfile(token: string): Promise<MemberProfile> {
    return request(`/api/members/${encodeURIComponent(token)}`);
}

export const adminApi = {
    list(status: MemberStatus): Promise<AdminMember[]> {
        return request(`/api/admin/members?status=${status}`);
    },
    create(
        input: MemberIdentityInput & { tierId: string; validUntil: string },
    ): Promise<AdminMember> {
        return request('/api/admin/members', {
            method: 'POST',
            body: JSON.stringify(input),
        });
    },
    update(id: number, input: MemberIdentityInput): Promise<AdminMember> {
        return request(`/api/admin/members/${id}`, {
            method: 'PUT',
            body: JSON.stringify(input),
        });
    },
    activate(
        id: number,
        input: { tierId: string; validUntil: string },
    ): Promise<AdminMember> {
        return request(`/api/admin/members/${id}/activate`, {
            method: 'POST',
            body: JSON.stringify(input),
        });
    },
    action(
        id: number,
        action: 'deactivate' | 'reject' | 'rotate-token',
    ): Promise<AdminMember> {
        return request(`/api/admin/members/${id}/${action}`, {
            method: 'POST',
        });
    },
};
