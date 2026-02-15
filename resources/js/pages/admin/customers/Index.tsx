import { Head, Link } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, UserPlus, FileCheck } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Customer {
    id: number;
    name: string;
    email: string;
    rut: string;
    is_verified: boolean;
    orders_count: number;
    created_at: string;
}

interface Props {
    customers: {
        data: Customer[];
        current_page: number;
        last_page: number;
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function Index({ customers, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/adminfacchile/customers', { search }, { preserveState: true });
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Clientes', href: '/adminfacchile/customers' },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Clientes" />

            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
                        <p className="text-muted-foreground">Administra la base de datos de clientes y verificaciones.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-background p-4 rounded-lg border">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar por nombre, RUT o email..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button type="submit">Buscar</Button>
                    </form>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Clientes</CardTitle>
                        <CardDescription>Total de clientes registrados: {customers.data.length}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>RUT</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-center">Verificado</TableHead>
                                    <TableHead className="text-center">Pedidos</TableHead>
                                    <TableHead>Registro</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.data.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">{customer.name}</TableCell>
                                        <TableCell>{customer.rut || '-'}</TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell className="text-center">
                                            {customer.is_verified ? (
                                                <Badge className="bg-green-500 hover:bg-green-600">
                                                    <FileCheck className="w-3 h-3 mr-1" /> Sí
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-gray-500">
                                                    No
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">{customer.orders_count}</TableCell>
                                        <TableCell>{customer.created_at}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/adminfacchile/customers/${customer.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="size-4 mr-2" />
                                                    Detalles
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {customers.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No se encontraron clientes.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination links could be added here if needed */}
                        {customers.last_page > 1 && (
                            <div className="mt-4 flex justify-center gap-2">
                                {customers.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        asChild
                                        disabled={!link.url}
                                    >
                                        <Link href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </Button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
