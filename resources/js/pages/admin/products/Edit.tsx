
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
import { cn, formatPrice } from '@/lib/utils';
import { ArrowLeft, Trash, Edit as EditIcon, Upload, X, Image as ImageIcon, ChevronDown, Check, ExternalLink } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { useState, useRef } from 'react';
import { compressImage } from '@/lib/image-compression';
import { toast } from 'sonner';
import CategoryTreeSelect from '@/components/admin/CategoryTreeSelect';

interface Category {
    id: number;
    name: string;
    parent_id: number | null;
}

interface Brand {
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
    description: string | null;
    short_description: string | null;
    base_price: string;
    is_active: boolean;
    is_restricted: boolean;
    age_verification_required: boolean;
    main_image_url: string | null;
    gallery: string[] | null;
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
    restrictionTypes: RestrictionType[];
}

// Hierarchical Category Selector Component
function CategoryTreeSelector({
    categories,
    value,
    onChange,
}: {
    categories: Category[];
    value: number;
    onChange: (id: number) => void;
}) {
    const [open, setOpen] = useState(false);

    const parents = categories.filter((c) => c.parent_id === null);
    const children = categories.filter((c) => c.parent_id !== null);
    const standalone = parents.filter((p) => !children.some((c) => c.parent_id === p.id));
    const withChildren = parents.filter((p) => children.some((c) => c.parent_id === p.id));

    const selectedName = categories.find((c) => c.id === value)?.name ?? 'Selecciona una categoría';

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-accent/50 transition-colors"
            >
                <span className={value ? 'text-foreground' : 'text-muted-foreground'}>{selectedName}</span>
                <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg overflow-hidden">
                    <div className="max-h-72 overflow-y-auto p-1">
                        {/* Standalone parent categories (no children) */}
                        {standalone.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => { onChange(cat.id); setOpen(false); }}
                                className={cn(
                                    'flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent transition-colors text-left',
                                    value === cat.id && 'bg-accent font-medium'
                                )}
                            >
                                {value === cat.id && <Check className="h-3 w-3 shrink-0 text-brand-primary" />}
                                <span className={value === cat.id ? 'ml-0' : 'ml-5'}>{cat.name}</span>
                            </button>
                        ))}

                        {/* Parent categories with their children */}
                        {withChildren.map((parent) => (
                            <div key={parent.id}>
                                {/* Parent header - not selectable */}
                                <div className="px-3 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider border-t first:border-t-0 mt-1 first:mt-0">
                                    {parent.name}
                                </div>
                                {/* Children */}
                                {children
                                    .filter((c) => c.parent_id === parent.id)
                                    .map((child) => (
                                        <button
                                            key={child.id}
                                            type="button"
                                            onClick={() => { onChange(child.id); setOpen(false); }}
                                            className={cn(
                                                'flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent transition-colors text-left',
                                                value === child.id && 'bg-accent font-medium'
                                            )}
                                        >
                                            {value === child.id
                                                ? <Check className="h-3 w-3 shrink-0 text-brand-primary" />
                                                : <span className="h-3 w-3 shrink-0" />
                                            }
                                            <span>{child.name}</span>
                                        </button>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
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

export default function Edit({ product, categories, brands, restrictionTypes }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: product.name,
        slug: product.slug,
        category_id: product.category_id,
        brand_id: product.brand_id,
        description: product.description || '',
        short_description: product.short_description || '',
        base_price: product.base_price,
        is_active: Boolean(product.is_active),
        is_restricted: Boolean(product.is_restricted),
        age_verification_required: Boolean(product.age_verification_required),
        main_image_url: product.main_image_url || '',
        main_image: null as File | null,
        existing_gallery: product.gallery || [],
        gallery_images: [] as File[],
        restriction_type_ids: product.restriction_type_ids || [],
    });

    const [imagePreview, setImagePreview] = useState<string | null>(product.main_image_url);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

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
        post(`/adminfacchile/products/${product.id}`, {
            forceFormData: true,
        });
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
        setData((prevData) => ({
            ...prevData,
            main_image: null,
            main_image_url: '',
        }));
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

    const removeExistingGalleryImage = (index: number) => {
        const newExisting = [...data.existing_gallery];
        newExisting.splice(index, 1);
        setData('existing_gallery', newExisting);
    };

    const removeNewGalleryImage = (index: number) => {
        const newImages = [...data.gallery_images];
        newImages.splice(index, 1);
        setData('gallery_images', newImages);

        const newPreviews = [...galleryPreviews];
        newPreviews.splice(index, 1);
        setGalleryPreviews(newPreviews);
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

    const handleCreateVariant = () => {
        router.post(`/adminfacchile/products/${product.id}/variants`, newVariant, {
            onSuccess: () => resetVariantForm(),
            preserveScroll: true,
            preserveState: true,
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

    const handleUpdateVariant = () => {
        if (!editingVariantId) return;

        router.put(`/adminfacchile/products/${product.id}/variants/${editingVariantId}`, newVariant, {
            onSuccess: () => resetVariantForm(),
            preserveScroll: true,
            preserveState: true,
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
                <div className="flex items-center justify-between">
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
                    <a
                        href={`/producto/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="outline" className="gap-2">
                            <ExternalLink className="size-4" />
                            Ver en tienda
                        </Button>
                    </a>
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
                                            onChange={(e) => {
                                                const name = e.target.value;
                                                const slug = name
                                                    .toLowerCase()
                                                    .normalize("NFD")
                                                    .replace(/[\u0300-\u036f]/g, "")
                                                    .trim()
                                                    .replace(/\s+/g, '-')
                                                    .replace(/[^\w\-]+/g, '')
                                                    .replace(/\-\-+/g, '-');
                                                
                                                setData((prevData) => ({
                                                    ...prevData,
                                                    name: name,
                                                    slug: slug
                                                }));
                                            }}
                                        />
                                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug (Auto-generado) *</Label>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            readOnly
                                            className="bg-slate-100 text-slate-500 cursor-not-allowed"
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

                                    <div className="space-y-4">
                                        <Label>Imagen del Producto</Label>
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
                                                    <p className="text-sm font-medium">Haz clic para subir una imagen</p>
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
                                            {errors.main_image_url && (
                                                <p className="text-sm text-destructive">{errors.main_image_url}</p>
                                            )}
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
                                            {/* Existing Gallery Images */}
                                            {data.existing_gallery.map((url, idx) => (
                                                <div key={`existing-${idx}`} className="relative group aspect-square rounded-lg border overflow-hidden bg-white">
                                                    <img src={url} alt={`Imagen ${idx}`} className="h-full w-full object-contain" />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => removeExistingGalleryImage(idx)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[10px] text-white py-0.5 text-center">
                                                        Existente
                                                    </div>
                                                </div>
                                            ))}

                                            {/* New Gallery Images Previews */}
                                            {galleryPreviews.map((preview, idx) => (
                                                <div key={`new-${idx}`} className="relative group aspect-square rounded-lg border-2 border-primary/20 overflow-hidden bg-white">
                                                    <img src={preview} alt="Nueva" className="h-full w-full object-contain" />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => removeNewGalleryImage(idx)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-[10px] text-white py-0.5 text-center">
                                                        Por subir
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Empty State / Add Placeholder */}
                                            {data.existing_gallery.length === 0 && data.gallery_images.length === 0 && (
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
                                                    <span className="font-bold mr-2">{formatPrice(variant.price)}</span>
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
                                        <Label>Categoría *</Label>
                                        <CategoryTreeSelect
                                            categories={categories}
                                            value={data.category_id.toString()}
                                            onChange={(id) => setData('category_id', parseInt(id))}
                                            error={errors.category_id}
                                        />
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
