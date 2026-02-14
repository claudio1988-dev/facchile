
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
import { Search, Eye } from 'lucide-react';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';

interface Order {
    id: number;
    order_number: string;
    customer: string;
    status: string;
    total: number;
    created_at: string;
    items_count: number;
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
                                    <TableHead>Estado</TableHead>
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
                                            <TableCell>${parseFloat(order.total.toString()).toLocaleString('es-CL')}</TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/adminfacchile/orders/${order.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="size-4 mr-2" />
                                                        Ver Detalles
                                                    </Button>
                                                </Link>
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
