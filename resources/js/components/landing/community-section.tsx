import { venue } from '@/data/venue';
import { ActionLink } from './action-link';
import { InstagramIcon } from './icons';

export function CommunitySection() {
    return (
        <section
            aria-labelledby="komunitas-title"
            className="bg-court px-4 py-20 sm:px-6 lg:px-10 lg:py-24"
        >
            <div className="mx-auto grid max-w-[1200px] gap-8 border-y-2 border-line py-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16 lg:py-14">
                <h2
                    id="komunitas-title"
                    className="font-display text-[clamp(2.6rem,5.4vw,4.6rem)] leading-[0.9] font-black text-balance uppercase"
                >
                    Belum punya tiga teman main?
                </h2>
                <div>
                    <p className="max-w-[46ch] text-lg leading-relaxed">
                        Padel dimainkan dua lawan dua. Komunitas padel Makassar
                        pernah menggelar sesi Americano, trial court, dan sesi
                        pemula di Rumah Kelinci lewat Reclub, jadi cari sesi
                        terbuka di sana.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <ActionLink href={venue.social.reclubSearchUrl}>
                            Cari sesi di Reclub
                        </ActionLink>
                        <ActionLink
                            href={venue.social.instagram}
                            variant="line"
                            icon={<InstagramIcon className="size-[1.1rem]" />}
                        >
                            {venue.social.handle}
                        </ActionLink>
                    </div>
                </div>
            </div>
        </section>
    );
}
