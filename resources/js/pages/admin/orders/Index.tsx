
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Search, Eye, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn, formatPrice } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

interface Order {
    id: number;
    order_number: string;
    customer: string;
    status: string;
    total: number;
    created_at: string;
    items_count: number;
    payment_method: string;
    payment_status: string;
}

interface Filters {
    search?: string;
    status?: string;
}

interface PaginatedOrders {
    data: Order[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    orders: PaginatedOrders;
    filters: Filters;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Panel Administrativo', href: '/adminfacchile' },
    { title: 'Pedidos', href: '/adminfacchile/orders' },
];

const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500' },
    processing: { label: 'Procesando', color: 'bg-blue-500' },
    shipped: { label: 'Enviado', color: 'bg-indigo-500' },
    delivered: { label: 'Entregado', color: 'bg-green-500' },
    cancelled: { label: 'Cancelado', color: 'bg-red-500' },
};

const paymentMethodMap: Record<string, { label: string; color: string }> = {
    webpay: { label: 'Webpay', color: 'bg-purple-500' },
    transfer: { label: 'Transferencia', color: 'bg-blue-500' },
    transferencia: { label: 'Transferencia', color: 'bg-blue-500' },
    'N/A': { label: 'No especificado', color: 'bg-gray-400' },
};

const paymentStatusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500 text-white' },
    verifying: { label: 'En verificación', color: 'bg-amber-500 text-white' },
    paid: { label: 'Pagado', color: 'bg-green-500 text-white' },
    failed: { label: 'Fallido', color: 'bg-red-500 text-white' },
    refunded: { label: 'Reembolsado', color: 'bg-gray-500 text-white' },
};

export default function Index({ orders, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/adminfacchile/orders', { search }, { preserveState: true });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/adminfacchile/orders',
            { ...filters, [key]: value === 'all' ? '' : value },
            { preserveState: true }
        );
    };

    const handleDelete = (id: number, orderNumber: string) => {
        if (confirm(`¿Eliminar el pedido ${orderNumber}? Esta acción es irreversible.`)) {
            router.delete(`/adminfacchile/orders/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pedidos - Panel Administrativo" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
                        <p className="text-muted-foreground">Gestiona las órdenes de compra</p>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-sm">
                                <Input
                                    placeholder="Buscar por Nº Orden, Cliente o RUT..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Button type="submit" size="icon">
                                    <Search className="size-4" />
                                </Button>
                            </form>

                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(value) => handleFilterChange('status', value)}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Estado del pedido" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="pending">Pendiente</SelectItem>
                                    <SelectItem value="processing">Procesando</SelectItem>
                                    <SelectItem value="shipped">Enviado</SelectItem>
                                    <SelectItem value="delivered">Entregado</SelectItem>
                                    <SelectItem value="cancelled">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nº Orden</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Estado Pedido</TableHead>
                                    <TableHead>Medio Pago</TableHead>
                                    <TableHead>Estado Pago</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            No se encontraron pedidos
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.data.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">{order.order_number}</TableCell>
                                            <TableCell>{order.customer}</TableCell>
                                            <TableCell>{order.created_at}</TableCell>
                                            <TableCell>
                                                <Badge className={statusMap[order.status]?.color || 'bg-gray-500'}>
                                                    {statusMap[order.status]?.label || order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn("border-2 font-bold", paymentMethodMap[(order.payment_method || 'N/A').toLowerCase()]?.color.replace('bg-', 'text-').replace('500', '600') || 'text-gray-500')}>
                                                    {paymentMethodMap[(order.payment_method || 'N/A').toLowerCase()]?.label || order.payment_method}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={
                                                    (order.payment_method?.toLowerCase() === 'transfer' && order.payment_status === 'pending')
                                                        ? paymentStatusMap.verifying.color
                                                        : (paymentStatusMap[order.payment_status]?.color || 'bg-gray-500')
                                                }>
                                                    {(order.payment_method?.toLowerCase() === 'transfer' && order.payment_status === 'pending')
                                                        ? paymentStatusMap.verifying.label
                                                        : (paymentStatusMap[order.payment_status]?.label || order.payment_status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{formatPrice(order.total)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    <Link href={`/adminfacchile/orders/${order.id}`}>
                                                        <Button variant="outline" size="icon" title="Ver detalle">
                                                            <Eye className="size-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/adminfacchile/orders/${order.id}/edit`}>
                                                        <Button variant="outline" size="icon" title="Editar">
                                                            <Edit2 className="size-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        title="Eliminar"
                                                        onClick={() => handleDelete(order.id, order.order_number)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
