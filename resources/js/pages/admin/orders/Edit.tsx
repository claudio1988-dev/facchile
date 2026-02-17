import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface OrderEdit {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    carrier_id: number | null;
    tracking_number: string;
}

interface Carrier {
    id: number;
    name: string;
}

interface Props {
    order: OrderEdit;
    carriers: Carrier[];
}

export default function Edit({ order, carriers }: Props) {
    const { data, setData, put, processing, errors, transform } = useForm({
        status: order.status,
        payment_status: order.payment_status,
        carrier_id: order.carrier_id?.toString() || '',
        tracking_number: order.tracking_number || '',
    });

    useEffect(() => {
        transform((data) => ({
            ...data,
            carrier_id: (data.carrier_id && data.carrier_id !== 'unassigned') ? parseInt(data.carrier_id) : null,
        }));
    }, [data.carrier_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/adminfacchile/orders/${order.id}`);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Panel Administrativo', href: '/adminfacchile' },
        { title: 'Pedidos', href: '/adminfacchile/orders' },
        { title: `Editar Orden #${order.order_number}`, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Orden #${order.order_number}`} />

            <div className="space-y-6 p-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link href={`/adminfacchile/orders/${order.id}`}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Editar Orden #{order.order_number}</h1>
                        <p className="text-muted-foreground">Actualiza los detalles del pedido</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles del Pedido</CardTitle>
                            <CardDescription>
                                Modifica el estado, el pago y la información de envío.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Status */}
                            <div className="space-y-2">
                                <Label htmlFor="status">Estado del Pedido</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pendiente</SelectItem>
                                        <SelectItem value="processing">Procesando</SelectItem>
                                        <SelectItem value="shipped">Enviado</SelectItem>
                                        <SelectItem value="delivered">Entregado</SelectItem>
                                        <SelectItem value="cancelled">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                            </div>

                            {/* Payment Status */}
                            <div className="space-y-2">
                                <Label htmlFor="payment_status">Estado de Pago</Label>
                                <Select
                                    value={data.payment_status}
                                    onValueChange={(value) => setData('payment_status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona estado de pago" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pendiente</SelectItem>
                                        <SelectItem value="paid">Pagado</SelectItem>
                                        <SelectItem value="failed">Fallido</SelectItem>
                                        <SelectItem value="refunded">Reembolsado</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.payment_status && <p className="text-sm text-red-500">{errors.payment_status}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Carrier */}
                                <div className="space-y-2">
                                    <Label htmlFor="carrier_id">Transportista</Label>
                                    <Select
                                        value={data.carrier_id}
                                        onValueChange={(value) => setData('carrier_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona transportista" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">No asignado</SelectItem>
                                            {carriers.map((carrier) => (
                                                <SelectItem key={carrier.id} value={carrier.id.toString()}>
                                                    {carrier.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.carrier_id && <p className="text-sm text-red-500">{errors.carrier_id}</p>}
                                </div>

                                {/* Tracking Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="tracking_number">Número de Seguimiento</Label>
                                    <Input
                                        id="tracking_number"
                                        placeholder="Ingrese tracking number"
                                        value={data.tracking_number}
                                        onChange={(e) => setData('tracking_number', e.target.value)}
                                    />
                                    {errors.tracking_number && <p className="text-sm text-red-500">{errors.tracking_number}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 size-4" />
                                    Guardar Cambios
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
