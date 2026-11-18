import { useId, useState } from 'react';
import { venue, whatsappLink } from '@/data/venue';
import { cn } from '@/lib/utils';
import { ActionLink, actionClasses } from './action-link';
import { ChatIcon } from './icons';

const durations = [
    { value: '1', label: '1 jam' },
    { value: '1.5', label: '1,5 jam' },
    { value: '2', label: '2 jam' },
];

function todayIso(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60_000;

    return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function describeDate(isoDate: string): string {
    if (!isoDate) {
        return 'tanggal yang belum ditentukan';
    }

    return new Date(`${isoDate}T00:00:00`).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
}

export function composeBookingMessage(
    isoDate: string,
    time: string,
    durationLabel: string,
): string {
    const timeText = time ? `jam ${time.replace(':', '.')}` : 'jam berapa saja';

    return `Halo ${venue.name}, saya mau booking lapangan hari ${describeDate(isoDate)}, ${timeText}, selama ${durationLabel}. Masih ada slot?`;
}

export function hasWhatsappBooking(): boolean {
    return venue.booking.whatsappNumber !== '';
}

/** Shown instead of live fields while no WhatsApp number is configured. */
export function WhatsappPending({ className }: { className?: string }) {
    return (
        <div className={cn('space-y-3', className)}>
            <p className="flex items-center gap-2 font-semibold">
                <ChatIcon className="size-[1.15rem] shrink-0" />
                Booking via WhatsApp segera hadir
            </p>
            <p className="max-w-[34ch] text-[0.9rem] leading-snug text-line-soft">
                Untuk sekarang, cek slot kosong dan booking langsung di AYO.
            </p>
            <ActionLink
                href={venue.booking.ayoUrl}
                variant="line"
                className="h-10 px-4 text-sm"
            >
                Cek slot di AYO
            </ActionLink>
        </div>
    );
}

type BookingComposerProps = {
    /** Compact drops the live message preview, for tight court zones. */
    compact?: boolean;
    className?: string;
};

export function BookingComposer({
    compact = false,
    className,
}: BookingComposerProps) {
    if (!hasWhatsappBooking()) {
        return <WhatsappPending className={className} />;
    }

    return <BookingComposerForm compact={compact} className={className} />;
}

function BookingComposerForm({
    compact = false,
    className,
}: BookingComposerProps) {
    const fieldId = useId();
    const [date, setDate] = useState(todayIso);
    const [time, setTime] = useState('19:00');
    const [duration, setDuration] = useState(durations[0].value);

    const durationLabel =
        durations.find((option) => option.value === duration)?.label ??
        durations[0].label;
    const message = composeBookingMessage(date, time, durationLabel);
    const href = whatsappLink(message);

    const fieldClasses =
        'h-11 w-full min-w-0 rounded-none border-0 border-b-2 border-line/70 bg-transparent px-0 text-base font-medium text-line tabular-nums transition-colors outline-none focus:border-ball focus-visible:outline-none';
    const labelClasses =
        'mb-1 block text-[0.7rem] font-semibold tracking-[0.12em] text-line-soft uppercase';

    return (
        <form
            className={cn('flex flex-col', className)}
            onSubmit={(event) => {
                event.preventDefault();

                if (href) {
                    window.open(href, '_blank', 'noopener');
                }
            }}
        >
            <fieldset className="grid grid-cols-[1.35fr_1fr_1fr] gap-x-4">
                <legend className="sr-only">
                    Detail slot yang ingin ditanyakan
                </legend>
                <div>
                    <label htmlFor={`${fieldId}-date`} className={labelClasses}>
                        Tanggal
                    </label>
                    <input
                        id={`${fieldId}-date`}
                        type="date"
                        min={todayIso()}
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        className={fieldClasses}
                    />
                </div>
                <div>
                    <label htmlFor={`${fieldId}-time`} className={labelClasses}>
                        Jam
                    </label>
                    <input
                        id={`${fieldId}-time`}
                        type="time"
                        step={1800}
                        value={time}
                        onChange={(event) => setTime(event.target.value)}
                        className={fieldClasses}
                    />
                </div>
                <div className="relative">
                    <label
                        htmlFor={`${fieldId}-duration`}
                        className={labelClasses}
                    >
                        Durasi
                    </label>
                    <select
                        id={`${fieldId}-duration`}
                        value={duration}
                        onChange={(event) => setDuration(event.target.value)}
                        className={cn(
                            fieldClasses,
                            'cursor-pointer appearance-none pr-6',
                        )}
                    >
                        {durations.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                className="bg-surround text-line"
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <svg
                        viewBox="0 0 12 12"
                        aria-hidden="true"
                        className="pointer-events-none absolute right-0 bottom-4 size-3 text-line"
                    >
                        <path
                            d="M2 4.5 6 8.5l4-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.6}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </fieldset>

            {!compact && (
                <p
                    aria-live="polite"
                    className="mt-5 border-l border-line/60 pl-4 text-[0.95rem] leading-relaxed text-line-soft"
                >
                    “{message}”
                </p>
            )}

            <button
                type="submit"
                className={cn(
                    actionClasses.base,
                    actionClasses.line,
                    actionClasses.md,
                    'mt-5 cursor-pointer self-start',
                )}
            >
                <ChatIcon className="size-[1.15rem]" />
                Kirim lewat WhatsApp
            </button>
        </form>
    );
}
