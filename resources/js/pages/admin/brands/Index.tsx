import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Brand {
    id: number;
    name: string;
    slug: string;
    products_count: number;
    created_at: string;
}

interface Props {
    brands: Brand[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Panel Administrativo', href: '/adminfacchile' },
    { title: 'Marcas', href: '/adminfacchile/brands' },
];

export default function Index({ brands }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta marca?')) {
            router.delete(`/adminfacchile/brands/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Marcas - Panel Administrativo" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Marcas</h1>
                        <p className="text-muted-foreground">Gestiona las marcas de productos</p>
                    </div>
                    <Link href="/adminfacchile/brands/create">
                        <Button><Plus className="mr-2 size-4" />Nueva Marca</Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader><CardTitle>Marcas ({brands.length})</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Productos</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {brands.map((brand) => (
                                    <TableRow key={brand.id}>
                                        <TableCell className="font-medium">{brand.name}</TableCell>
                                        <TableCell>{brand.slug}</TableCell>
                                        <TableCell>{brand.products_count}</TableCell>
                                        <TableCell>{brand.created_at}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/adminfacchile/brands/${brand.id}/edit`}>
                                                    <Button variant="outline" size="icon"><Edit className="size-4" /></Button>
                                                </Link>
                                                <Button variant="outline" size="icon" onClick={() => handleDelete(brand.id)}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
