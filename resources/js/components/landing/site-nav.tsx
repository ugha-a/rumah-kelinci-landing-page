import { venue } from '@/data/venue';
import { ActionLink } from './action-link';
import { BallMark } from './icons';

const links = [
    { href: '#lapangan', label: 'Lapangan' },
    { href: '#fasilitas', label: 'Fasilitas' },
    { href: '#cafe', label: 'Cafe' },
    { href: '#lokasi', label: 'Lokasi' },
];

export function SiteNav() {
    return (
        <header className="sticky top-0 z-30 border-b border-line/10 bg-surround/90 backdrop-blur-md">
            <nav
                aria-label="Navigasi utama"
                className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10"
            >
                <a
                    href="#top"
                    className="flex items-center gap-2.5 font-display text-[1.45rem] leading-none font-extrabold tracking-[0.01em] uppercase"
                >
                    <BallMark className="size-6 shrink-0" />
                    <span>
                        {venue.shortName}
                        <span className="ml-1.5 text-line-soft">Padel</span>
                    </span>
                </a>

                <ul className="hidden items-center gap-8 text-[0.95rem] font-medium text-line-soft lg:flex">
                    {links.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className="transition-colors hover:text-line hover:underline"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <ActionLink
                    href={venue.booking.ayoUrl}
                    className="h-10 px-4 text-sm"
                >
                    Booking
                </ActionLink>
            </nav>
        </header>
    );
}
