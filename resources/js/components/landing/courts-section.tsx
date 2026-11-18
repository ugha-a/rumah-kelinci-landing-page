import { venue } from '@/data/venue';
import { CourtPlan } from './court-plan';

export function CourtsSection() {
    const courtNumbers = Array.from(
        { length: venue.courts.count },
        (_, index) => index + 1,
    );

    return (
        <section
            id="lapangan"
            aria-labelledby="lapangan-title"
            className="bg-court px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
        >
            <div className="mx-auto max-w-[1200px]">
                <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
                    <h2
                        id="lapangan-title"
                        className="font-display text-[clamp(2.6rem,5vw,4.2rem)] leading-[0.9] font-black text-balance uppercase"
                    >
                        Empat lapangan standar internasional
                    </h2>
                    <p className="max-w-[48ch] text-lg leading-relaxed">
                        Ukuran resmi {venue.courts.size}. Tiap sesi sudah
                        termasuk {venue.booking.priceIncludes}; raket dan ball
                        machine bisa disewa di tempat.
                    </p>
                </div>

                <ol className="mt-14 grid grid-cols-4 gap-x-3 sm:gap-x-6 lg:gap-x-8">
                    {courtNumbers.map((number) => (
                        <li key={number}>
                            <div className="relative aspect-[1/2] bg-court-deep">
                                <CourtPlan
                                    orientation="portrait"
                                    animateInView
                                    lineWidth={16}
                                    className="absolute inset-0"
                                />
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-x-0 top-[50%] -translate-y-1/2 text-center font-display text-[clamp(2rem,8vw,6rem)] leading-none font-black text-line/90"
                                >
                                    <span className="bg-court-deep px-2">
                                        {number}
                                    </span>
                                </span>
                            </div>
                            <p className="mt-3 text-[0.62rem] font-semibold tracking-[0.06em] whitespace-nowrap uppercase sm:text-sm sm:tracking-[0.1em]">
                                Lapangan {number}
                            </p>
                        </li>
                    ))}
                </ol>

                <ul className="mt-14 flex flex-wrap gap-x-10 gap-y-3 border-t border-line/30 pt-6 text-base">
                    {venue.hospitality.map((item) => (
                        <li key={item} className="flex items-center gap-3">
                            <span
                                aria-hidden="true"
                                className="h-0.5 w-3 bg-line"
                            />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
