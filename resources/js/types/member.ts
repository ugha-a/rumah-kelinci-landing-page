export type MemberStatus = 'pending' | 'active' | 'inactive' | 'rejected';

/** What a scanned card shows (`GET /api/members/:token`). */
export type MemberProfile = {
    memberNumber: string;
    fullName: string;
    phone: string;
    email: string | null;
    birthDate: string | null;
    city: string | null;
    tierId: string;
    validUntil: string;
    memberSince: string;
    isExpired: boolean;
};

/** A member row as the admin sees it. */
export type AdminMember = {
    id: number;
    token: string;
    status: MemberStatus;
    fullName: string;
    phone: string;
    email: string | null;
    birthDate: string | null;
    city: string | null;
    requestedTierId: string;
    tierId: string | null;
    memberNumber: string | null;
    validUntil: string | null;
    activatedAt: string | null;
    createdAt: string;
};

export type MemberIdentityInput = {
    fullName: string;
    phone: string;
    email: string;
    birthDate: string;
    city: string;
};

export type RegistrationInput = MemberIdentityInput & {
    tierId: string;
    consent: boolean;
    /** Honeypot: real visitors never fill this. */
    website?: string;
};

export type ValidationErrors = Partial<Record<string, string>>;

export type ApiError = {
    message: string;
    errors?: ValidationErrors;
};
