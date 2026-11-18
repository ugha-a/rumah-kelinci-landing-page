import type { ReactNode } from 'react';
import { formatRupiah, venue, whatsappLink } from '@/data/venue';
import { cn } from '@/lib/utils';
import { ActionLink } from './action-link';
import {
    BookingComposer,
    composeBookingMessage,
    hasWhatsappBooking,
} from './booking-composer';
import { CourtPlan } from './court-plan';
import { ChatIcon, ClockIcon, InstagramIcon, PinIcon } from './icons';

/*
 * Zone proportions follow the court: the back zone is 3.05 m of a 20 m
 * length (15.25%), each service box 6.95 m (34.75%).
 */
const landscapeGrid = 'grid-cols-[15.25%_34.75%_34.75%_15.25%] grid-rows-2';
const portraitGrid = 'grid-cols-2 grid-rows-[15.25%_34.75%_34.75%_15.25%]';

function Zone({
    className,
    children,
}: {
    className?: string;
    children?: ReactNode;
}) {
    return (
        <div className={cn('relative min-h-0 min-w-0', className)}>
            {children}
        </div>
    );
}

function PriceLine({
    className,
    amountClassName = 'text-[clamp(2.4rem,4.4cqw,4rem)]/[0.95]',
    stackUnit = false,
}: {
    className?: string;
    amountClassName?: string;
    stackUnit?: boolean;
}) {
    return (
        <p className={cn('leading-tight', className)}>
            <span className="block text-base text-line-soft">Mulai</span>
            <span
                className={cn(
                    'font-display font-extrabold whitespace-nowrap tabular-nums',
                    amountClassName,
                )}
            >
                {formatRupiah(venue.booking.priceFrom)}
            </span>
            <span
                className={cn(
                    'text-base whitespace-nowrap text-line-soft',
                    stackUnit ? 'block' : 'ml-1.5',
                )}
            >
                / {venue.booking.priceUnit}
            </span>
        </p>
    );
}

export function OpeningHours({ className }: { className?: string }) {
    if (!venue.openingHours) {
        return (
            <p className={cn('leading-snug text-line-soft', className)}>
                Jam buka segera dicantumkan. Slot yang masih kosong bisa dicek
                di AYO.
            </p>
        );
    }

    return (
        <dl className={cn('space-y-1 leading-snug', className)}>
            {venue.openingHours.map((slot) => (
                <div key={slot.days}>
                    <dt className="text-line-soft">{slot.days}</dt>
                    <dd className="font-semibold tabular-nums">{slot.hours}</dd>
                </div>
            ))}
        </dl>
    );
}

function HeroTitle({ className }: { className?: string }) {
    return (
        <h1
            className={cn(
                'font-display font-black tracking-[-0.01em] uppercase',
                className,
            )}
        >
            Rumah Kelinci <span className="whitespace-nowrap">Padel</span>
        </h1>
    );
}

function LandscapeCourt() {
    return (
        <div className="@container relative mx-auto aspect-[2/1] w-[min(100%,calc((100svh-9.5rem)*2))] min-w-[960px]">
            <div className="absolute inset-0 bg-court shadow-[0_40px_80px_-40px_rgb(0_0_0/0.6)]" />
            <CourtPlan
                orientation="landscape"
                animated
                showServe
                className="absolute inset-0"
            />

            <div className={cn('absolute inset-0 grid', landscapeGrid)}>
                <Zone className="row-span-2 flex flex-col justify-end p-[1.6cqw]">
                    <p className="flex flex-col gap-2 text-[0.85rem] leading-snug text-line-soft">
                        <PinIcon className="size-4 text-line" />
                        <span>
                            {venue.address.street}, {venue.address.area}
                        </span>
                    </p>
                </Zone>

                <Zone className="flex items-end px-[2.2cqw] pb-[1.8cqw]">
                    <HeroTitle className="text-[clamp(3.5rem,6.6cqw,6rem)]/[0.86]" />
                </Zone>

                <Zone className="col-start-2 row-start-2 flex flex-col justify-end px-[2.2cqw] pb-[2cqw]">
                    <p className="max-w-[28ch] text-[clamp(1.1rem,1.65cqw,1.45rem)] leading-snug font-medium">
                        Empat lapangan padel standar internasional dan Cafe &
                        Resto di satu rumah, di tengah kota Makassar.
                    </p>
                </Zone>

                <Zone className="col-start-3 row-start-1 flex flex-col justify-start gap-[1.4cqw] px-[2.4cqw] pt-[2cqw]">
                    <PriceLine />
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <ActionLink href={venue.booking.ayoUrl} size="lg">
                            Booking di AYO
                        </ActionLink>
                        <span className="text-[0.8rem] leading-snug text-line-soft">
                            Termasuk {venue.booking.priceIncludes}
                        </span>
                    </div>
                </Zone>

                <Zone className="col-start-3 row-start-2 flex flex-col justify-end px-[2.4cqw] pb-[2cqw]">
                    <BookingComposer compact />
                </Zone>

                <Zone className="col-start-4 row-span-2 row-start-1 flex flex-col justify-between p-[1.6cqw]">
                    <div className="space-y-2 text-[0.85rem]">
                        <ClockIcon className="size-5 text-line" />
                        <OpeningHours />
                    </div>
                    <div className="space-y-3 text-sm">
                        <a
                            href={venue.address.mapsUrl}
                            target="_blank"
                            rel="noopener"
                            className="flex items-center gap-2 font-semibold hover:underline"
                        >
                            <PinIcon className="size-4" /> Rute ke sini
                        </a>
                        <a
                            href={venue.social.instagram}
                            target="_blank"
                            rel="noopener"
                            className="flex items-center gap-2 font-semibold hover:underline"
                        >
                            <InstagramIcon className="size-4" /> Instagram
                        </a>
                    </div>
                </Zone>
            </div>
        </div>
    );
}

function PortraitCourt() {
    const whatsappHref = whatsappLink(composeBookingMessage('', '', '1 jam'));

    return (
        <div className="@container relative mx-auto aspect-[1/2] w-full max-w-[440px]">
            <div className="absolute inset-0 bg-court" />
            <CourtPlan
                orientation="portrait"
                animated
                showServe
                className="absolute inset-0"
            />

            <div className={cn('absolute inset-0 grid', portraitGrid)}>
                <Zone className="col-span-2 flex items-center px-[5cqw]">
                    <HeroTitle className="text-[12.5cqw]/[0.86]" />
                </Zone>

                <Zone className="flex flex-col items-start justify-end gap-[4cqw] p-[5cqw]">
                    <PriceLine
                        amountClassName="text-[8.5cqw]/[0.95]"
                        stackUnit
                    />
                    <ActionLink href={venue.booking.ayoUrl}>Booking</ActionLink>
                </Zone>

                <Zone className="p-[5cqw]">
                    <p className="text-[1rem] leading-snug font-medium">
                        Empat lapangan padel standar internasional dan Cafe &
                        Resto di satu rumah, di tengah kota Makassar.
                    </p>
                </Zone>

                <Zone className="p-[5cqw]">
                    {hasWhatsappBooking() && whatsappHref ? (
                        <ActionLink
                            href={whatsappHref}
                            variant="line"
                            icon={<ChatIcon className="size-[1.1rem]" />}
                        >
                            Tanya slot
                        </ActionLink>
                    ) : (
                        <p className="text-[0.9rem] leading-snug text-line-soft">
                            <ChatIcon className="mb-2 size-5 text-line" />
                            Booking via WhatsApp segera hadir.
                        </p>
                    )}
                </Zone>

                <Zone className="p-[5cqw]">
                    <p className="text-[0.9rem] leading-snug text-line-soft">
                        Disambut welcome drink & handuk dingin. Selesai main,
                        lanjut di Cafe & Resto.
                    </p>
                </Zone>

                <Zone className="col-span-2 flex items-center justify-between gap-4 px-[5cqw]">
                    <p className="flex items-start gap-2 text-[0.8rem] leading-snug text-line-soft">
                        <PinIcon className="mt-px size-4 shrink-0 text-line" />
                        <span>
                            {venue.address.street}
                            <br />
                            {venue.address.area}
                        </span>
                    </p>
                    <a
                        href={venue.address.mapsUrl}
                        target="_blank"
                        rel="noopener"
                        className="shrink-0 text-sm font-semibold underline"
                    >
                        Rute
                    </a>
                </Zone>
            </div>
        </div>
    );
}

export function CourtHero() {
    return (
        <section id="top" aria-label={venue.name} className="relative">
            <div className="hidden px-6 pt-6 pb-10 lg:block xl:px-10">
                <LandscapeCourt />
            </div>

            <div className="px-4 pt-4 pb-12 sm:px-6 sm:pt-8 lg:hidden">
                <PortraitCourt />
            </div>
        </section>
    );
}
