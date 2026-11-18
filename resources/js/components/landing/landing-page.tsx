import { CafeSection } from './cafe-section';
import { CommunitySection } from './community-section';
import { CourtHero } from './court-hero';
import { CourtsSection } from './courts-section';
import { FacilitiesSection } from './facilities-section';
import { LocationSection } from './location-section';
import { MembershipSection } from './membership-section';
import { Scoreboard } from './scoreboard';
import { SiteFooter } from './site-footer';
import { SiteNav } from './site-nav';

/**
 * The whole landing page. Rendered by the Inertia `welcome` page in Laravel
 * and by `resources/js/static.tsx` for the static Cloudflare build.
 */
export function LandingPage() {
    return (
        <>
            <a
                href="#top"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ball focus:px-4 focus:py-2 focus:text-ink"
            >
                Lewati ke konten
            </a>
            <SiteNav />
            <main>
                <CourtHero />
                <Scoreboard />
                <CourtsSection />
                <FacilitiesSection />
                <CafeSection />
                <CommunitySection />
                <MembershipSection />
                <LocationSection />
            </main>
            <SiteFooter />
        </>
    );
}
