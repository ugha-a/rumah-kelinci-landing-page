import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            {children}
        </svg>
    );
}

export function ArrowUpRightIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            <path d="M7 17 17 7M8 7h9v9" />
        </IconBase>
    );
}

export function ChatIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            <path d="M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5Z" />
            <path d="M9 10.5h6M9 13.5h4" />
        </IconBase>
    );
}

export function PinIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
            <circle cx="12" cy="10" r="2.4" />
        </IconBase>
    );
}

export function InstagramIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
            <circle cx="12" cy="12" r="3.8" />
            <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
        </IconBase>
    );
}

export function ClockIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7.5V12l3 2" />
        </IconBase>
    );
}

export function ChevronDownIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            <path d="m6 9 6 6 6-6" />
        </IconBase>
    );
}

/** Padel ball: a circle with its seam, used as the wordmark's mark. */
export function BallMark(props: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            aria-hidden="true"
            {...props}
        >
            <circle cx="12" cy="12" r="11" fill="var(--color-ball)" />
            <path
                d="M3.2 6.5c4.2 1.6 6.2 5.4 5.2 11.6M20.8 17.5c-4.2-1.6-6.2-5.4-5.2-11.6"
                fill="none"
                stroke="var(--color-ink)"
                strokeOpacity={0.55}
                strokeWidth={1.4}
                strokeLinecap="round"
            />
        </svg>
    );
}
