import { venue } from '@/data/venue';
import { VenuePhoto } from './venue-photo';

export function CafeSection() {
    return (
        <section
            id="cafe"
            aria-labelledby="cafe-title"
            className="px-4 pb-20 sm:px-6 lg:px-10 lg:pb-28"
        >
            <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-16">
                <div className="aspect-[4/3] overflow-hidden border-2 border-line lg:aspect-[5/4]">
                    <VenuePhoto photo={venue.photos.cafe} />
                </div>
                <div>
                    <h2
                        id="cafe-title"
                        className="font-display text-[clamp(2.6rem,5vw,4.2rem)] leading-[0.9] font-black text-balance uppercase"
                    >
                        Selesai main, pindah ke meja
                    </h2>
                    <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-line-soft">
                        Cafe & Resto ada di dalam venue: tempat menunggu giliran
                        main, makan setelah match, atau sekadar ngopi bareng
                        tim. Makanan ringan dan minuman juga tersedia.
                    </p>
                    <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-line-soft">
                        Bawa teman yang belum main padel. Mereka bisa duduk
                        dulu, lalu coba sewa raket di sesi berikutnya.
                    </p>
                </div>
            </div>
        </section>
    );
}
