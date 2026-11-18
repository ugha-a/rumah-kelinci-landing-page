import { venue } from '@/data/venue';
import { cn } from '@/lib/utils';
import { BallMark } from '../landing/icons';
import { QrCode } from './qr-code';

type MemberCardProps = {
    fullName: string;
    memberNumber: string;
    tierName: string;
    validUntil?: string | null;
    /** URL encoded in the QR. Without it the back zone stays empty. */
    qrValue?: string;
    className?: string;
};

export function formatCardDate(isoDate: string): string {
    return new Date(`${isoDate}T00:00:00`).toLocaleDateString('id-ID', {
        month: '2-digit',
        year: '2-digit',
    });
}

/**
 * The member card as a half court seen from above (ID-1 size, 85.6 × 54 mm):
 * the net on the left edge, the centre service line splitting the service
 * area, the service line, and the back zone that carries the QR.
 */
export function MemberCard({
    fullName,
    memberNumber,
    tierName,
    validUntil,
    qrValue,
    className,
}: MemberCardProps) {
    return (
        <div
            className={cn(
                '@container relative aspect-[85.6/54] w-full overflow-hidden rounded-[3.7%/5.9%] bg-court text-line',
                className,
            )}
        >
            <svg
                viewBox="0 0 856 540"
                aria-hidden="true"
                className="absolute inset-0 size-full"
            >
                <g fill="none" stroke="var(--color-line)" strokeWidth={5}>
                    <rect x={26} y={26} width={804} height={488} />
                    <path d="M590 26V514" />
                    <path d="M26 270H600" />
                </g>
                <path
                    d="M26 18V522"
                    stroke="var(--color-line)"
                    strokeOpacity={0.85}
                    strokeWidth={14}
                />
            </svg>

            <div className="absolute inset-0 grid grid-cols-[68.9%_1fr] grid-rows-2">
                <div className="flex items-start justify-between gap-[2cqw] py-[5.5cqw] pr-[3cqw] pl-[7cqw]">
                    <p className="flex items-center gap-[1.6cqw] font-display text-[4.4cqw] leading-none font-extrabold uppercase">
                        <BallMark className="size-[5cqw] shrink-0" />
                        {venue.shortName}
                    </p>
                    <p className="font-display text-[4.4cqw] leading-none font-black uppercase">
                        {tierName}
                    </p>
                </div>

                <div className="row-span-2 flex items-center justify-center p-[3.4cqw]">
                    {qrValue ? (
                        <QrCode
                            value={qrValue}
                            className="w-full max-w-[24cqw]"
                        />
                    ) : (
                        <span
                            aria-hidden="true"
                            className="grid aspect-square w-full max-w-[24cqw] place-items-center border-2 border-dashed border-line/50 text-center text-[2.4cqw] leading-tight text-line-soft"
                        >
                            QR
                        </span>
                    )}
                </div>

                <div className="flex flex-col justify-end py-[5.5cqw] pr-[3cqw] pl-[7cqw]">
                    <p className="line-clamp-2 font-display text-[6.6cqw] leading-[0.92] font-black text-balance uppercase">
                        {fullName}
                    </p>
                    <p className="mt-[2cqw] flex gap-[4cqw] text-[2.6cqw] leading-none font-semibold tracking-[0.08em] tabular-nums">
                        <span>{memberNumber}</span>
                        {validUntil && (
                            <span className="text-line-soft">
                                s/d {formatCardDate(validUntil)}
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
