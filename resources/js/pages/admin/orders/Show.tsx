
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Package, MapPin, User, Truck } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface OrderItem {
    id: number;
    product_name: string;
    sku: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    image_url: string;
}

interface OrderDetail {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    subtotal: number;
    shipping_cost: number;
    tax: number;
    total: number;
    created_at: string;
    customer: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        rut: string;
    };
    shipping_address: {
        address_line1: string;
        address_line2?: string;
        commune_name: string;
        region_name: string;
        postal_code: string;
    } | null;
    carrier: {
        name: string;
        code: string;
    } | null;
    items: OrderItem[];
}

interface Props {
    order: OrderDetail;
}

const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500' },
    processing: { label: 'Procesando', color: 'bg-blue-500' },
    shipped: { label: 'Enviado', color: 'bg-indigo-500' },
    delivered: { label: 'Entregado', color: 'bg-green-500' },
    cancelled: { label: 'Cancelado', color: 'bg-red-500' },
};

export default function Show({ order }: Props) {
    const handleStatusChange = (value: string) => {
        if (confirm(`¿Cambiar estado del pedido a ${statusMap[value].label}?`)) {
            router.put(`/adminfacchile/orders/${order.id}`, { status: value });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Panel Administrativo', href: '/adminfacchile' },
        { title: 'Pedidos', href: '/adminfacchile/orders' },
        { title: `Orden #${order.order_number}`, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Orden #${order.order_number} - Panel Administrativo`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/adminfacchile/orders">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Orden #{order.order_number}</h1>
                            <p className="text-muted-foreground">{order.created_at}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Select value={order.status} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="processing">Procesando</SelectItem>
                                <SelectItem value="shipped">Enviado</SelectItem>
                                <SelectItem value="delivered">Entregado</SelectItem>
                                <SelectItem value="cancelled">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button>Descargar Factura</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="size-5" />
                                    Items del Pedido
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Producto</TableHead>
                                            <TableHead className="text-right">Precio</TableHead>
                                            <TableHead className="text-center">Cant.</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {item.image_url && (
                                                            <img
                                                                src={item.image_url}
                                                                alt={item.product_name}
                                                                className="size-12 rounded object-cover"
                                                            />
                                                        )}
                                                        <div>
                                                            <p className="font-medium">{item.product_name}</p>
                                                            <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    ${parseFloat(item.unit_price.toString()).toLocaleString('es-CL')}
                                                </TableCell>
                                                <TableCell className="text-center">{item.quantity}</TableCell>
                                                <TableCell className="text-right font-bold">
                                                    ${parseFloat(item.subtotal.toString()).toLocaleString('es-CL')}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Totals */}
                                <div className="mt-6 space-y-2 border-t pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>${parseFloat(order.subtotal.toString()).toLocaleString('es-CL')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Envío</span>
                                        <span>${parseFloat(order.shipping_cost.toString()).toLocaleString('es-CL')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Impuesto (19%)</span>
                                        <span>${parseFloat(order.tax.toString()).toLocaleString('es-CL')}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-dashed">
                                        <span>Total</span>
                                        <span>${parseFloat(order.total.toString()).toLocaleString('es-CL')}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Information */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="size-5" />
                                    Cliente
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {order.customer ? (
                                    <>
                                        <div className="font-medium">
                                            {order.customer.first_name} {order.customer.last_name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                                        <div className="text-sm text-muted-foreground">{order.customer.phone}</div>
                                        <div className="text-sm text-muted-foreground">RUT: {order.customer.rut}</div>
                                    </>
                                ) : (
                                    <div className="text-muted-foreground">Cliente Invitado</div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="size-5" />
                                    Entrega
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {order.shipping_address ? (
                                    <>
                                        <div className="text-sm">
                                            {order.shipping_address.address_line1}
                                            {order.shipping_address.address_line2 && <br />}
                                            {order.shipping_address.address_line2}
                                        </div>
                                        <div className="text-sm font-medium">
                                            {order.shipping_address.commune_name}, {order.shipping_address.region_name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            CP: {order.shipping_address.postal_code}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-sm text-muted-foreground italic">
                                        Sin dirección registrada
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="size-5" />
                                    Transportista
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {order.carrier ? (
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{order.carrier.name}</Badge>
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground">No asignado</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
