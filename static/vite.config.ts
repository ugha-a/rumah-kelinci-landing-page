import { cpSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const outDir = `${projectRoot}dist`;

/** Files from Laravel's public/ that the static site also needs. */
const publicFiles = [
    'favicon.ico',
    'favicon.svg',
    'apple-touch-icon.png',
    'robots.txt',
    'images',
];

/**
 * Static build of the landing page for Cloudflare Workers static assets.
 * Run with `npm run build:static`; output goes to `dist/`.
 */
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        {
            name: 'copy-laravel-public-files',
            apply: 'build',
            closeBundle() {
                for (const file of publicFiles) {
                    const source = `${projectRoot}public/${file}`;

                    if (existsSync(source)) {
                        cpSync(source, `${outDir}/${file}`, {
                            recursive: true,
                        });
                    }
                }
            },
        },
    ],
    resolve: {
        alias: {
            '@': `${projectRoot}resources/js`,
        },
    },
    build: {
        outDir,
        emptyOutDir: true,
    },
});
