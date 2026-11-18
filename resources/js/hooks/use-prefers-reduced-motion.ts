import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener('change', onChange);

    return () => mediaQuery.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
    return window.matchMedia(query).matches;
}

function getServerSnapshot(): boolean {
    return false;
}

export function usePrefersReducedMotion(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
