
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ArrowLeft, Trash, Edit as EditIcon } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Brand {
    id: number;
    name: string;
}

interface ShippingClass {
    id: number;
    name: string;
}

interface RestrictionType {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    brand_id: number | null;
    shipping_class_id: number;
    description: string | null;
    short_description: string | null;
    base_price: string;
    is_active: boolean;
    is_restricted: boolean;
    age_verification_required: boolean;
    main_image_url: string | null;
    restriction_type_ids: number[];
    variants: Variant[];
}

interface Variant {
    id: number;
    sku: string | null;
    name: string;
    price: string;
    stock_quantity: number;
    is_active: boolean;
}

interface Props {
    product: Product;
    categories: Category[];
    brands: Brand[];
    shippingClasses: ShippingClass[];
    restrictionTypes: RestrictionType[];
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
        title: 'Editar Producto',
        href: '#',
    },
];

export default function Edit({ product, categories, brands, shippingClasses, restrictionTypes }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        slug: product.slug,
        category_id: product.category_id,
        brand_id: product.brand_id,
        shipping_class_id: product.shipping_class_id,
        description: product.description || '',
        short_description: product.short_description || '',
        base_price: product.base_price,
        is_active: Boolean(product.is_active),
        is_restricted: Boolean(product.is_restricted),
        age_verification_required: Boolean(product.age_verification_required),
        main_image_url: product.main_image_url || '',
        restriction_type_ids: product.restriction_type_ids || [],
    });

    const [newVariant, setNewVariant] = useState({
        name: '',
        sku: '',
        price: '',
        stock_quantity: '',
        is_active: true
    });

    const [editingVariantId, setEditingVariantId] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/adminfacchile/products/${product.id}`);
    };

    const resetVariantForm = () => {
        setNewVariant({
            name: '',
            sku: '',
            price: '',
            stock_quantity: '',
            is_active: true
        });
        setEditingVariantId(null);
    };

    const handleCreateVariant = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/adminfacchile/products/${product.id}/variants`, newVariant, {
            onSuccess: () => resetVariantForm(),
            preserveScroll: true
        });
    };

    const handleEditVariant = (variant: Variant) => {
        setEditingVariantId(variant.id);
        setNewVariant({
            name: variant.name,
            sku: variant.sku || '',
            price: variant.price,
            stock_quantity: variant.stock_quantity.toString(),
            is_active: variant.is_active
        });
    };

    const handleUpdateVariant = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingVariantId) return;

        router.put(`/adminfacchile/products/${product.id}/variants/${editingVariantId}`, newVariant, {
            onSuccess: () => resetVariantForm(),
            preserveScroll: true
        });
    };

    const handleDeleteVariant = (variantId: number) => {
        if (confirm('¿Estás seguro de eliminar esta variante?')) {
            router.delete(`/adminfacchile/products/${product.id}/variants/${variantId}`, {
                preserveScroll: true
            });
        }
    };

    const handleRestrictionChange = (id: number, checked: boolean) => {
        const current = data.restriction_type_ids;
        if (checked) {
            setData('restriction_type_ids', [...current, id]);
        } else {
            setData('restriction_type_ids', current.filter((i) => i !== id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${product.name} - Panel Administrativo`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/adminfacchile/products">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Editar Producto</h1>
                        <p className="text-muted-foreground">
                            {product.name}
                        </p>
                    </div>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información General</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre del Producto *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug (URL) *</Label>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                        />
                                        {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="short_description">Descripción Corta</Label>
                                        <Input
                                            id="short_description"
                                            value={data.short_description}
                                            onChange={(e) => setData('short_description', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descripción Completa</Label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="main_image_url">URL de Imagen</Label>
                                        <Input
                                            id="main_image_url"
                                            value={data.main_image_url}
                                            onChange={(e) => setData('main_image_url', e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Variants Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Variantes del Producto</CardTitle>
                                    <CardDescription>Añade tallas, colores o configuraciones diferentes.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Existing Variants List */}
                                    <div className="space-y-4">
                                        {product.variants.map((variant) => (
                                            <div key={variant.id} className={cn("flex items-center justify-between p-4 border rounded-lg transition-colors", editingVariantId === variant.id ? "border-brand-primary bg-brand-primary/5" : "")}>
                                                <div>
                                                    <p className="font-medium">{variant.name}</p>
                                                    <p className="text-sm text-muted-foreground">SKU: {variant.sku} | Stock: {variant.stock_quantity}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold mr-2">${parseFloat(variant.price).toLocaleString('es-CL')}</span>
                                                    <Button type="button" variant="outline" size="icon" onClick={() => handleEditVariant(variant)}>
                                                        <EditIcon className="size-4" />
                                                    </Button>
                                                    <Button type="button" variant="destructive" size="icon" onClick={() => handleDeleteVariant(variant.id)}>
                                                        <Trash className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-4 mt-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium">{editingVariantId ? 'Editar Variante' : 'Agregar Nueva Variante'}</h4>
                                            {editingVariantId && (
                                                <Button type="button" variant="ghost" size="sm" onClick={resetVariantForm}>
                                                    Cancelar Edición
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <Label>Nombre (ej. Talla L)</Label>
                                                <Input 
                                                    value={newVariant.name}
                                                    onChange={(e) => setNewVariant({...newVariant, name: e.target.value})}
                                                    placeholder="Nombre de la variante"
                                                />
                                            </div>
                                            <div>
                                                <Label>SKU</Label>
                                                <Input 
                                                    value={newVariant.sku}
                                                    onChange={(e) => setNewVariant({...newVariant, sku: e.target.value})}
                                                    placeholder="Código único"
                                                />
                                            </div>
                                            <div>
                                                <Label>Precio</Label>
                                                <Input 
                                                    type="number"
                                                    value={newVariant.price}
                                                    onChange={(e) => setNewVariant({...newVariant, price: e.target.value})}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div>
                                                <Label>Stock {editingVariantId ? 'Actual' : 'Inicial'}</Label>
                                                <Input 
                                                    type="number"
                                                    value={newVariant.stock_quantity}
                                                    onChange={(e) => setNewVariant({...newVariant, stock_quantity: e.target.value})}
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                        <Button 
                                            type="button" 
                                            onClick={editingVariantId ? handleUpdateVariant : handleCreateVariant} 
                                            disabled={!newVariant.name || !newVariant.price}
                                            className={editingVariantId ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}
                                        >
                                            {editingVariantId ? 'Actualizar Variante' : 'Agregar Variante'}
                                        </Button>
                                    </div>
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
                                    <div className="space-y-2">
                                        <Label htmlFor="category_id">Categoría *</Label>
                                        <Select
                                            value={data.category_id.toString()}
                                            onValueChange={(value) => setData('category_id', parseInt(value))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una categoría" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="brand_id">Marca</Label>
                                        <Select
                                            value={data.brand_id?.toString() || ''}
                                            onValueChange={(value) => setData('brand_id', parseInt(value))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una marca" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {brands.map((brand) => (
                                                    <SelectItem key={brand.id} value={brand.id.toString()}>
                                                        {brand.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="shipping_class_id">Clase de Envío *</Label>
                                        <Select
                                            value={data.shipping_class_id.toString()}
                                            onValueChange={(value) => setData('shipping_class_id', parseInt(value))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona clase de envío" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {shippingClasses.map((shippingClass) => (
                                                    <SelectItem key={shippingClass.id} value={shippingClass.id.toString()}>
                                                        {shippingClass.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.shipping_class_id && <p className="text-sm text-destructive">{errors.shipping_class_id}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Precio Base</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Label htmlFor="base_price">Precio Base *</Label>
                                        <Input
                                            id="base_price"
                                            type="number"
                                            step="0.01"
                                            value={data.base_price}
                                            onChange={(e) => setData('base_price', e.target.value)}
                                        />
                                        {errors.base_price && <p className="text-sm text-destructive">{errors.base_price}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Restricciones y Opciones</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                        />
                                        <Label htmlFor="is_active">Producto Activo</Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_restricted"
                                            checked={data.is_restricted}
                                            onCheckedChange={(checked) => setData('is_restricted', checked as boolean)}
                                        />
                                        <Label htmlFor="is_restricted">Producto Restringido</Label>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="age_verification_required"
                                            checked={data.age_verification_required}
                                            onCheckedChange={(checked) => setData('age_verification_required', checked as boolean)}
                                        />
                                        <Label htmlFor="age_verification_required">Requiere Verificación Edad</Label>
                                    </div>

                                    {/* Dynamic Restrictions List */}
                                    <div className="pt-4 border-t">
                                        <Label className="mb-2 block">Tipos de Restricción</Label>
                                        <div className="space-y-2">
                                            {restrictionTypes.map((type) => (
                                                <div key={type.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`restriction_${type.id}`}
                                                        checked={data.restriction_type_ids.includes(type.id)}
                                                        onCheckedChange={(checked) => handleRestrictionChange(type.id, checked as boolean)}
                                                    />
                                                    <Label htmlFor={`restriction_${type.id}`} className="text-sm text-muted-foreground font-normal cursor-pointer">
                                                        {type.name}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Actualizar Producto'}
                                </Button>
                                <Link href="/adminfacchile/products">
                                    <Button type="button" variant="outline">Cancelar</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
