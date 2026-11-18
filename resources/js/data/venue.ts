/**
 * Satu-satunya sumber data venue untuk landing page.
 *
 * Fakta di bawah diambil dari listing AYO Indonesia
 * (https://ayo.co/v/rumah-kelinci-padel) per November 2026.
 * Nilai `null` / string kosong = belum diketahui. Isi di sini,
 * halaman otomatis menampilkan datanya; jangan mengarang angka.
 */

export type FacilityGroup = {
    title: string;
    description: string;
    items: string[];
};

export type VenuePhoto = {
    /** Path di folder public, mis. '/images/cafe.jpg'. `null` = tampilkan slot placeholder. */
    src: string | null;
    alt: string;
    /** Nama file yang disarankan saat mengganti placeholder. */
    suggestedPath: string;
};

export const venue = {
    name: 'Rumah Kelinci Padel',
    shortName: 'Rumah Kelinci',
    city: 'Makassar',

    address: {
        street: 'Jl. Gunung Bawakaraeng No.49',
        area: 'Gaddong, Kec. Bontoala',
        city: 'Kota Makassar, Sulawesi Selatan 90156',
        latitude: -5.134867,
        longitude: 119.42111,
        mapsUrl:
            'https://www.google.com/maps/place/rumah+kelinci+padel/data=!4m2!3m1!1s0x2dbf03bf86445ba5:0x36e949fb12839e67',
    },

    booking: {
        ayoUrl: 'https://ayo.co/v/rumah-kelinci-padel',
        /** TODO: isi nomor WhatsApp admin, format internasional tanpa '+', mis. '6281234567890'. */
        whatsappNumber: '' as string,
        priceFrom: 150000,
        priceUnit: 'sesi',
        priceIncludes: '2 box air mineral 240 ml',
        policy: 'Reservasi di AYO tidak bisa dibatalkan dan tidak ada refund.',
    },

    /** TODO: isi jam operasional, mis. [{ days: 'Setiap hari', hours: '06.00 – 24.00' }]. */
    openingHours: null as { days: string; hours: string }[] | null,

    courts: {
        count: 4,
        standard: 'Standar internasional',
        size: '10 × 20 m',
    },

    rating: {
        source: 'AYO Indonesia',
        sourceUrl: 'https://ayo.co/v/rumah-kelinci-padel',
        checkedAt: 'November 2026',
        overall: 4.9,
        ratingCount: 94,
        reviewCount: 22,
        breakdown: [
            { label: 'Kebersihan', score: 4.8 },
            { label: 'Kondisi lapangan', score: 4.78 },
            { label: 'Komunikasi', score: 4.95 },
        ],
    },

    hospitality: [
        'Welcome drink',
        'Handuk dingin',
        '2 box air mineral tiap sesi',
    ],

    facilityGroups: [
        {
            title: 'Sebelum main',
            description: 'Datang, ganti baju, pemanasan.',
            items: [
                'Gym & area warm-up (mini gym gratis)',
                'Ruang ganti',
                'Sewa raket',
                'Sewa ball machine',
                'Toko olahraga',
            ],
        },
        {
            title: 'Saat main',
            description: 'Tinggal fokus ke bola.',
            items: ['Wasit & score keeper', 'Ballboy', 'Wi-Fi'],
        },
        {
            title: 'Setelah main',
            description: 'Bersih-bersih, lalu duduk.',
            items: [
                'Hot shower & shower',
                'Toilet',
                'Musholla',
                'Nursing room',
                'Cafe & Resto, makanan ringan & minuman',
                'Parkir mobil & motor',
            ],
        },
    ] satisfies FacilityGroup[],

    social: {
        instagram: 'https://www.instagram.com/rumahkelincipadel',
        tiktok: 'https://www.tiktok.com/@rumahkelincipadel',
        handle: '@rumahkelincipadel',
        reclubSearchUrl: 'https://reclub.co',
    },

    photos: {
        cafe: {
            src: null,
            alt: 'Suasana Cafe & Resto Rumah Kelinci Padel',
            suggestedPath: 'public/images/cafe.jpg',
        },
        courts: {
            src: null,
            alt: 'Empat lapangan padel Rumah Kelinci',
            suggestedPath: 'public/images/lapangan.jpg',
        },
    } satisfies Record<string, VenuePhoto>,
} as const;

export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatScore(score: number, fractionDigits: number = 2): string {
    return score.toLocaleString('id-ID', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    });
}

export function whatsappLink(message: string): string | null {
    if (!venue.booking.whatsappNumber) {
        return null;
    }

    return `https://wa.me/${venue.booking.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
