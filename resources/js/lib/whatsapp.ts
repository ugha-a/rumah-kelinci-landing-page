import { findTier } from '@/data/membership';
import { venue } from '@/data/venue';
import type { AdminMember } from '@/types/member';

/** 0812… / +62812… / 62812… → 62812… (the form wa.me expects). */
export function toWhatsappNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');

    if (digits.startsWith('0')) {
        return `62${digits.slice(1)}`;
    }

    return digits;
}

function formatDate(isoDate: string | null): string {
    if (!isoDate) {
        return '-';
    }

    return new Date(`${isoDate}T00:00:00`).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

/** Message the admin sends once a membership is active. */
export function memberCardMessage(
    member: AdminMember,
    cardUrl: string,
): string {
    const firstName = member.fullName.split(' ')[0];
    const tierName = member.tierId
        ? (findTier(member.tierId)?.name ?? member.tierId)
        : '';

    return [
        `Halo ${firstName}, keanggotaan ${tierName} Anda di ${venue.name} sudah aktif.`,
        '',
        `Nomor member: ${member.memberNumber ?? '-'}`,
        `Berlaku sampai: ${formatDate(member.validUntil)}`,
        '',
        `Kartu member digital Anda (simpan link ini): ${cardUrl}`,
        '',
        'Kartu fisik ber-QR bisa diambil di venue. Sampai jumpa di lapangan!',
    ].join('\n');
}

export function whatsappChatUrl(phone: string, message: string): string {
    return `https://wa.me/${toWhatsappNumber(phone)}?text=${encodeURIComponent(message)}`;
}
