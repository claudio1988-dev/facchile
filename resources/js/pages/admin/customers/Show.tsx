import { Head, Link } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, CreditCard, ShoppingBag, ShieldCheck, ShieldAlert, Eye } from 'lucide-react';

interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    rut: string;
    phone: string;
    birth_date: string;
    is_verified: boolean;
    created_at: string;
    addresses: Array<{
        id: number;
        address_line1: string;
        address_line2: string;
        commune: { name: string };
        is_default_shipping: boolean;
    }>;
    orders: Array<{
        id: number;
        order_number: string;
        created_at: string;
        status: string;
        total: number;
        payment_status: string;
        items: Array<{ id: number; product_name: string; quantity: number }>;
    }>;
}

interface Props {
    customer: Customer;
    stats: {
        total_spent: number;
        total_orders: number;
    };
}

export default function Show({ customer, stats }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Clientes', href: '/adminfacchile/customers' },
        { title: `${customer.first_name} ${customer.last_name}`, href: '#' },
    ];

    const statusMap: Record<string, { label: string; color: string }> = {
        pending: { label: 'Pendiente', color: 'bg-yellow-500' },
        processing: { label: 'Confirmado', color: 'bg-blue-500' },
        completed: { label: 'Completado', color: 'bg-green-500' },
        cancelled: { label: 'Cancelado', color: 'bg-red-500' },
        shipped: { label: 'Enviado', color: 'bg-purple-500' },
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Cliente: ${customer.first_name} ${customer.last_name}`} />

            <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {customer.first_name} {customer.last_name}
                        </h1>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                            <Mail className="size-4" /> {customer.email}
                            <span className="mx-2">|</span>
                            <span className="text-sm">Registrado el {new Date(customer.created_at).toLocaleDateString()}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {customer.is_verified ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200 text-sm py-1 px-3">
                                <ShieldCheck className="w-4 h-4 mr-2" /> Cuenta Verificada
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200 text-sm py-1 px-3">
                                <ShieldAlert className="w-4 h-4 mr-2" /> No Verificado
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left Column: Details & Addresses */}
                    <div className="md:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="size-5" /> Datos Personales
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="text-sm text-muted-foreground">RUT</div>
                                    <div className="font-medium">{customer.rut || 'No registra'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Teléfono</div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="size-4 text-muted-foreground" />
                                        <span className="font-medium">{customer.phone || 'No registra'}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Fecha Nacimiento</div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="size-4 text-muted-foreground" />
                                        <span className="font-medium">{customer.birth_date || 'No registra'}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="size-5" /> Direcciones Guardadas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {customer.addresses.length > 0 ? (
                                    customer.addresses.map((address) => (
                                        <div key={address.id} className="p-3 border rounded-lg bg-muted/50">
                                            <div className="font-medium text-sm">
                                                {address.address_line1} {address.address_line2}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {address.commune?.name}
                                            </div>
                                            {address.is_default_shipping && (
                                                <Badge variant="secondary" className="mt-2 text-xs">Principal Envío</Badge>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-muted-foreground italic">
                                        No hay direcciones registradas.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="size-5" /> Estadísticas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total Gastado</span>
                                    <span className="font-bold text-lg text-green-600">
                                        ${stats.total_spent.toLocaleString('es-CL')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-t pt-4">
                                    <span className="text-sm text-muted-foreground">Total Pedidos</span>
                                    <span className="font-bold text-lg">
                                        {stats.total_orders}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Order History */}
                    <div className="md:col-span-2">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingBag className="size-5" /> Historial de Pedidos
                                </CardTitle>
                                <CardDescription>
                                    Últimos pedidos realizados por el cliente
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>N° Pedido</TableHead>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Pago</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customer.orders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">{order.order_number}</TableCell>
                                                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge className={statusMap[order.status]?.color || 'bg-gray-500'}>
                                                        {statusMap[order.status]?.label || order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={order.payment_status === 'paid' ? 'text-green-600 border-green-200 bg-green-50' : 'text-yellow-600 border-yellow-200 bg-yellow-50'}>
                                                        {order.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>${order.total.toLocaleString('es-CL')}</TableCell>
                                                <TableCell>
                                                    <Link href={`/adminfacchile/orders/${order.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="size-4" />
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {customer.orders.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                    Este cliente aún no ha realizado pedidos.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
