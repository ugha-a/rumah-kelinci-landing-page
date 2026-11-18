import { useEffect, useState } from 'react';
import { findTier, memberCardUrl, membership } from '@/data/membership';
import { venue } from '@/data/venue';
import { MemberApiError, fetchMemberProfile } from '@/lib/member-api';
import { cn } from '@/lib/utils';
import type { MemberProfile } from '@/types/member';
import { ActionLink } from '../landing/action-link';
import { MemberCard } from './member-card';
import { SubpageShell } from './subpage-shell';

type ProfileState =
    | { kind: 'loading' }
    | { kind: 'ready'; profile: MemberProfile }
    | { kind: 'error'; status: number; message: string };

export function formatLongDate(isoDate: string | null): string {
    if (!isoDate) {
        return '—';
    }

    return new Date(`${isoDate}T00:00:00`).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function ProfileSkeleton() {
    return (
        <div aria-busy="true" aria-live="polite" className="animate-pulse">
            <span className="sr-only">Memuat kartu member…</span>
            <div className="aspect-[85.6/54] w-full max-w-[520px] rounded-[3.7%/5.9%] bg-court/60" />
            <div className="mt-10 h-12 w-2/3 bg-surround-raised" />
            <div className="mt-6 space-y-4">
                {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="h-6 bg-surround-raised" />
                ))}
            </div>
        </div>
    );
}

function ProfileError({
    status,
    message,
}: {
    status: number;
    message: string;
}) {
    const isInactive = status === 410;

    return (
        <div className="max-w-[560px]">
            <h1 className="font-display text-[clamp(2.6rem,8vw,4rem)] leading-[0.9] font-black uppercase">
                {isInactive ? 'Kartu tidak aktif' : 'Kartu tidak dikenali'}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-line-soft">
                {status === 0 || status >= 500
                    ? message
                    : isInactive
                      ? 'Kartu ini sudah dinonaktifkan, misalnya karena hilang atau diganti. Hubungi admin Rumah Kelinci untuk kartu baru.'
                      : 'QR ini tidak terhubung ke member mana pun. Pastikan kartu yang di-scan adalah kartu member Rumah Kelinci.'}
            </p>
            <ActionLink
                href="/"
                variant="line"
                external={false}
                className="mt-8"
            >
                Ke beranda
            </ActionLink>
        </div>
    );
}

function ProfileDetails({
    profile,
    token,
}: {
    profile: MemberProfile;
    token: string;
}) {
    const tier = findTier(profile.tierId);
    const identityRows = [
        { label: 'Nama lengkap', value: profile.fullName },
        { label: 'Nomor member', value: profile.memberNumber, isNumber: true },
        { label: 'Tier', value: tier?.name ?? profile.tierId },
        { label: 'Nomor WhatsApp', value: profile.phone, isNumber: true },
        { label: 'Email', value: profile.email ?? '—' },
        { label: 'Tanggal lahir', value: formatLongDate(profile.birthDate) },
        { label: 'Kota domisili', value: profile.city ?? '—' },
        { label: 'Member sejak', value: formatLongDate(profile.memberSince) },
        { label: 'Berlaku sampai', value: formatLongDate(profile.validUntil) },
    ];

    return (
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
                <MemberCard
                    fullName={profile.fullName}
                    memberNumber={profile.memberNumber}
                    tierName={tier?.name ?? profile.tierId}
                    validUntil={profile.validUntil}
                    qrValue={memberCardUrl(token, window.location.origin)}
                    className="max-w-[520px]"
                />

                <p
                    className={cn(
                        'mt-8 flex items-center gap-3 font-display text-[2.4rem] leading-none font-black uppercase',
                        profile.isExpired && 'text-fault',
                    )}
                >
                    <span
                        aria-hidden="true"
                        className={cn(
                            'size-4 shrink-0 rounded-full',
                            profile.isExpired ? 'ring-2 ring-fault' : 'bg-ball',
                        )}
                    />
                    {profile.isExpired ? 'Masa aktif habis' : 'Member aktif'}
                </p>
                <p className="mt-2 text-line-soft">
                    {profile.isExpired
                        ? `Berakhir ${formatLongDate(profile.validUntil)}. Perpanjang di admin Rumah Kelinci untuk memakai benefit lagi.`
                        : `Berlaku sampai ${formatLongDate(profile.validUntil)}.`}
                </p>

                {tier && (
                    <div className="mt-10 border-t-2 border-line pt-6">
                        <h2 className="font-display text-[2rem] leading-none font-extrabold uppercase">
                            Benefit {tier.name}
                        </h2>
                        <ul className="mt-5 space-y-3">
                            {tier.benefits.map((benefit) => (
                                <li
                                    key={benefit}
                                    className={cn(
                                        'flex gap-3 leading-snug',
                                        profile.isExpired && 'text-line-soft',
                                    )}
                                >
                                    <span
                                        aria-hidden="true"
                                        className="mt-[0.6em] h-0.5 w-3 shrink-0 bg-line"
                                    />
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                        {membership.isPlaceholder && (
                            <p className="mt-5 text-sm text-line-soft">
                                Daftar benefit masih contoh dan akan diperbarui.
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div>
                <h1 className="font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.9] font-black text-balance uppercase">
                    {profile.fullName}
                </h1>
                <dl className="mt-8 border-t-2 border-line">
                    {identityRows.map((row) => (
                        <div
                            key={row.label}
                            className="grid grid-cols-[minmax(8rem,40%)_1fr] gap-4 border-b border-line/20 py-3.5"
                        >
                            <dt className="text-line-soft">{row.label}</dt>
                            <dd
                                className={cn(
                                    'font-semibold break-words',
                                    row.isNumber && 'tabular-nums',
                                )}
                            >
                                {row.value}
                            </dd>
                        </div>
                    ))}
                </dl>
                <div className="mt-10 flex flex-wrap gap-3">
                    <ActionLink href={venue.booking.ayoUrl}>
                        Booking lapangan
                    </ActionLink>
                    <ActionLink href="/" variant="line" external={false}>
                        Ke beranda
                    </ActionLink>
                </div>
            </div>
        </div>
    );
}

export function MemberProfilePage({ token }: { token: string }) {
    const [state, setState] = useState<ProfileState>({ kind: 'loading' });

    useEffect(() => {
        let isCurrent = true;

        fetchMemberProfile(token)
            .then((profile) => {
                if (isCurrent) {
                    setState({ kind: 'ready', profile });
                }
            })
            .catch((error: unknown) => {
                if (isCurrent) {
                    setState({
                        kind: 'error',
                        status:
                            error instanceof MemberApiError ? error.status : 0,
                        message:
                            error instanceof Error
                                ? error.message
                                : 'Terjadi kesalahan.',
                    });
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [token]);

    const title =
        state.kind === 'ready' ? state.profile.fullName : 'Kartu member';

    return (
        <SubpageShell title={title} noIndex>
            <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
                {state.kind === 'loading' && <ProfileSkeleton />}
                {state.kind === 'error' && (
                    <ProfileError
                        status={state.status}
                        message={state.message}
                    />
                )}
                {state.kind === 'ready' && (
                    <ProfileDetails profile={state.profile} token={token} />
                )}
            </div>
        </SubpageShell>
    );
}
