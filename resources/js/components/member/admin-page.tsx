import { useCallback, useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { findTier, memberCardUrl, membership } from '@/data/membership';
import { venue } from '@/data/venue';
import { MemberApiError, adminApi } from '@/lib/member-api';
import { cn } from '@/lib/utils';
import type {
    AdminMember,
    MemberIdentityInput,
    MemberStatus,
    ValidationErrors,
} from '@/types/member';
import { actionClasses } from '../landing/action-link';
import { BallMark, ChevronDownIcon } from '../landing/icons';
import { FormField, fieldInputClasses, fieldLabelClasses } from './form-field';
import { MemberCard } from './member-card';
import { formatLongDate } from './member-profile-page';
import { qrSvgMarkup } from './qr-code';
import { useDocumentMeta } from './subpage-shell';

const tabs: { status: MemberStatus; label: string }[] = [
    { status: 'pending', label: 'Pendaftar baru' },
    { status: 'active', label: 'Aktif' },
    { status: 'inactive', label: 'Nonaktif' },
    { status: 'rejected', label: 'Ditolak' },
];

const buttonLine = cn(
    actionClasses.base,
    actionClasses.line,
    'h-10 cursor-pointer px-4 text-sm disabled:cursor-wait disabled:opacity-60',
);
const buttonBall = cn(
    actionClasses.base,
    actionClasses.ball,
    'h-10 cursor-pointer px-4 text-sm disabled:cursor-wait disabled:opacity-60',
);
const buttonFault =
    'inline-flex h-10 cursor-pointer items-center rounded-full px-4 text-sm font-semibold text-fault ring-2 ring-fault/70 ring-inset transition-colors hover:bg-fault hover:text-ink disabled:cursor-wait disabled:opacity-60';

function defaultValidUntil(tierId: string): string {
    const date = new Date();
    date.setMonth(date.getMonth() + (findTier(tierId)?.durationMonths ?? 12));

    return date.toISOString().slice(0, 10);
}

function tierName(tierId: string | null): string {
    return tierId ? (findTier(tierId)?.name ?? tierId) : '—';
}

function identityOf(member: AdminMember): MemberIdentityInput {
    return {
        fullName: member.fullName,
        phone: member.phone,
        email: member.email ?? '',
        birthDate: member.birthDate ?? '',
        city: member.city ?? '',
    };
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Terjadi kesalahan.';
}

function TierSelect({
    value,
    onChange,
    error,
}: {
    value: string;
    onChange: (tierId: string) => void;
    error?: string;
}) {
    return (
        <div>
            <label className={fieldLabelClasses}>
                Tier
                <select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className={cn(
                        fieldInputClasses,
                        'mt-1 cursor-pointer text-base tracking-normal normal-case',
                    )}
                >
                    {membership.tiers.map((tier) => (
                        <option
                            key={tier.id}
                            value={tier.id}
                            className="bg-surround"
                        >
                            {tier.name}
                        </option>
                    ))}
                </select>
            </label>
            {error && <p className="mt-1.5 text-sm text-fault">{error}</p>}
        </div>
    );
}

function IdentityFields({
    value,
    errors,
    onChange,
}: {
    value: MemberIdentityInput;
    errors: ValidationErrors;
    onChange: (value: MemberIdentityInput) => void;
}) {
    const field = (key: keyof MemberIdentityInput) => ({
        value: value[key],
        error: errors[key],
        onChange: (event: { target: { value: string } }) =>
            onChange({ ...value, [key]: event.target.value }),
    });

    return (
        <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
            <FormField label="Nama lengkap" required {...field('fullName')} />
            <FormField
                label="Nomor WhatsApp"
                type="tel"
                required
                {...field('phone')}
            />
            <FormField label="Email" type="email" {...field('email')} />
            <FormField
                label="Tanggal lahir"
                type="date"
                {...field('birthDate')}
            />
            <FormField label="Kota domisili" {...field('city')} />
        </div>
    );
}

/** Two-step button: the first click arms it, the second performs the action. */
function ConfirmButton({
    label,
    confirmLabel,
    onConfirm,
    isBusy,
}: {
    label: string;
    confirmLabel: string;
    onConfirm: () => void;
    isBusy: boolean;
}) {
    const [isArmed, setIsArmed] = useState(false);

    if (!isArmed) {
        return (
            <button
                type="button"
                className={buttonFault}
                onClick={() => setIsArmed(true)}
            >
                {label}
            </button>
        );
    }

    return (
        <span className="inline-flex flex-wrap items-center gap-2">
            <button
                type="button"
                className={cn(buttonFault, 'bg-fault text-ink')}
                disabled={isBusy}
                onClick={onConfirm}
            >
                {confirmLabel}
            </button>
            <button
                type="button"
                className="h-10 cursor-pointer px-3 text-sm text-line-soft underline"
                onClick={() => setIsArmed(false)}
            >
                Batal
            </button>
        </span>
    );
}

function ActivateForm({
    member,
    submitLabel,
    onSaved,
}: {
    member: AdminMember;
    submitLabel: string;
    onSaved: (member: AdminMember) => void;
}) {
    const initialTier = member.tierId ?? member.requestedTierId;
    const [tierId, setTierId] = useState(initialTier);
    const [validUntil, setValidUntil] = useState(
        member.status === 'active' && member.validUntil
            ? member.validUntil
            : defaultValidUntil(initialTier),
    );
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isBusy, setIsBusy] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsBusy(true);

        try {
            onSaved(await adminApi.activate(member.id, { tierId, validUntil }));
        } catch (error) {
            setErrors(
                error instanceof MemberApiError
                    ? { ...error.errors, form: error.message }
                    : { form: errorMessage(error) },
            );
        } finally {
            setIsBusy(false);
        }
    }

    return (
        <form
            onSubmit={submit}
            className="grid items-end gap-6 sm:grid-cols-[1fr_1fr_auto]"
        >
            <TierSelect
                value={tierId}
                error={errors.tierId}
                onChange={(nextTier) => {
                    setTierId(nextTier);

                    if (member.status !== 'active') {
                        setValidUntil(defaultValidUntil(nextTier));
                    }
                }}
            />
            <FormField
                label="Berlaku sampai"
                type="date"
                required
                value={validUntil}
                error={errors.validUntil}
                onChange={(event) => setValidUntil(event.target.value)}
            />
            <button type="submit" className={buttonBall} disabled={isBusy}>
                {isBusy ? 'Menyimpan…' : submitLabel}
            </button>
            {errors.form && (
                <p className="text-sm text-fault sm:col-span-3">
                    {errors.form}
                </p>
            )}
        </form>
    );
}

function EditIdentityForm({
    member,
    onSaved,
}: {
    member: AdminMember;
    onSaved: (member: AdminMember) => void;
}) {
    const [identity, setIdentity] = useState(identityOf(member));
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isBusy, setIsBusy] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsBusy(true);

        try {
            onSaved(await adminApi.update(member.id, identity));
            setErrors({});
        } catch (error) {
            setErrors(
                error instanceof MemberApiError
                    ? { ...error.errors, form: error.message }
                    : { form: errorMessage(error) },
            );
        } finally {
            setIsBusy(false);
        }
    }

    return (
        <form onSubmit={submit} noValidate>
            <IdentityFields
                value={identity}
                errors={errors}
                onChange={setIdentity}
            />
            {errors.form && (
                <p className="mt-4 text-sm text-fault">{errors.form}</p>
            )}
            <button
                type="submit"
                className={cn(buttonLine, 'mt-6')}
                disabled={isBusy}
            >
                {isBusy ? 'Menyimpan…' : 'Simpan data'}
            </button>
        </form>
    );
}

function PanelSection({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="border-t border-line/20 pt-5">
            <h3 className="mb-4 text-[0.7rem] font-semibold tracking-[0.12em] text-line-soft uppercase">
                {title}
            </h3>
            {children}
        </section>
    );
}

function MemberPanel({
    member,
    onChanged,
    onRemoved,
    onPrint,
}: {
    member: AdminMember;
    onChanged: (member: AdminMember) => void;
    onRemoved: (member: AdminMember) => void;
    onPrint: (member: AdminMember) => void;
}) {
    const [isBusy, setIsBusy] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);
    const cardUrl = memberCardUrl(member.token, window.location.origin);

    async function runAction(action: 'deactivate' | 'reject' | 'rotate-token') {
        setIsBusy(true);
        setNotice(null);

        try {
            const updated = await adminApi.action(member.id, action);

            if (action === 'rotate-token') {
                onChanged(updated);
                setNotice(
                    'QR baru dibuat. Kartu lama tidak berlaku lagi; cetak ulang kartu.',
                );
            } else {
                onRemoved(updated);
            }
        } catch (error) {
            setNotice(errorMessage(error));
        } finally {
            setIsBusy(false);
        }
    }

    function downloadQr() {
        const blob = new Blob([qrSvgMarkup(cardUrl)], {
            type: 'image/svg+xml',
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `qr-${member.memberNumber ?? member.id}.svg`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(cardUrl);
            setNotice('Link kartu disalin.');
        } catch {
            setNotice(cardUrl);
        }
    }

    const handleSaved = (updated: AdminMember) => {
        if (updated.status !== member.status) {
            onRemoved(updated);
        } else {
            onChanged(updated);
            setNotice('Tersimpan.');
        }
    };

    return (
        <div className="space-y-6 bg-surround-raised/60 px-4 py-6 sm:px-6">
            {member.status === 'active' && (
                <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-start">
                    <MemberCard
                        fullName={member.fullName}
                        memberNumber={member.memberNumber ?? '—'}
                        tierName={tierName(member.tierId)}
                        validUntil={member.validUntil}
                        qrValue={cardUrl}
                    />
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                className={buttonBall}
                                onClick={() => onPrint(member)}
                            >
                                Cetak kartu
                            </button>
                            <button
                                type="button"
                                className={buttonLine}
                                onClick={downloadQr}
                            >
                                Unduh QR
                            </button>
                            <button
                                type="button"
                                className={buttonLine}
                                onClick={copyLink}
                            >
                                Salin link
                            </button>
                            <a
                                href={cardUrl}
                                target="_blank"
                                rel="noopener"
                                className={buttonLine}
                            >
                                Buka halaman kartu
                            </a>
                        </div>
                        <p className="text-sm break-all text-line-soft">
                            {cardUrl}
                        </p>
                    </div>
                </div>
            )}

            {notice && (
                <p role="status" className="text-sm text-line">
                    {notice}
                </p>
            )}

            <PanelSection
                title={
                    member.status === 'active'
                        ? 'Perpanjang atau ubah tier'
                        : 'Aktifkan member'
                }
            >
                <ActivateForm
                    member={member}
                    submitLabel={
                        member.status === 'active' ? 'Simpan' : 'Aktifkan'
                    }
                    onSaved={handleSaved}
                />
            </PanelSection>

            <PanelSection title="Data diri">
                <EditIdentityForm member={member} onSaved={handleSaved} />
            </PanelSection>

            <PanelSection title="Tindakan">
                <div className="flex flex-wrap gap-3">
                    {member.status === 'pending' && (
                        <ConfirmButton
                            label="Tolak pendaftaran"
                            confirmLabel="Ya, tolak"
                            isBusy={isBusy}
                            onConfirm={() => void runAction('reject')}
                        />
                    )}
                    {member.status === 'active' && (
                        <>
                            <ConfirmButton
                                label="Ganti QR (kartu hilang)"
                                confirmLabel="Ya, buat QR baru"
                                isBusy={isBusy}
                                onConfirm={() => void runAction('rotate-token')}
                            />
                            <ConfirmButton
                                label="Nonaktifkan"
                                confirmLabel="Ya, nonaktifkan"
                                isBusy={isBusy}
                                onConfirm={() => void runAction('deactivate')}
                            />
                        </>
                    )}
                    {(member.status === 'inactive' ||
                        member.status === 'rejected') && (
                        <p className="text-sm text-line-soft">
                            Aktifkan lewat form di atas bila perlu.
                        </p>
                    )}
                </div>
            </PanelSection>
        </div>
    );
}

function AddMemberForm({
    onCreated,
    onCancel,
}: {
    onCreated: (member: AdminMember) => void;
    onCancel: () => void;
}) {
    const firstTier = membership.tiers[0].id;
    const [identity, setIdentity] = useState<MemberIdentityInput>({
        fullName: '',
        phone: '',
        email: '',
        birthDate: '',
        city: '',
    });
    const [tierId, setTierId] = useState(firstTier);
    const [validUntil, setValidUntil] = useState(defaultValidUntil(firstTier));
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isBusy, setIsBusy] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsBusy(true);

        try {
            onCreated(
                await adminApi.create({ ...identity, tierId, validUntil }),
            );
        } catch (error) {
            setErrors(
                error instanceof MemberApiError
                    ? { ...error.errors, form: error.message }
                    : { form: errorMessage(error) },
            );
        } finally {
            setIsBusy(false);
        }
    }

    return (
        <form
            onSubmit={submit}
            noValidate
            className="space-y-6 border-y-2 border-line py-8"
        >
            <h2 className="font-display text-[2rem] leading-none font-extrabold uppercase">
                Tambah member di venue
            </h2>
            <IdentityFields
                value={identity}
                errors={errors}
                onChange={setIdentity}
            />
            <div className="grid gap-6 sm:grid-cols-2">
                <TierSelect
                    value={tierId}
                    error={errors.tierId}
                    onChange={(nextTier) => {
                        setTierId(nextTier);
                        setValidUntil(defaultValidUntil(nextTier));
                    }}
                />
                <FormField
                    label="Berlaku sampai"
                    type="date"
                    required
                    value={validUntil}
                    error={errors.validUntil}
                    onChange={(event) => setValidUntil(event.target.value)}
                />
            </div>
            {errors.form && <p className="text-sm text-fault">{errors.form}</p>}
            <div className="flex flex-wrap gap-3">
                <button type="submit" className={buttonBall} disabled={isBusy}>
                    {isBusy ? 'Menyimpan…' : 'Simpan & aktifkan'}
                </button>
                <button type="button" className={buttonLine} onClick={onCancel}>
                    Batal
                </button>
            </div>
        </form>
    );
}

function PrintableCard({ member }: { member: AdminMember }) {
    return (
        <div className="hidden p-[10mm] [print-color-adjust:exact] print:block">
            <MemberCard
                fullName={member.fullName}
                memberNumber={member.memberNumber ?? '—'}
                tierName={tierName(member.tierId)}
                validUntil={member.validUntil}
                qrValue={memberCardUrl(member.token, window.location.origin)}
                className="w-[85.6mm]"
            />
        </div>
    );
}

export function AdminPage() {
    useDocumentMeta('Admin member', true);

    const [status, setStatus] = useState<MemberStatus>('pending');
    const [members, setMembers] = useState<AdminMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [openId, setOpenId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [printMember, setPrintMember] = useState<AdminMember | null>(null);
    const [flash, setFlash] = useState<string | null>(null);

    const load = useCallback(async (nextStatus: MemberStatus) => {
        setIsLoading(true);
        setLoadError(null);

        try {
            setMembers(await adminApi.list(nextStatus));
        } catch (error) {
            setLoadError(errorMessage(error));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void load(status);
    }, [load, status]);

    useEffect(() => {
        if (!printMember) {
            return;
        }

        const timer = window.setTimeout(() => window.print(), 100);
        const clear = () => setPrintMember(null);
        window.addEventListener('afterprint', clear);

        return () => {
            window.clearTimeout(timer);
            window.removeEventListener('afterprint', clear);
        };
    }, [printMember]);

    function replaceMember(updated: AdminMember) {
        setMembers((current) =>
            current.map((member) =>
                member.id === updated.id ? updated : member,
            ),
        );
    }

    function removeMember(updated: AdminMember) {
        setMembers((current) =>
            current.filter((member) => member.id !== updated.id),
        );
        setOpenId(null);
        const label = tabs.find((tab) => tab.status === updated.status)?.label;
        setFlash(`${updated.fullName} dipindahkan ke tab “${label}”.`);
    }

    return (
        <>
            <div className="min-h-screen print:hidden">
                <header className="border-b border-line/10 bg-surround">
                    <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
                        <p className="flex items-center gap-2.5 font-display text-[1.45rem] leading-none font-extrabold uppercase">
                            <BallMark className="size-6 shrink-0" />
                            Admin member
                        </p>
                        <a
                            href="/"
                            className="text-sm font-semibold text-line-soft hover:text-line hover:underline"
                        >
                            Lihat situs {venue.shortName}
                        </a>
                    </div>
                </header>

                <main className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-10">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <h1 className="font-display text-[clamp(2.4rem,5vw,3.4rem)] leading-[0.9] font-black uppercase">
                            Member
                        </h1>
                        {!isAdding && (
                            <button
                                type="button"
                                className={buttonBall}
                                onClick={() => setIsAdding(true)}
                            >
                                Tambah member
                            </button>
                        )}
                    </div>

                    {isAdding && (
                        <div className="mt-8">
                            <AddMemberForm
                                onCancel={() => setIsAdding(false)}
                                onCreated={(member) => {
                                    setIsAdding(false);
                                    setFlash(
                                        `${member.fullName} aktif sebagai ${member.memberNumber}.`,
                                    );
                                    setStatus('active');
                                    setOpenId(member.id);
                                    void load('active');
                                }}
                            />
                        </div>
                    )}

                    <div
                        role="tablist"
                        aria-label="Status member"
                        className="mt-8 flex gap-6 overflow-x-auto border-b border-line/20"
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.status}
                                type="button"
                                role="tab"
                                aria-selected={status === tab.status}
                                onClick={() => {
                                    setStatus(tab.status);
                                    setOpenId(null);
                                    setFlash(null);
                                }}
                                className={cn(
                                    '-mb-px cursor-pointer border-b-2 py-3 text-base font-semibold whitespace-nowrap transition-colors',
                                    status === tab.status
                                        ? 'border-ball text-line'
                                        : 'border-transparent text-line-soft hover:text-line',
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {flash && (
                        <p role="status" className="mt-5 text-sm text-line">
                            {flash}
                        </p>
                    )}

                    <div role="tabpanel" className="mt-4">
                        {isLoading && (
                            <div className="animate-pulse space-y-3 py-4">
                                {[0, 1, 2].map((row) => (
                                    <div
                                        key={row}
                                        className="h-14 bg-surround-raised"
                                    />
                                ))}
                            </div>
                        )}

                        {!isLoading && loadError && (
                            <div className="py-8">
                                <p className="text-fault">{loadError}</p>
                                <button
                                    type="button"
                                    className={cn(buttonLine, 'mt-4')}
                                    onClick={() => void load(status)}
                                >
                                    Coba lagi
                                </button>
                            </div>
                        )}

                        {!isLoading && !loadError && members.length === 0 && (
                            <p className="py-10 text-line-soft">
                                {status === 'pending'
                                    ? 'Belum ada pendaftar baru.'
                                    : 'Belum ada member di tab ini.'}
                            </p>
                        )}

                        {!isLoading && !loadError && members.length > 0 && (
                            <ul>
                                {members.map((member) => {
                                    const isOpen = openId === member.id;

                                    return (
                                        <li
                                            key={member.id}
                                            className="border-b border-line/15"
                                        >
                                            <button
                                                type="button"
                                                aria-expanded={isOpen}
                                                onClick={() =>
                                                    setOpenId(
                                                        isOpen
                                                            ? null
                                                            : member.id,
                                                    )
                                                }
                                                className="grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-4 text-left transition-colors hover:bg-surround-raised/40 sm:grid-cols-[minmax(0,1.4fr)_1fr_0.7fr_1fr_auto] sm:px-2"
                                            >
                                                <span className="min-w-0">
                                                    <span className="block truncate font-semibold">
                                                        {member.fullName}
                                                    </span>
                                                    <span className="block text-sm text-line-soft tabular-nums sm:hidden">
                                                        {member.memberNumber ??
                                                            member.phone}
                                                    </span>
                                                </span>
                                                <span className="hidden text-line-soft tabular-nums sm:block">
                                                    {member.phone}
                                                </span>
                                                <span className="hidden sm:block">
                                                    {tierName(
                                                        member.tierId ??
                                                            member.requestedTierId,
                                                    )}
                                                </span>
                                                <span className="hidden text-sm text-line-soft tabular-nums sm:block">
                                                    {member.status === 'active'
                                                        ? `${member.memberNumber} · s/d ${formatLongDate(member.validUntil)}`
                                                        : `Daftar ${formatLongDate(member.createdAt.slice(0, 10))}`}
                                                </span>
                                                <ChevronDownIcon
                                                    className={cn(
                                                        'size-5 transition-transform',
                                                        isOpen && 'rotate-180',
                                                    )}
                                                />
                                            </button>
                                            {isOpen && (
                                                <MemberPanel
                                                    member={member}
                                                    onChanged={replaceMember}
                                                    onRemoved={removeMember}
                                                    onPrint={setPrintMember}
                                                />
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </main>
            </div>

            {printMember && <PrintableCard member={printMember} />}
        </>
    );
}
