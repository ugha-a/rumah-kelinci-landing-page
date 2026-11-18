import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LandingPage } from '@/components/landing/landing-page';
import '../../static/app.css';

/**
 * Entry for the static build (`npm run build:static`) deployed to
 * Cloudflare Workers static assets. No Laravel or Inertia at runtime.
 */
const container = document.getElementById('app');

if (container) {
    createRoot(container).render(
        <StrictMode>
            <LandingPage />
        </StrictMode>,
    );
}
