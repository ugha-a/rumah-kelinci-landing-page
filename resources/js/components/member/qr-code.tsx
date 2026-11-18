import { create } from 'qrcode';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

type QrCodeProps = {
    value: string;
    className?: string;
    title?: string;
};

/** Builds one SVG path for every dark module, with a 2-module quiet zone. */
export function qrPath(value: string): { path: string; size: number } {
    const { modules } = create(value, { errorCorrectionLevel: 'M' });
    const quietZone = 2;
    const commands: string[] = [];

    for (let row = 0; row < modules.size; row++) {
        for (let column = 0; column < modules.size; column++) {
            if (modules.get(row, column)) {
                commands.push(
                    `M${column + quietZone} ${row + quietZone}h1v1h-1z`,
                );
            }
        }
    }

    return { path: commands.join(''), size: modules.size + quietZone * 2 };
}

export function QrCode({ value, className, title }: QrCodeProps) {
    const { path, size } = useMemo(() => qrPath(value), [value]);

    return (
        <svg
            viewBox={`0 0 ${size} ${size}`}
            shapeRendering="crispEdges"
            role="img"
            aria-label={title ?? 'Kode QR kartu member'}
            className={cn('block', className)}
        >
            <rect width={size} height={size} fill="#ffffff" />
            <path d={path} fill="#0b1b33" />
        </svg>
    );
}

/** Standalone SVG file content, for the admin's "Unduh QR" action. */
export function qrSvgMarkup(value: string): string {
    const { path, size } = qrPath(value);

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size * 12}" height="${size * 12}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#ffffff"/><path d="${path}" fill="#0b1b33"/></svg>`;
}
