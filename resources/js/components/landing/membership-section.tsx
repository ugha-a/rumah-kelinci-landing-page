import { membership } from '@/data/membership';
import { MemberCard } from '../member/member-card';
import { ActionLink } from './action-link';

const steps = [
    {
        title: 'Daftar online',
        description: 'Isi data diri dan pilih tier di halaman pendaftaran.',
    },
    {
        title: 'Aktivasi di venue',
        description:
            'Admin menghubungi lewat WhatsApp; selesaikan pembayaran di Rumah Kelinci.',
    },
    {
        title: 'Terima kartu',
        description:
            'Kartu ber-QR dicetak atas nama Anda. Tunjukkan saat booking atau di kasir.',
    },
];

export function MembershipSection() {
    return (
        <section
            id="member"
            aria-labelledby="member-title"
            className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
        >
            <div className="mx-auto max-w-[1200px]">
                <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
                    <div>
                        <h2
                            id="member-title"
                            className="font-display text-[clamp(2.6rem,5vw,4.2rem)] leading-[0.9] font-black text-balance uppercase"
                        >
                            Jadi member Rumah Kelinci
                        </h2>
                        <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-line-soft">
                            Satu kartu untuk semua benefit member. Saat QR di
                            kartu di-scan, terbuka halaman profil Anda lengkap
                            dengan tier, masa aktif, dan benefitnya.
                        </p>

                        <figure className="mt-10 max-w-[460px]">
                            <MemberCard
                                fullName="Nama Anda"
                                memberNumber={`${membership.numberPrefix}-0000`}
                                tierName={membership.tiers[1].name}
                                qrValue={`${window.location.origin}/member/daftar`}
                            />
                            <figcaption className="mt-3 text-sm text-line-soft">
                                Contoh tampilan kartu member.
                            </figcaption>
                        </figure>
                    </div>

                    <div>
                        <div className="grid border-t-2 border-line sm:grid-cols-2">
                            {membership.tiers.map((tier, index) => (
                                <div
                                    key={tier.id}
                                    className={
                                        index === 0
                                            ? 'py-8 sm:pr-8'
                                            : 'border-t-2 border-line py-8 sm:border-t-0 sm:border-l-2 sm:pl-8'
                                    }
                                >
                                    <h3 className="font-display text-[2.4rem] leading-none font-black uppercase">
                                        {tier.name}
                                    </h3>
                                    <p className="mt-2 text-line-soft">
                                        {tier.priceLabel}
                                    </p>
                                    <ul className="mt-6 space-y-3">
                                        {tier.benefits.map((benefit) => (
                                            <li
                                                key={benefit}
                                                className="flex gap-3 leading-snug"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className="mt-[0.6em] h-0.5 w-3 shrink-0 bg-line"
                                                />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {membership.isPlaceholder && (
                            <p className="border-t border-line/25 pt-4 text-sm text-line-soft">
                                Benefit dan harga di atas masih contoh dan akan
                                diperbarui.
                            </p>
                        )}

                        <ol className="mt-10 grid gap-6 border-t-2 border-line pt-8 sm:grid-cols-3">
                            {steps.map((step, index) => (
                                <li key={step.title}>
                                    <p className="flex items-baseline gap-2 font-display text-[2rem] leading-none font-extrabold uppercase">
                                        <span className="tabular-nums">
                                            {index + 1}
                                        </span>
                                        {step.title}
                                    </p>
                                    <p className="mt-2 text-base leading-snug text-line-soft">
                                        {step.description}
                                    </p>
                                </li>
                            ))}
                        </ol>

                        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
                            <ActionLink
                                href="/member/daftar"
                                size="lg"
                                external={false}
                            >
                                Daftar member
                            </ActionLink>
                            <span className="text-sm text-line-soft">
                                Gratis mendaftar, bayar saat aktivasi.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
