import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    products_count: number;
    created_at: string;
}

interface Props {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Panel Administrativo', href: '/adminfacchile' },
    { title: 'Categorías', href: '/adminfacchile/categories' },
];

export default function Index({ categories }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            router.delete(`/adminfacchile/categories/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorías - Panel Administrativo" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
                        <p className="text-muted-foreground">Gestiona las categorías de productos</p>
                    </div>
                    <Link href="/adminfacchile/categories/create">
                        <Button><Plus className="mr-2 size-4" />Nueva Categoría</Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader><CardTitle>Categorías ({categories.length})</CardTitle></CardHeader>
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
                                {categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>{category.slug}</TableCell>
                                        <TableCell>{category.products_count}</TableCell>
                                        <TableCell>{category.created_at}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/adminfacchile/categories/${category.id}/edit`}>
                                                    <Button variant="outline" size="icon"><Edit className="size-4" /></Button>
                                                </Link>
                                                <Button variant="outline" size="icon" onClick={() => handleDelete(category.id)}>
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
