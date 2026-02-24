import type { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * Formatea un valor numérico como precio en pesos chilenos.
 * Sin decimales, con separador de miles.
 * Ejemplo: 12990.5 → "$12.990"
 */
export function formatPrice(value: number | string | null | undefined): string {
    const num = Math.round(Number(value) || 0);
    return `$${num.toLocaleString('es-CL', { maximumFractionDigits: 0 })}`;
}
