import { venue } from '@/data/venue';

export function FacilitiesSection() {
    return (
        <section
            id="fasilitas"
            aria-labelledby="fasilitas-title"
            className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
        >
            <div className="mx-auto max-w-[1200px]">
                <h2
                    id="fasilitas-title"
                    className="max-w-[16ch] font-display text-[clamp(2.6rem,5vw,4.2rem)] leading-[0.9] font-black text-balance uppercase"
                >
                    Semua yang ada di luar garis
                </h2>

                <div className="mt-14 grid border-t-2 border-line lg:grid-cols-3">
                    {venue.facilityGroups.map((group, index) => (
                        <div
                            key={group.title}
                            className={
                                index === 0
                                    ? 'py-8 lg:pr-10'
                                    : 'border-t-2 border-line py-8 lg:border-t-0 lg:border-l-2 lg:px-10'
                            }
                        >
                            <h3 className="font-display text-[2rem] leading-none font-extrabold uppercase">
                                {group.title}
                            </h3>
                            <p className="mt-2 text-line-soft">
                                {group.description}
                            </p>
                            <ul className="mt-6 space-y-3">
                                {group.items.map((item) => (
                                    <li
                                        key={item}
                                        className="flex gap-3 text-[1.05rem] leading-snug"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="mt-[0.6em] h-0.5 w-3 shrink-0 bg-line"
                                        />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
