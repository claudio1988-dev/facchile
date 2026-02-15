import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';

interface Product {
    id: number;
    name: string;
    slug: string;
    category: string | null;
    brand: string | null;
    base_price: number;
    is_active: boolean;
    is_restricted: boolean;
    main_image_url: string | null;
    created_at: string;
}

interface Category {
    id: number;
    name: string;
}

interface Brand {
    id: number;
    name: string;
}

interface Filters {
    search?: string;
    category_id?: number;
    brand_id?: number;
    is_active?: boolean;
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    products: PaginatedProducts;
    filters: Filters;
    categories: Category[];
    brands: Brand[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Administrativo',
        href: '/adminfacchile',
    },
    {
        title: 'Productos',
        href: '/adminfacchile/products',
    },
];

export default function Index({ products, filters, categories, brands }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/adminfacchile/products', { search }, { preserveState: true });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/adminfacchile/products',
            { ...filters, [key]: value },
            { preserveState: true }
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            router.delete(`/adminfacchile/products/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Productos - Panel Administrativo" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
                        <p className="text-muted-foreground">
                            Gestiona el catálogo de productos de tu tienda
                        </p>
                    </div>
                    <Link href="/adminfacchile/products/create">
                        <Button>
                            <Plus className="mr-2 size-4" />
                            Nuevo Producto
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtros</CardTitle>
                        <CardDescription>Busca y filtra productos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <Input
                                    placeholder="Buscar productos..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Button type="submit" size="icon">
                                    <Search className="size-4" />
                                </Button>
                            </form>

                            <Select
                                value={filters.category_id?.toString() || "all"}
                                onValueChange={(value) =>
                                    handleFilterChange('category_id', value === "all" ? "" : value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Todas las categorías" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las categorías</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id.toString()}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.brand_id?.toString() || "all"}
                                onValueChange={(value) => handleFilterChange('brand_id', value === "all" ? "" : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Todas las marcas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las marcas</SelectItem>
                                    {brands.map((brand) => (
                                        <SelectItem key={brand.id} value={brand.id.toString()}>
                                            {brand.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.is_active?.toString() || "all"}
                                onValueChange={(value) => handleFilterChange('is_active', value === "all" ? "" : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos los estados" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los estados</SelectItem>
                                    <SelectItem value="1">Activos</SelectItem>
                                    <SelectItem value="0">Inactivos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Productos ({products.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Marca</TableHead>
                                    <TableHead>Precio</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center">
                                            No se encontraron productos
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.data.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {product.main_image_url && (
                                                        <img
                                                            src={product.main_image_url}
                                                            alt={product.name}
                                                            className="size-10 rounded object-cover"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {product.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{product.category || '-'}</TableCell>
                                            <TableCell>{product.brand || '-'}</TableCell>
                                            <TableCell>
                                                $
                                                {parseFloat(
                                                    product.base_price.toString()
                                                ).toLocaleString('es-CL')}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        product.is_active ? 'default' : 'secondary'
                                                    }
                                                >
                                                    {product.is_active ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                                {product.is_restricted && (
                                                    <Badge variant="destructive" className="ml-2">
                                                        Restringido
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>{product.created_at}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/adminfacchile/products/${product.id}`}>
                                                        <Button variant="outline" size="icon">
                                                            <Eye className="size-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/adminfacchile/products/${product.id}/edit`}
                                                    >
                                                        <Button variant="outline" size="icon">
                                                            <Edit className="size-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleDelete(product.id)}
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

                        {/* Pagination */}
                        {products.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Mostrando {products.data.length} de {products.total} productos
                                </p>
                                <div className="flex gap-2">
                                    {Array.from({ length: products.last_page }, (_, i) => i + 1).map(
                                        (page) => (
                                            <Button
                                                key={page}
                                                variant={
                                                    page === products.current_page
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    router.get('/adminfacchile/products', {
                                                        ...filters,
                                                        page,
                                                    })
                                                }
                                            >
                                                {page}
                                            </Button>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
