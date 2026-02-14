import { Head, Link, useForm } from '@inertiajs/react';
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
import { ArrowLeft } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

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

interface Props {
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
        title: 'Nuevo Producto',
        href: '/adminfacchile/products/create',
    },
];

export default function Create({ categories, brands, shippingClasses, restrictionTypes }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        category_id: '',
        brand_id: '',
        shipping_class_id: '',
        description: '',
        short_description: '',
        base_price: '',
        is_active: true,
        is_restricted: false,
        age_verification_required: false,
        main_image_url: '',
        restriction_type_ids: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/adminfacchile/products');
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleNameChange = (value: string) => {
        setData('name', value);
        if (!data.slug) {
            setData('slug', generateSlug(value));
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
            <Head title="Nuevo Producto - Panel Administrativo" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/adminfacchile/products">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Nuevo Producto</h1>
                        <p className="text-muted-foreground">
                            Agrega un nuevo producto al catálogo
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información General</CardTitle>
                                    <CardDescription>
                                        Datos básicos del producto
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre del Producto *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => handleNameChange(e.target.value)}
                                            placeholder="Ej: Rifle de Aire Comprimido"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-destructive">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug (URL) *</Label>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                            placeholder="rifle-aire-comprimido"
                                        />
                                        {errors.slug && (
                                            <p className="text-sm text-destructive">{errors.slug}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="short_description">
                                            Descripción Corta
                                        </Label>
                                        <Input
                                            id="short_description"
                                            value={data.short_description}
                                            onChange={(e) =>
                                                setData('short_description', e.target.value)
                                            }
                                            placeholder="Descripción breve del producto"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descripción Completa</Label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            placeholder="Descripción detallada del producto"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="main_image_url">URL de Imagen</Label>
                                        <Input
                                            id="main_image_url"
                                            value={data.main_image_url}
                                            onChange={(e) =>
                                                setData('main_image_url', e.target.value)
                                            }
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                        />
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
                                            value={data.category_id}
                                            onValueChange={(value) =>
                                                setData('category_id', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una categoría" />
                                            </SelectTrigger>
                                            <SelectContent>
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
                                        {errors.category_id && (
                                            <p className="text-sm text-destructive">
                                                {errors.category_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="brand_id">Marca</Label>
                                        <Select
                                            value={data.brand_id}
                                            onValueChange={(value) => setData('brand_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una marca" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {brands.map((brand) => (
                                                    <SelectItem
                                                        key={brand.id}
                                                        value={brand.id.toString()}
                                                    >
                                                        {brand.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="shipping_class_id">
                                            Clase de Envío *
                                        </Label>
                                        <Select
                                            value={data.shipping_class_id}
                                            onValueChange={(value) =>
                                                setData('shipping_class_id', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona clase de envío" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {shippingClasses.map((shippingClass) => (
                                                    <SelectItem
                                                        key={shippingClass.id}
                                                        value={shippingClass.id.toString()}
                                                    >
                                                        {shippingClass.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.shipping_class_id && (
                                            <p className="text-sm text-destructive">
                                                {errors.shipping_class_id}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Precio</CardTitle>
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
                                            placeholder="0.00"
                                        />
                                        {errors.base_price && (
                                            <p className="text-sm text-destructive">
                                                {errors.base_price}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Opciones</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) =>
                                                setData('is_active', checked as boolean)
                                            }
                                        />
                                        <Label htmlFor="is_active" className="cursor-pointer">
                                            Producto Activo
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_restricted"
                                            checked={data.is_restricted}
                                            onCheckedChange={(checked) =>
                                                setData('is_restricted', checked as boolean)
                                            }
                                        />
                                        <Label htmlFor="is_restricted" className="cursor-pointer">
                                            Producto Restringido
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="age_verification_required"
                                            checked={data.age_verification_required}
                                            onCheckedChange={(checked) =>
                                                setData(
                                                    'age_verification_required',
                                                    checked as boolean
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor="age_verification_required"
                                            className="cursor-pointer"
                                        >
                                            Requiere Verificación de Edad
                                        </Label>
                                    </div>

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
                                    {processing ? 'Guardando...' : 'Crear Producto'}
                                </Button>
                                <Link href="/adminfacchile/products">
                                    <Button type="button" variant="outline">
                                        Cancelar
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
