import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Layers, Tag, TrendingUp } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Product {
    id: number;
    name: string;
    category: string | null;
    brand: string | null;
    price: number;
    is_active: boolean;
    created_at: string;
}

interface Stats {
    total_products: number;
    active_products: number;
    total_categories: number;
    total_brands: number;
    recent_products: Product[];
}

interface Props {
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Administrativo',
        href: '/adminfacchile',
    },
];

export default function Dashboard({ stats }: Props) {
    const statCards = [
        {
            title: 'Total Productos',
            value: stats.total_products,
            description: `${stats.active_products} activos`,
            icon: Package,
            color: 'text-blue-600',
        },
        {
            title: 'Categorías',
            value: stats.total_categories,
            description: 'Categorías registradas',
            icon: Layers,
            color: 'text-green-600',
        },
        {
            title: 'Marcas',
            value: stats.total_brands,
            description: 'Marcas registradas',
            icon: Tag,
            color: 'text-purple-600',
        },
        {
            title: 'Crecimiento',
            value: '+12%',
            description: 'vs. mes anterior',
            icon: TrendingUp,
            color: 'text-orange-600',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel Administrativo - FacChile" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Panel Administrativo</h1>
                    <p className="text-muted-foreground">
                        Gestiona tu tienda desde un solo lugar
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <Icon className={`size-4 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {stat.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Recent Products */}
                <Card>
                    <CardHeader>
                        <CardTitle>Productos Recientes</CardTitle>
                        <CardDescription>
                            Los últimos 5 productos agregados al sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recent_products.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium leading-none">
                                            {product.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {product.category} • {product.brand || 'Sin marca'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold">
                                            ${parseFloat(product.price.toString()).toLocaleString('es-CL')}
                                        </span>
                                        <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                            {product.is_active ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="cursor-pointer transition-colors hover:bg-accent">
                        <CardHeader>
                            <CardTitle className="text-base">Gestionar Productos</CardTitle>
                            <CardDescription>
                                Ver, crear y editar productos
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="cursor-pointer transition-colors hover:bg-accent">
                        <CardHeader>
                            <CardTitle className="text-base">Gestionar Categorías</CardTitle>
                            <CardDescription>
                                Organiza tus productos por categorías
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="cursor-pointer transition-colors hover:bg-accent">
                        <CardHeader>
                            <CardTitle className="text-base">Gestionar Marcas</CardTitle>
                            <CardDescription>
                                Administra las marcas de tus productos
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
