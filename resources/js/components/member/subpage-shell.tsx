import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { venue } from '@/data/venue';
import { SiteFooter } from '../landing/site-footer';
import { SiteNav } from '../landing/site-nav';

type SubpageShellProps = {
    title: string;
    /** Keep personal pages (member cards) out of search engines. */
    noIndex?: boolean;
    children: ReactNode;
};

export function useDocumentMeta(title: string, noIndex: boolean): void {
    useEffect(() => {
        document.title = `${title} - ${venue.name}`;

        if (!noIndex) {
            return;
        }

        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, nofollow';
        document.head.append(meta);

        return () => meta.remove();
    }, [title, noIndex]);
}

export function SubpageShell({
    title,
    noIndex = false,
    children,
}: SubpageShellProps) {
    useDocumentMeta(title, noIndex);

    return (
        <>
            <SiteNav />
            <main>{children}</main>
            <SiteFooter />
        </>
    );
}
