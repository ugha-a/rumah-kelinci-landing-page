import type { VenuePhoto as VenuePhotoData } from '@/data/venue';
import { cn } from '@/lib/utils';

type VenuePhotoProps = {
    photo: VenuePhotoData;
    className?: string;
};

/**
 * Real photo when one is supplied in `venue.photos`; until then an honest,
 * clearly labeled slot telling the owner which file to drop in.
 */
export function VenuePhoto({ photo, className }: VenuePhotoProps) {
    if (photo.src) {
        return (
            <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className={cn('size-full object-cover', className)}
            />
        );
    }

    return (
        <figure
            className={cn(
                'relative flex size-full items-end bg-surround-raised p-5',
                className,
            )}
        >
            <figcaption className="max-w-[32ch] text-sm leading-snug text-line-soft">
                <span className="block font-semibold text-line">
                    Slot foto: {photo.alt}
                </span>
                Ganti dengan foto asli di{' '}
                <code className="text-line">{photo.suggestedPath}</code>
            </figcaption>
        </figure>
    );
}
