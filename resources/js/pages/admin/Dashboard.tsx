import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Layers, Tag, ShoppingCart, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react';
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

interface Order {
    id: number;
    order_number: string;
    customer: string;
    total: string;
    status: string;
    created_at: string;
}

interface LowStockProduct {
    id: number;
    name: string;
    variants: {
        name: string;
        stock: number;
    }[];
}

interface Stats {
    total_products: number;
    active_products: number;
    total_categories: number;
    total_brands: number;
    total_orders: number;
    total_revenue: number;
    low_stock_products: LowStockProduct[];
    recent_orders: Order[];
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
            title: 'Ingresos Totales',
            value: `$${parseFloat(stats.total_revenue.toString()).toLocaleString('es-CL')}`,
            description: 'Total ventas históricas',
            icon: DollarSign,
            color: 'text-emerald-600',
        },
        {
            title: 'Pedidos',
            value: stats.total_orders,
            description: 'Pedidos realizados',
            icon: ShoppingCart,
            color: 'text-blue-600',
        },
        {
            title: 'Productos',
            value: stats.total_products,
            description: `${stats.active_products} activos`,
            icon: Package,
            color: 'text-indigo-600',
        },
        {
            title: 'Alertas Stock',
            value: stats.low_stock_products.length,
            description: 'Productos con bajo stock',
            icon: AlertTriangle,
            color: 'text-amber-600',
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
                        Vista general de tu tienda y rendimiento
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

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    
                    {/* Recent Orders - Takes 4 columns */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Pedidos Recientes</CardTitle>
                            <CardDescription>
                                Últimos 5 pedidos recibidos.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {stats.recent_orders.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">No hay pedidos registrados.</p>
                            ) : (
                                <div className="space-y-8">
                                    {stats.recent_orders.map((order) => (
                                        <div key={order.id} className="flex items-center">
                                            <div className="space-y-1 flex-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {order.customer}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    #{order.order_number} • {order.created_at}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge variant={order.status === 'paid' ? 'default' : 'outline'}>
                                                    {order.status}
                                                </Badge>
                                                <div className="font-medium">
                                                    ${parseFloat(order.total).toLocaleString('es-CL')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Low Stock & Quick Actions - Takes 3 columns */}
                    <div className="col-span-3 space-y-6">
                        
                        {/* Low Stock Alerts */}
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-amber-700">
                                    <AlertTriangle className="size-5" />
                                    Alertas de Stock
                                </CardTitle>
                                <CardDescription>
                                    Variantes con menos de 5 unidades.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {stats.low_stock_products.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-2">Todo el inventario está saludable.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {stats.low_stock_products.map((product) => (
                                            <div key={product.id} className="border-b pb-2 last:border-0 last:pb-0">
                                                <Link href={`/adminfacchile/products/${product.id}/edit`} className="font-medium text-sm hover:underline">
                                                    {product.name}
                                                </Link>
                                                <div className="mt-1 space-y-1">
                                                    {product.variants.map((v, idx) => (
                                                        <div key={idx} className="flex justify-between text-xs text-muted-foreground">
                                                            <span>{v.name}</span>
                                                            <span className="font-bold text-red-600">{v.stock} un.</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Accesos Rápidos</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <Link href="/adminfacchile/products/create">
                                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <Package className="h-6 w-6 mb-2 text-indigo-600" />
                                        <span className="text-xs font-medium text-center">Nuevo Producto</span>
                                    </div>
                                </Link>
                                <Link href="/adminfacchile/orders">
                                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <ShoppingCart className="h-6 w-6 mb-2 text-blue-600" />
                                        <span className="text-xs font-medium text-center">Ver Pedidos</span>
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>

                    </div>
                </div>

                {/* Recent Products Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Últimos Productos Agregados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 h-[200px] overflow-y-auto pr-2">
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
                                        <Link href={`/adminfacchile/products/${product.id}/edit`}>
                                            <ArrowRight className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
