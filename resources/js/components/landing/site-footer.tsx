import { venue } from '@/data/venue';
import { BallMark } from './icons';

export function SiteFooter() {
    return (
        <footer className="border-t border-line/10 px-4 pt-14 pb-10 sm:px-6 lg:px-10">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="flex items-center gap-3 font-display text-[clamp(2.4rem,6vw,4rem)] leading-none font-black uppercase">
                        <BallMark className="size-[0.8em] shrink-0" />
                        {venue.name}
                    </p>
                    <p className="mt-4 text-line-soft">
                        {venue.address.street}, {venue.address.city}
                    </p>
                </div>
                <ul className="flex flex-wrap gap-x-8 gap-y-3 font-semibold">
                    <li>
                        <a
                            href={venue.social.instagram}
                            target="_blank"
                            rel="noopener"
                            className="hover:underline"
                        >
                            Instagram
                        </a>
                    </li>
                    <li>
                        <a
                            href={venue.social.tiktok}
                            target="_blank"
                            rel="noopener"
                            className="hover:underline"
                        >
                            TikTok
                        </a>
                    </li>
                    <li>
                        <a
                            href={venue.booking.ayoUrl}
                            target="_blank"
                            rel="noopener"
                            className="hover:underline"
                        >
                            AYO
                        </a>
                    </li>
                </ul>
            </div>
            <p className="mx-auto mt-12 max-w-[1200px] text-[0.8rem] text-line-soft/80">
                Rating dan daftar fasilitas dari {venue.rating.source},{' '}
                {venue.rating.checkedAt}. © {new Date().getFullYear()}{' '}
                {venue.name}.
            </p>
        </footer>
    );
}
