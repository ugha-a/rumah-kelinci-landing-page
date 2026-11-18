import { Head } from '@inertiajs/react';
import { CafeSection } from '@/components/landing/cafe-section';
import { CommunitySection } from '@/components/landing/community-section';
import { CourtHero } from '@/components/landing/court-hero';
import { CourtsSection } from '@/components/landing/courts-section';
import { FacilitiesSection } from '@/components/landing/facilities-section';
import { LocationSection } from '@/components/landing/location-section';
import { Scoreboard } from '@/components/landing/scoreboard';
import { SiteFooter } from '@/components/landing/site-footer';
import { SiteNav } from '@/components/landing/site-nav';

export default function Welcome() {
    return (
        <>
            <Head title="Lapangan Padel & Cafe di Makassar" />
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
                <LocationSection />
            </main>
            <SiteFooter />
        </>
    );
}
