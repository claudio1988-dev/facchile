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
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { useState, useRef } from 'react';
import { compressImage } from '@/lib/image-compression';
import { toast } from 'sonner';

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
        main_image: null as File | null,
        gallery_images: [] as File[],
        restriction_type_ids: [] as number[],
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

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

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const compressed = await compressImage(file);
                setData('main_image', compressed);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(compressed);
            } catch (error) {
                toast.error('Error al procesar la imagen');
            }
        }
    };

    const removeImage = () => {
        setData('main_image', null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const loadingToast = toast.loading('Procesando imágenes...');
            try {
                const compressedFiles = await Promise.all(
                    files.map(file => compressImage(file))
                );
                
                setData('gallery_images', [...data.gallery_images, ...compressedFiles]);
                
                compressedFiles.forEach(file => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setGalleryPreviews(prev => [...prev, reader.result as string]);
                    };
                    reader.readAsDataURL(file);
                });
                toast.dismiss(loadingToast);
            } catch (error) {
                toast.error('Error al procesar galería');
                toast.dismiss(loadingToast);
            }

            if (galleryInputRef.current) {
                galleryInputRef.current.value = '';
            }
        }
    };

    const removeGalleryImage = (index: number) => {
        const newImages = [...data.gallery_images];
        newImages.splice(index, 1);
        setData('gallery_images', newImages);

        const newPreviews = [...galleryPreviews];
        newPreviews.splice(index, 1);
        setGalleryPreviews(newPreviews);
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

                                    <div className="space-y-4">
                                        <Label>Imagen Principal *</Label>
                                        <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg bg-muted/50 transition-colors hover:bg-muted">
                                            {imagePreview ? (
                                                <div className="relative w-full aspect-video md:aspect-square max-w-sm overflow-hidden rounded-lg border">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Vista previa"
                                                        className="h-full w-full object-contain bg-white"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                                                        onClick={removeImage}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div 
                                                    className="flex flex-col items-center justify-center py-8 cursor-pointer w-full"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <div className="rounded-full bg-primary/10 p-3 mb-3">
                                                        <Upload className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <p className="text-sm font-medium">Haz clic para subir imagen principal</p>
                                                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG hasta 5MB</p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                        {errors.main_image && (
                                            <p className="text-sm text-destructive">{errors.main_image}</p>
                                        )}
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="main_image_url">O ingresa una URL de Imagen</Label>
                                            <div className="relative">
                                                <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="main_image_url"
                                                    className="pl-9"
                                                    placeholder="https://ejemplo.com/imagen.jpg"
                                                    value={data.main_image_url}
                                                    onChange={(e) => {
                                                        setData('main_image_url', e.target.value);
                                                        if (!data.main_image) {
                                                            setImagePreview(e.target.value);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Gallery Section */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <div className="flex items-center justify-between">
                                            <Label>Galería de Imágenes (Opcional)</Label>
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => galleryInputRef.current?.click()}
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Añadir Imágenes
                                            </Button>
                                        </div>
                                        
                                        <input
                                            type="file"
                                            ref={galleryInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={handleGalleryChange}
                                        />

                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {/* Gallery Previews */}
                                            {galleryPreviews.map((preview, idx) => (
                                                <div key={idx} className="relative group aspect-square rounded-lg border-2 border-primary/20 overflow-hidden bg-white">
                                                    <img src={preview} alt={`Galería ${idx}`} className="h-full w-full object-contain" />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => removeGalleryImage(idx)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}

                                            {/* Empty State */}
                                            {galleryPreviews.length === 0 && (
                                                <div 
                                                    className="col-span-full py-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                                                    onClick={() => galleryInputRef.current?.click()}
                                                >
                                                    <ImageIcon className="h-8 w-8 mb-2 opacity-20" />
                                                    <p className="text-sm">No hay imágenes en la galería</p>
                                                </div>
                                            )}
                                        </div>
                                        {errors.gallery_images && (
                                            <p className="text-sm text-destructive">{errors.gallery_images}</p>
                                        )}
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
