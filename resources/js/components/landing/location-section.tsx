import { formatRupiah, venue } from '@/data/venue';
import { ActionLink } from './action-link';
import { BookingComposer } from './booking-composer';
import { OpeningHours } from './court-hero';
import { ClockIcon, PinIcon } from './icons';

export function LocationSection() {
    const { address } = venue;
    const mapEmbedUrl = `https://www.google.com/maps?q=${address.latitude},${address.longitude}&z=17&output=embed`;

    return (
        <section
            id="lokasi"
            aria-labelledby="lokasi-title"
            className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
        >
            <div className="mx-auto max-w-[1200px]">
                <h2
                    id="lokasi-title"
                    className="font-display text-[clamp(2.6rem,5vw,4.2rem)] leading-[0.9] font-black text-balance uppercase"
                >
                    Datang ke Bawakaraeng 49
                </h2>

                <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
                    <div className="flex flex-col gap-6">
                        <div className="aspect-[4/3] overflow-hidden border-2 border-line bg-surround-raised">
                            <iframe
                                title={`Peta lokasi ${venue.name}`}
                                src={mapEmbedUrl}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="size-full border-0 [filter:saturate(0.75)_contrast(1.05)]"
                            />
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <address className="flex gap-3 not-italic">
                                <PinIcon className="mt-1 size-5 shrink-0" />
                                <span className="leading-relaxed">
                                    {address.street}
                                    <br />
                                    {address.area}
                                    <br />
                                    {address.city}
                                </span>
                            </address>
                            <div className="flex gap-3">
                                <ClockIcon className="mt-1 size-5 shrink-0" />
                                <OpeningHours className="leading-relaxed" />
                            </div>
                        </div>
                        <ActionLink
                            href={address.mapsUrl}
                            variant="line"
                            className="self-start"
                        >
                            Buka di Google Maps
                        </ActionLink>
                    </div>

                    <div
                        id="booking"
                        className="border-2 border-line bg-court p-6 sm:p-8 lg:self-start lg:p-10"
                    >
                        <h3 className="font-display text-[2.4rem] leading-[0.95] font-black uppercase">
                            Booking lapangan
                        </h3>
                        <p className="mt-3 text-line-soft">
                            Mulai {formatRupiah(venue.booking.priceFrom)} per{' '}
                            {venue.booking.priceUnit}. Pilih jam dan bayar
                            langsung di AYO.
                        </p>
                        <ActionLink
                            href={venue.booking.ayoUrl}
                            size="lg"
                            className="mt-6 w-full sm:w-auto"
                        >
                            Booking di AYO
                        </ActionLink>
                        <p className="mt-3 text-[0.8rem] text-line-soft">
                            {venue.booking.policy}
                        </p>

                        <div className="mt-10 border-t-2 border-line pt-8">
                            <BookingComposer />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
