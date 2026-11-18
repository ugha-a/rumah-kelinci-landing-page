import { useState } from 'react';
import type { FormEvent } from 'react';
import { membership } from '@/data/membership';
import { MemberApiError, registerMember } from '@/lib/member-api';
import { cn } from '@/lib/utils';
import type { RegistrationInput, ValidationErrors } from '@/types/member';
import { actionClasses } from '../landing/action-link';
import { FormField } from './form-field';
import { SubpageShell } from './subpage-shell';

const emptyForm: RegistrationInput = {
    fullName: '',
    phone: '',
    email: '',
    birthDate: '',
    city: '',
    tierId: membership.tiers[0].id,
    consent: false,
    website: '',
};

export function MemberRegisterPage() {
    const [form, setForm] = useState<RegistrationInput>(emptyForm);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    function update<K extends keyof RegistrationInput>(
        key: K,
        value: RegistrationInput[K],
    ) {
        setForm((current) => ({ ...current, [key]: value }));
        setErrors((current) => ({ ...current, [key]: undefined }));
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setFormError(null);

        try {
            await registerMember(form);
            setIsRegistered(true);
            window.scrollTo({ top: 0 });
        } catch (error) {
            if (error instanceof MemberApiError) {
                setErrors(error.errors);
                setFormError(error.message);
            } else {
                setFormError('Terjadi kesalahan. Coba lagi.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isRegistered) {
        return (
            <SubpageShell title="Pendaftaran diterima">
                <div className="mx-auto max-w-[720px] px-4 py-20 sm:px-6 lg:py-28">
                    <h1 className="font-display text-[clamp(2.8rem,7vw,4.6rem)] leading-[0.9] font-black uppercase">
                        Pendaftaran diterima
                    </h1>
                    <p className="mt-6 text-lg leading-relaxed text-line-soft">
                        Terima kasih, {form.fullName.split(' ')[0]}. Admin Rumah
                        Kelinci akan menghubungi nomor WhatsApp{' '}
                        <span className="font-semibold whitespace-nowrap text-line">
                            {form.phone}
                        </span>{' '}
                        untuk pembayaran dan aktivasi. Kartu member ber-QR
                        dicetak setelah keanggotaan aktif.
                    </p>
                    <a
                        href="/"
                        className={cn(
                            actionClasses.base,
                            actionClasses.line,
                            actionClasses.md,
                            'mt-10',
                        )}
                    >
                        Kembali ke beranda
                    </a>
                </div>
            </SubpageShell>
        );
    }

    return (
        <SubpageShell title="Daftar member">
            <form
                noValidate
                onSubmit={submit}
                className="mx-auto grid max-w-[1200px] gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-10 lg:py-24"
            >
                <div>
                    <h1 className="font-display text-[clamp(2.8rem,6vw,4.6rem)] leading-[0.9] font-black uppercase">
                        Daftar member
                    </h1>
                    <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-line-soft">
                        Isi data diri Anda. Admin menghubungi lewat WhatsApp
                        untuk pembayaran dan aktivasi, lalu kartu member dicetak
                        atas nama Anda.
                    </p>

                    <fieldset className="mt-10">
                        <legend className="font-display text-[2rem] leading-none font-extrabold uppercase">
                            Pilih tier
                        </legend>
                        {errors.tierId && (
                            <p className="mt-2 text-sm text-fault">
                                {errors.tierId}
                            </p>
                        )}
                        <div className="mt-5 grid border-t-2 border-line sm:grid-cols-2">
                            {membership.tiers.map((tier, index) => {
                                const isSelected = form.tierId === tier.id;

                                return (
                                    <label
                                        key={tier.id}
                                        className={cn(
                                            'relative cursor-pointer py-6 transition-colors',
                                            index === 0
                                                ? 'sm:pr-6'
                                                : 'border-t-2 border-line sm:border-t-0 sm:border-l-2 sm:pl-6',
                                        )}
                                    >
                                        <input
                                            type="radio"
                                            name="tierId"
                                            value={tier.id}
                                            checked={isSelected}
                                            onChange={() =>
                                                update('tierId', tier.id)
                                            }
                                            className="peer sr-only"
                                        />
                                        <span className="flex items-center gap-3 rounded-sm peer-focus-visible:outline-3 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-ball">
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    'grid size-6 shrink-0 place-items-center rounded-full ring-2 ring-line',
                                                    isSelected && 'ring-ball',
                                                )}
                                            >
                                                {isSelected && (
                                                    <span className="size-3 rounded-full bg-ball" />
                                                )}
                                            </span>
                                            <span className="font-display text-[2rem] leading-none font-black uppercase">
                                                {tier.name}
                                            </span>
                                        </span>
                                        <span className="mt-2 block text-sm text-line-soft">
                                            {tier.priceLabel}
                                        </span>
                                        <ul className="mt-4 space-y-2 text-base">
                                            {tier.benefits.map((benefit) => (
                                                <li
                                                    key={benefit}
                                                    className={cn(
                                                        'flex gap-3 leading-snug',
                                                        !isSelected &&
                                                            'text-line-soft',
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
                                    </label>
                                );
                            })}
                        </div>
                        {membership.isPlaceholder && (
                            <p className="border-t border-line/25 pt-4 text-sm text-line-soft">
                                Benefit dan harga masih contoh dan akan
                                diperbarui.
                            </p>
                        )}
                    </fieldset>
                </div>

                <fieldset className="border-t-2 border-line pt-8 lg:mt-3">
                    <legend className="sr-only">Data diri</legend>
                    <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                        <FormField
                            label="Nama lengkap"
                            autoComplete="name"
                            required
                            value={form.fullName}
                            error={errors.fullName}
                            onChange={(event) =>
                                update('fullName', event.target.value)
                            }
                            className="sm:col-span-2"
                        />
                        <FormField
                            label="Nomor WhatsApp"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder="0812xxxxxxxx"
                            required
                            value={form.phone}
                            error={errors.phone}
                            onChange={(event) =>
                                update('phone', event.target.value)
                            }
                        />
                        <FormField
                            label="Email (opsional)"
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            error={errors.email}
                            onChange={(event) =>
                                update('email', event.target.value)
                            }
                        />
                        <FormField
                            label="Tanggal lahir (opsional)"
                            type="date"
                            autoComplete="bday"
                            value={form.birthDate}
                            error={errors.birthDate}
                            onChange={(event) =>
                                update('birthDate', event.target.value)
                            }
                        />
                        <FormField
                            label="Kota domisili (opsional)"
                            autoComplete="address-level2"
                            value={form.city}
                            error={errors.city}
                            onChange={(event) =>
                                update('city', event.target.value)
                            }
                        />
                    </div>

                    <div aria-hidden="true" className="hidden">
                        <label>
                            Website
                            <input
                                tabIndex={-1}
                                autoComplete="off"
                                value={form.website}
                                onChange={(event) =>
                                    update('website', event.target.value)
                                }
                            />
                        </label>
                    </div>

                    <label className="mt-10 flex cursor-pointer gap-3 leading-snug">
                        <input
                            type="checkbox"
                            checked={form.consent}
                            aria-invalid={errors.consent ? true : undefined}
                            onChange={(event) =>
                                update('consent', event.target.checked)
                            }
                            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-ball"
                        />
                        <span className="text-base text-line-soft">
                            Saya setuju data di atas disimpan Rumah Kelinci
                            Padel dan ditampilkan di halaman kartu member saat
                            QR kartu di-scan.
                        </span>
                    </label>
                    {errors.consent && (
                        <p className="mt-2 text-sm text-fault">
                            {errors.consent}
                        </p>
                    )}

                    {formError && (
                        <p
                            role="alert"
                            className="mt-8 border-t border-fault/60 pt-4 text-fault"
                        >
                            {formError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            actionClasses.base,
                            actionClasses.ball,
                            actionClasses.lg,
                            'mt-8 w-full cursor-pointer disabled:cursor-wait disabled:opacity-70 sm:w-auto',
                        )}
                    >
                        {isSubmitting ? 'Mengirim…' : 'Kirim pendaftaran'}
                    </button>
                </fieldset>
            </form>
        </SubpageShell>
    );
}
