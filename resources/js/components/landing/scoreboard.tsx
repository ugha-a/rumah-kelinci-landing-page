import { formatScore, venue } from '@/data/venue';

export function Scoreboard() {
    const { rating } = venue;
    const rows = [
        { label: 'Keseluruhan', score: rating.overall, digits: 1 },
        ...rating.breakdown.map((row) => ({ ...row, digits: 2 })),
    ];

    return (
        <section
            aria-labelledby="skor-title"
            className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
        >
            <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1fr_1.25fr] lg:items-end lg:gap-16">
                <div>
                    <h2
                        id="skor-title"
                        className="font-display text-[clamp(2.6rem,5vw,4.2rem)] leading-[0.9] font-black text-balance uppercase"
                    >
                        Papan skor dari pemain
                    </h2>
                    <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-line-soft">
                        {rating.ratingCount} penilaian dan {rating.reviewCount}{' '}
                        ulasan dari pemain yang booking lewat {rating.source}.
                    </p>
                    <p className="mt-4 text-sm text-line-soft/80">
                        Sumber:{' '}
                        <a
                            href={rating.sourceUrl}
                            target="_blank"
                            rel="noopener"
                            className="text-line underline"
                        >
                            {rating.source}
                        </a>
                        , dicek {rating.checkedAt}.
                    </p>
                </div>

                <div className="border-y-2 border-line">
                    <table className="w-full border-collapse">
                        <caption className="sr-only">
                            Rating {venue.name} di {rating.source}, skala 1
                            sampai 5
                        </caption>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr
                                    key={row.label}
                                    className="border-t border-line/25 first:border-t-0"
                                >
                                    <th
                                        scope="row"
                                        className="py-4 pr-4 text-left text-[clamp(1rem,1.6vw,1.2rem)] font-semibold uppercase"
                                    >
                                        {row.label}
                                    </th>
                                    <td className="py-2 text-right">
                                        <span
                                            className={
                                                index === 0
                                                    ? 'font-display text-[clamp(3rem,6vw,4.6rem)] leading-none font-black tabular-nums'
                                                    : 'font-display text-[clamp(2rem,3.6vw,2.8rem)] leading-none font-extrabold tabular-nums'
                                            }
                                        >
                                            {formatScore(row.score, row.digits)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
