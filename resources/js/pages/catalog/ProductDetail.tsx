import { Head, Link } from '@inertiajs/react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
    ShoppingCart, 
    Heart, 
    Share2, 
    Truck, 
    Shield, 
    ArrowLeft,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    base_price: number;
    is_active: boolean;
    is_restricted: boolean;
    age_verification_required: boolean;
    main_image_url: string | null;
    category: {
        id: number;
        name: string;
        slug: string;
    } | null;
    brand: {
        id: number;
        name: string;
        slug: string;
    } | null;
    shipping_class: {
        id: number;
        name: string;
        code: string;
    } | null;
}

interface Props {
    product: Product;
}

export default function ProductDetail({ product }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <>
            <Head title={`${product.name} | Facchile Outdoor`} />
            
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
                <Header />

                <main className="pt-20">
                    {/* Breadcrumb */}
                    <div className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800">
                        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                            <div className="flex items-center gap-2 text-sm">
                                <Link href="/" className="text-slate-600 hover:text-brand-primary dark:text-slate-400">
                                    Inicio
                                </Link>
                                <span className="text-slate-400">/</span>
                                {product.category && (
                                    <>
                                        <Link 
                                            href={`/categoria/${product.category.slug}`}
                                            className="text-slate-600 hover:text-brand-primary dark:text-slate-400"
                                        >
                                            {product.category.name}
                                        </Link>
                                        <span className="text-slate-400">/</span>
                                    </>
                                )}
                                <span className="text-slate-900 dark:text-white font-medium">{product.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Detail */}
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <Link 
                            href="/catalogo" 
                            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand-primary dark:text-slate-400 mb-6"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al catálogo
                        </Link>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {/* Product Image */}
                            <div className="relative">
                                <div className="aspect-square overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                                    {product.main_image_url ? (
                                        <img
                                            src={product.main_image_url}
                                            alt={product.name}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <span className="text-slate-400 dark:text-slate-600">Sin imagen</span>
                                        </div>
                                    )}
                                </div>

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {!product.is_active && (
                                        <Badge variant="secondary">No Disponible</Badge>
                                    )}
                                    {product.is_restricted && (
                                        <Badge variant="destructive">Producto Restringido</Badge>
                                    )}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col">
                                {/* Brand */}
                                {product.brand && (
                                    <p className="text-sm font-medium text-brand-primary mb-2">
                                        {product.brand.name}
                                    </p>
                                )}

                                {/* Title */}
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                                    {product.name}
                                </h1>

                                {/* Short Description */}
                                {product.short_description && (
                                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                                        {product.short_description}
                                    </p>
                                )}

                                {/* Price */}
                                <div className="mb-6">
                                    <p className="text-4xl font-bold text-brand-primary">
                                        {formatPrice(product.base_price)}
                                    </p>
                                </div>

                                {/* Age Verification Warning */}
                                {product.age_verification_required && (
                                    <Card className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
                                        <CardContent className="flex items-start gap-3 p-4">
                                            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-amber-900 dark:text-amber-200">
                                                    Verificación de Edad Requerida
                                                </p>
                                                <p className="text-sm text-amber-800 dark:text-amber-300">
                                                    Este producto requiere verificación de edad al momento de la compra.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3 mb-8">
                                    <Button 
                                        size="lg" 
                                        className="flex-1 bg-action-buy hover:bg-action-hover"
                                        disabled={!product.is_active}
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        Agregar al Carrito
                                    </Button>
                                    <Button size="lg" variant="outline">
                                        <Heart className="h-5 w-5" />
                                    </Button>
                                    <Button size="lg" variant="outline">
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>

                                {/* Features */}
                                <div className="space-y-3 border-t dark:border-slate-800 pt-6">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Truck className="h-5 w-5 text-green-600" />
                                        <span className="text-slate-700 dark:text-slate-300">
                                            Envío a todo Chile
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Shield className="h-5 w-5 text-green-600" />
                                        <span className="text-slate-700 dark:text-slate-300">
                                            Compra 100% segura
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        <span className="text-slate-700 dark:text-slate-300">
                                            Garantía del fabricante
                                        </span>
                                    </div>
                                </div>

                                {/* Shipping Class */}
                                {product.shipping_class && (
                                    <div className="mt-6 rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                            Clase de Envío
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {product.shipping_class.name}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="mt-12 border-t dark:border-slate-800 pt-12">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                    Descripción del Producto
                                </h2>
                                <div className="prose prose-slate dark:prose-invert max-w-none">
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Category Info */}
                        {product.category && (
                            <div className="mt-12 border-t dark:border-slate-800 pt-12">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                    Más productos de {product.category.name}
                                </h2>
                                <Link 
                                    href={`/categoria/${product.category.slug}`}
                                    className="inline-flex items-center gap-2 text-brand-primary hover:text-action-hover font-medium"
                                >
                                    Ver todos los productos de {product.category.name}
                                    <ArrowLeft className="h-4 w-4 rotate-180" />
                                </Link>
                            </div>
                        )}
                    </div>
                </main>

                <Footer />
                <WhatsAppFloating />
            </div>
        </>
    );
}
