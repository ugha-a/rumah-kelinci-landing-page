import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRightIcon } from './icons';

type ActionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: 'ball' | 'line';
    size?: 'md' | 'lg';
    icon?: ReactNode;
    external?: boolean;
};

export const actionClasses = {
    base: 'group inline-flex items-center justify-center gap-2.5 rounded-full font-semibold whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-300 ease-(--ease-out-expo) active:translate-y-px',
    ball: 'bg-ball text-ink shadow-[0_6px_14px_-6px_rgb(6_13_26/0.6)] hover:bg-line',
    line: 'text-line ring-2 ring-line/80 ring-inset hover:bg-line hover:text-ink',
    md: 'h-11 px-5 text-[0.95rem]',
    lg: 'h-13 px-7 text-base',
};

export function ActionLink({
    variant = 'ball',
    size = 'md',
    icon,
    external = true,
    className,
    children,
    ...props
}: ActionLinkProps) {
    return (
        <a
            className={cn(
                actionClasses.base,
                actionClasses[variant],
                actionClasses[size],
                className,
            )}
            {...(external ? { target: '_blank', rel: 'noopener' } : {})}
            {...props}
        >
            {icon}
            <span>{children}</span>
            {external && (
                <ArrowUpRightIcon className="size-4 transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
        </a>
    );
}
