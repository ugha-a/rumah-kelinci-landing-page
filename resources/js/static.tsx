import { StrictMode } from 'react';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { LandingPage } from '@/components/landing/landing-page';
import { AdminPage } from '@/components/member/admin-page';
import { MemberProfilePage } from '@/components/member/member-profile-page';
import { MemberRegisterPage } from '@/components/member/member-register-page';
import { SubpageShell } from '@/components/member/subpage-shell';
import '../../static/app.css';

/**
 * Entry for the Cloudflare build (`npm run build:static`). The Worker in
 * `worker/index.ts` serves this app for every page and answers `/api/*`.
 */
function NotFoundPage() {
    return (
        <SubpageShell title="Halaman tidak ditemukan" noIndex>
            <div className="mx-auto max-w-[720px] px-4 py-24 sm:px-6">
                <h1 className="font-display text-[clamp(2.8rem,7vw,4.4rem)] leading-[0.9] font-black uppercase">
                    Bola keluar lapangan
                </h1>
                <p className="mt-5 text-lg text-line-soft">
                    Halaman yang Anda cari tidak ada.{' '}
                    <a href="/" className="text-line underline">
                        Kembali ke beranda
                    </a>
                    .
                </p>
            </div>
        </SubpageShell>
    );
}

export function resolvePage(pathname: string): ReactNode {
    const path = pathname.replace(/\/+$/, '') || '/';

    if (path === '/') {
        return <LandingPage />;
    }

    if (path === '/member/daftar') {
        return <MemberRegisterPage />;
    }

    if (path === '/admin') {
        return <AdminPage />;
    }

    const memberMatch = /^\/m\/([A-Za-z0-9_-]{16,64})$/.exec(path);

    if (memberMatch) {
        return <MemberProfilePage token={memberMatch[1]} />;
    }

    return <NotFoundPage />;
}

const container = document.getElementById('app');

if (container) {
    createRoot(container).render(
        <StrictMode>{resolvePage(window.location.pathname)}</StrictMode>,
    );
}
