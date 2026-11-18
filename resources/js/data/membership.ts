/**
 * Data program member. Dipakai landing page, form pendaftaran, halaman
 * kartu (scan QR), admin, dan Worker (validasi tier).
 *
 * TODO: benefit dan harga di bawah masih CONTOH. Ganti dengan yang asli,
 * lalu ubah `isPlaceholder` menjadi `false` supaya label "contoh" hilang.
 */

export type MembershipTier = {
    id: string;
    name: string;
    /** Teks harga apa adanya, mis. 'Rp 500.000 / tahun'. */
    priceLabel: string;
    /** Masa aktif default saat admin mengaktifkan member. */
    durationMonths: number;
    benefits: string[];
};

export const membership = {
    isPlaceholder: true,
    programName: 'Member Rumah Kelinci',
    /** Prefix nomor member, mis. RKP-0001. */
    numberPrefix: 'RKP',
    /**
     * Domain yang dicetak di QR kartu, mis. 'https://rumahkelincipadel.com'.
     * Kosong = domain tempat admin membuka halaman. Tetapkan sebelum mencetak
     * kartu, karena QR yang sudah tercetak tidak bisa diubah.
     */
    cardBaseUrl: '' as string,

    tiers: [
        {
            id: 'silver',
            name: 'Silver',
            priceLabel: 'Harga segera diumumkan',
            durationMonths: 12,
            benefits: [
                'Contoh: potongan harga sewa lapangan di jam tertentu',
                'Contoh: prioritas info sesi mabar & turnamen',
                'Contoh: diskon menu di Cafe & Resto',
            ],
        },
        {
            id: 'gold',
            name: 'Gold',
            priceLabel: 'Harga segera diumumkan',
            durationMonths: 12,
            benefits: [
                'Contoh: semua benefit Silver',
                'Contoh: potongan harga sewa lapangan lebih besar',
                'Contoh: gratis sewa raket',
                'Contoh: akses booking lebih awal',
            ],
        },
    ] satisfies MembershipTier[],
} as const;

export type MembershipTierId = (typeof membership.tiers)[number]['id'];

export function findTier(tierId: string): MembershipTier | undefined {
    return membership.tiers.find((tier) => tier.id === tierId);
}

export function formatMemberNumber(memberId: number): string {
    return `${membership.numberPrefix}-${String(memberId).padStart(4, '0')}`;
}

export function memberCardUrl(token: string, origin: string): string {
    const base = membership.cardBaseUrl || origin;

    return `${base.replace(/\/$/, '')}/m/${token}`;
}
