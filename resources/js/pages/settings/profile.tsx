import { Transition } from '@headlessui/react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';

import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SettingsLayout from '@/layouts/settings/layout';
import { send } from '@/routes/verification';
import profileRoutes from '@/routes/profile';
import type { SharedData } from '@/types';
import { useState, useEffect } from 'react';

interface Region {
    id: number;
    name: string;
    code: string;
}

interface Commune {
    id: number;
    name: string;
    region_id: number;
}

interface Customer {
    id: number;
    rut: string;
    phone: string;
    first_name: string;
    last_name: string;
}

interface Address {
    address_line1: string;
    address_line2: string;
    commune_id: number;
    commune?: Commune;
}

interface ProfileProps {
    mustVerifyEmail: boolean;
    status?: string;
    customer?: Customer;
    address?: Address;
    regions: Region[];
    communes: Commune[];
}

export default function Profile({
    mustVerifyEmail,
    status,
    customer,
    address,
    regions = [],
    communes = []
}: ProfileProps) {
    const { auth } = usePage<SharedData>().props;

    // Determine initial region from address's commune
    const initialRegionId = (() => {
        if (address?.commune?.region_id) return address.commune.region_id.toString();
        if (address?.commune_id) {
            const com = communes.find(c => c.id === address.commune_id);
            return com?.region_id?.toString() || "";
        }
        return "";
    })();

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        rut: customer?.rut || '',
        phone: customer?.phone || '',
        first_name: customer?.first_name || '',
        last_name: customer?.last_name || '',
        address_line1: address?.address_line1 || '',
        address_line2: address?.address_line2 || '',
        region_id: initialRegionId,
        commune_id: address?.commune_id?.toString() || '',
    });

    const [filteredCommunes, setFilteredCommunes] = useState<Commune[]>(() => {
        if (initialRegionId) {
            const rid = parseInt(initialRegionId);
            return communes.filter(c => c.region_id === rid);
        }
        return [];
    });

    useEffect(() => {
        if (data.region_id) {
            const regionId = parseInt(data.region_id);
            setFilteredCommunes(communes.filter(c => c.region_id === regionId));
        } else {
            setFilteredCommunes([]);
        }
    }, [data.region_id, communes]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting profile form...", data);
        patch(profileRoutes.update.url(), {
            preserveScroll: true,
            onSuccess: () => console.log("Profile updated successfully"),
            onError: (errors) => console.error("Profile update failed:", errors),
        });
    };

    return (
        <SettingsLayout>
             <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Información del perfil"
                    description="Actualiza tu información personal y de envío para agilizar tus compras."
                />

                <form onSubmit={submit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre de Usuario</Label>
                            <Input
                                id="name"
                                className="mt-1 block w-full bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                            />
                            <InputError message={errors.email} />
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="first_name">Nombre</Label>
                            <Input
                                id="first_name"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                placeholder="Ej: Juan"
                                className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                            />
                            <InputError message={errors.first_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last_name">Apellido</Label>
                            <Input
                                id="last_name"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                placeholder="Ej: Pérez"
                                className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                            />
                            <InputError message={errors.last_name} />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="rut">RUT</Label>
                            <Input
                                id="rut"
                                value={data.rut}
                                onChange={(e) => setData('rut', e.target.value)}
                                placeholder="12.345.678-9"
                                className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                            />
                            <InputError message={errors.rut} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+56 9 1234 5678"
                                className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                            />
                            <InputError message={errors.phone} />
                        </div>
                    </div>

                    {/* Address Info */}
                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Dirección de Envío Principal</h3>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="region">Región</Label>
                                <Select 
                                    value={data.region_id} 
                                    onValueChange={(val) => {
                                        setData(data => ({ ...data, region_id: val, commune_id: '' }));
                                    }}
                                >
                                    <SelectTrigger className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                                        <SelectValue placeholder="Selecciona una región" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {regions.map((region) => (
                                            <SelectItem key={region.id} value={region.id.toString()}>
                                                {region.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.region_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="commune">Comuna</Label>
                                <Select 
                                    value={data.commune_id} 
                                    onValueChange={(val) => setData('commune_id', val)}
                                    disabled={!data.region_id}
                                >
                                    <SelectTrigger className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                                        <SelectValue placeholder="Selecciona una comuna" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredCommunes.map((commune) => (
                                            <SelectItem key={commune.id} value={commune.id.toString()}>
                                                {commune.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.commune_id} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address_line1">Calle y Número</Label>
                            <Input
                                id="address_line1"
                                value={data.address_line1}
                                onChange={(e) => setData('address_line1', e.target.value)}
                                placeholder="Av. Providencia 1234"
                                className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                            />
                            <InputError message={errors.address_line1} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address_line2">Depto / Casa / Oficina (Opcional)</Label>
                            <Input
                                id="address_line2"
                                value={data.address_line2}
                                onChange={(e) => setData('address_line2', e.target.value)}
                                placeholder="Depto 402"
                                className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                            />
                            <InputError message={errors.address_line2} />
                        </div>
                    </div>

                    {mustVerifyEmail && auth.user.email_verified_at === null && (
                        <div>
                            <p className="-mt-4 text-sm text-muted-foreground">
                                Tu dirección de correo no está verificada.{' '}
                                <Link
                                    href={send()}
                                    as="button"
                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                >
                                    Haz clic aquí para reenviar el correo de verificación.
                                </Link>
                            </p>

                            {status === 'verification-link-sent' && (
                                <div className="mt-2 text-sm font-medium text-green-600">
                                    Se ha enviado un nuevo enlace de verificación a tu correo electrónico.
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-brand-primary hover:bg-brand-secondary text-white"
                        >
                            Guardar Cambios
                        </Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">
                                Guardado correctamente.
                            </p>
                        </Transition>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    );
}
