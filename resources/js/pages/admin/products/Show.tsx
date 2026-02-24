
import { Head, Link } from '@inertiajs/react';
import { formatPrice } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface RestrictionType {
    id: number;
    name: string;
}

interface Variant {
    id: number;
    sku: string | null;
    name: string;
    price: string;
    stock_quantity: number;
    is_active: boolean;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    category: { id: number; name: string } | null;
    brand: { id: number; name: string } | null;
    description: string | null;
    short_description: string | null;
    base_price: string;
    is_active: boolean;
    is_restricted: boolean;
    age_verification_required: boolean;
    main_image_url: string | null;
    restrictions: RestrictionType[];
    variants: Variant[];
    created_at: string;
    updated_at: string;
}

interface Props {
    product: Product;
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
    {
        title: 'Ver Producto',
        href: '#',
    },
];

export default function Show({ product }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Ver ${product.name} - Panel Administrativo`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/adminfacchile/products">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
                            <p className="text-muted-foreground">
                                SKU: {product.slug}
                            </p>
                        </div>
                    </div>
                    <Link href={`/adminfacchile/products/${product.id}/edit`}>
                        <Button>
                            <Edit className="mr-2 size-4" />
                            Editar Producto
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información General</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-sm text-muted-foreground">Nombre</h4>
                                        <p>{product.name}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-muted-foreground">Slug</h4>
                                        <p>{product.slug}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground">Descripción Corta</h4>
                                    <p>{product.short_description || '-'}</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground">Descripción Completa</h4>
                                    <div className="prose max-w-none text-sm p-4 bg-muted/50 rounded-md">
                                        {product.description || 'Sin descripción'}
                                    </div>
                                </div>

                                {product.main_image_url && (
                                    <div>
                                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Imagen Principal</h4>
                                        <img 
                                            src={product.main_image_url} 
                                            alt={product.name} 
                                            className="rounded-lg border max-h-64 object-contain"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Variants Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Variantes del Producto</CardTitle>
                                <CardDescription>Tallas, colores y configuraciones.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {product.variants.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">No hay variantes registradas.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {product.variants.map((variant) => (
                                            <div key={variant.id} className="flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium">{variant.name}</p>
                                                        {!variant.is_active && <Badge variant="secondary">Inactivo</Badge>}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">SKU: {variant.sku || '-'} | Stock: {variant.stock_quantity}</p>
                                                </div>
                                                <div className="font-bold text-lg">
                                                    {formatPrice(variant.price)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Clasificación</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground">Categoría</h4>
                                    <p>{product.category?.name || 'Sin categoría'}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground">Marca</h4>
                                    <p>{product.brand?.name || 'Sin marca'}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Precio y Estado</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground">Precio Base</h4>
                                    <p className="text-2xl font-bold">{formatPrice(product.base_price)}</p>
                                </div>
                                
                                <div className="space-y-2 pt-2 border-t">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Estado Global:</span>
                                        <Badge variant={product.is_active ? 'default' : 'destructive'}>
                                            {product.is_active ? 'Publicado' : 'Borrador'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Stock Total:</span>
                                        <Badge variant={product.variants.reduce((acc, v) => acc + v.stock_quantity, 0) > 0 ? 'outline' : 'secondary'}>
                                            {product.variants.reduce((acc, v) => acc + v.stock_quantity, 0)} unidades
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Restringido:</span>
                                        <Badge variant={product.is_restricted ? 'destructive' : 'outline'}>
                                            {product.is_restricted ? 'Sí' : 'No'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Verif. Edad:</span>
                                        <Badge variant={product.age_verification_required ? 'secondary' : 'outline'}>
                                            {product.age_verification_required ? 'Sí' : 'No'}
                                        </Badge>
                                    </div>
                                </div>

                                {product.restrictions.length > 0 && (
                                    <div className="pt-4 border-t">
                                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Restricciones Activas</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {product.restrictions.map((type) => (
                                                <Badge key={type.id} variant="outline" className="border-red-200 text-red-700 bg-red-50">
                                                    {type.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        
                        <Card>
                             <CardHeader>
                                <CardTitle>Metadatos</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground space-y-2">
                                <div className="flex justify-between">
                                    <span>Creado:</span>
                                    <span>{new Date(product.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Actualizado:</span>
                                    <span>{new Date(product.updated_at).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
