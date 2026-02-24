
import { Head, Link, router } from '@inertiajs/react';
import { formatPrice } from '@/lib/utils';
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
import { ArrowLeft, Package, MapPin, User, Truck, FileText, Download, Edit, CreditCard } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
    metadata: {
        tracking_number?: string;
        [key: string]: any;
    } | null;
    items: OrderItem[];
}

interface Props {
    order: OrderDetail;
}

const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500' },
    confirmed: { label: 'Confirmado', color: 'bg-blue-400' },
    processing: { label: 'En preparación', color: 'bg-blue-600' },
    shipped: { label: 'Enviado', color: 'bg-indigo-500' },
    delivered: { label: 'Entregado', color: 'bg-green-500' },
    cancelled: { label: 'Cancelado', color: 'bg-red-500' },
};

const paymentMethodMap: Record<string, { label: string; color: string }> = {
    webpay: { label: 'WebPay Plus', color: 'bg-purple-500' },
    transfer: { label: 'Transferencia Bancaria', color: 'bg-blue-500' },
    transferencia: { label: 'Transferencia Bancaria', color: 'bg-blue-500' },
    'N/A': { label: 'No especificado', color: 'bg-gray-400' },
};

const paymentStatusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500' },
    paid: { label: 'Pagado', color: 'bg-green-500' },
    failed: { label: 'Fallido', color: 'bg-red-500' },
    refunded: { label: 'Reembolsado', color: 'bg-gray-500' },
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
                                <SelectItem value="confirmed">Confirmado</SelectItem>
                                <SelectItem value="processing">En preparación</SelectItem>
                                <SelectItem value="shipped">Enviado</SelectItem>
                                <SelectItem value="delivered">Entregado</SelectItem>
                                <SelectItem value="cancelled">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                        <Link href={`/adminfacchile/orders/${order.id}/edit`}>
                            <Button variant="outline">
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </Button>
                        </Link>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Comprobante
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Comprobante de Venta</DialogTitle>
                                    <DialogDescription>
                                        Descarga el comprobante de la orden #{order.order_number} en formato PDF.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center space-x-2 py-4">
                                    <div className="grid flex-1 gap-2">
                                        <p className="text-sm font-medium">Resumen del pedido</p>
                                        <div className="rounded-md border p-3 bg-muted/50">
                                            <div className="flex justify-between text-xs">
                                                <span>Cliente:</span>
                                                <span className="font-semibold">{order.customer?.first_name} {order.customer?.last_name}</span>
                                            </div>
                                            <div className="flex justify-between text-xs mt-1">
                                                <span>Items:</span>
                                                <span>{order.items.length}</span>
                                            </div>
                                            <div className="flex justify-between text-xs mt-1">
                                                <span>Total:</span>
                                                <span className="font-semibold">{formatPrice(order.total)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="sm:justify-start">
                                    <a 
                                        href={`/adminfacchile/orders/${order.id}/receipt`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="w-full"
                                    >
                                        <Button className="w-full">
                                            <Download className="mr-2 h-4 w-4" />
                                            Descargar PDF
                                        </Button>
                                    </a>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
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
                                                    {formatPrice(item.unit_price)}
                                                </TableCell>
                                                <TableCell className="text-center">{item.quantity}</TableCell>
                                                <TableCell className="text-right font-bold">
                                                    {formatPrice(item.subtotal)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>



                                {/* Seller Message Display */}
                                {order.metadata?.seller_message && (
                                    <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                                        <h4 className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                            Mensaje para el cliente
                                        </h4>
                                        <p className="text-sm text-blue-800">{order.metadata.seller_message}</p>
                                    </div>
                                )}

                                {/* Totals */}
                                <div className="mt-6 space-y-2 border-t pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Envío</span>
                                        <span>{formatPrice(order.shipping_cost)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Impuesto (19%)</span>
                                        <span>{formatPrice(order.tax)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-dashed">
                                        <span>Total</span>
                                        <span>{formatPrice(order.total)}</span>
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
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">{order.carrier.name}</Badge>
                                        </div>
                                        {order.metadata?.tracking_number && (
                                            <div className="text-sm">
                                                <span className="font-medium text-muted-foreground mr-2">Tracking:</span>
                                                <span className="font-mono">{order.metadata.tracking_number}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground">No asignado</div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="size-5" />
                                    Pago
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Método</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-bold border-2">
                                            {paymentMethodMap[order.metadata?.payment_method?.toLowerCase()]?.label || order.metadata?.payment_method || 'No especificado'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Estado del Pago</p>
                                    <Badge className={paymentStatusMap[order.payment_status]?.color || 'bg-gray-500'}>
                                        {paymentStatusMap[order.payment_status]?.label || order.payment_status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
