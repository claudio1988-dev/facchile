import { Head, Link } from '@inertiajs/react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { 
    ShoppingCart, 
    Heart, 
    Share2, 
    Truck, 
    Shield, 
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    X as XIcon
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

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
    gallery: string[] | null;
    stock: number;
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
    // Combine main image and gallery into a single array for easier navigation
    const allImages = [
        ...(product.main_image_url ? [product.main_image_url] : []),
        ...(product.gallery || [])
    ];
    
    // Fallback if no images
    const displayImages = allImages.length > 0 ? allImages : ['/images/imagenesdemo/1.avif'];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    };

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

                <main className="pt-[110px] md:pt-[145px] lg:pt-[155px]">
                    {/* Breadcrumb */}
                    <div className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800">
                        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                            <div className="flex items-center gap-2 text-sm">
                                <Link href="/" className="text-slate-600 hover:text-brand-primary dark:text-slate-400">
                                    Inicio
                                </Link>
                                <span className="text-slate-400">/</span>
                                {product.category && product.category.slug && (
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

                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                            {/* Product Media (Gallery/Image) */}
                            <div className="lg:col-span-5 xl:col-span-6">
                                <div className="sticky top-32">
                                    <div className="relative aspect-square max-h-[400px] md:max-h-[500px] overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center p-4 md:p-8 group">
                                        
                                        {/* Main Image */}
                                        <img
                                            src={displayImages[currentImageIndex]}
                                            onError={(e) => {
                                                e.currentTarget.src = "/images/imagenesdemo/1.avif";
                                            }}
                                            alt={product.name}
                                            className="max-h-full max-w-full object-contain drop-shadow-md animate-in fade-in zoom-in duration-300 cursor-zoom-in"
                                            onClick={() => setIsZoomOpen(true)}
                                        />

                                        {/* Navigation Buttons (only if multiple images) */}
                                        {displayImages.length > 1 && (
                                            <>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/50 shadow-sm hover:bg-white dark:hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                                                >
                                                    <ChevronLeft className="h-6 w-6 text-slate-700 dark:text-white" />
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/50 shadow-sm hover:bg-white dark:hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <ChevronRight className="h-6 w-6 text-slate-700 dark:text-white" />
                                                </button>
                                            </>
                                        )}

                                        {/* Zoom Indicator */}
                                        <button 
                                            onClick={() => setIsZoomOpen(true)}
                                            className="absolute bottom-4 right-4 p-2 rounded-full bg-white/80 dark:bg-black/50 shadow-sm hover:bg-white dark:hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Maximize2 className="h-5 w-5 text-slate-700 dark:text-white" />
                                        </button>
                                        
                                        {/* Badges Overlay */}
                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            {!product.is_active && (
                                                <Badge variant="secondary" className="px-3 py-1 bg-white/80 backdrop-blur dark:bg-slate-800/80">No Disponible</Badge>
                                            )}
                                            {product.is_restricted && (
                                                <Badge variant="destructive" className="px-3 py-1 shadow-lg ring-2 ring-white dark:ring-slate-900">
                                                    Restringido 18+
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Thumbnails */}
                                    {displayImages.length > 1 && (
                                        <div className="mt-6 flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
                                            {displayImages.map((img, i) => (
                                                <div 
                                                    key={i} 
                                                    onClick={() => setCurrentImageIndex(i)}
                                                    className={cn(
                                                        "h-20 w-20 flex-shrink-0 rounded-xl border-2 bg-white dark:bg-slate-900 cursor-pointer transition-all overflow-hidden p-1 relative",
                                                        currentImageIndex === i ? "border-brand-primary ring-2 ring-brand-primary/10 shadow-lg scale-105" : "border-slate-100 dark:border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-300"
                                                    )}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`${product.name} ${i}`}
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product Purchase & Info Panel */}
                            <div className="lg:col-span-7 xl:col-span-6">
                                <div className="lg:sticky lg:top-32 flex flex-col h-full">
                                    {/* Brand & Stats */}
                                    <div className="flex items-center justify-between mb-4">
                                        {product.brand && (
                                            <Badge variant="outline" className="text-xs font-bold border-brand-primary/20 bg-brand-primary/5 text-brand-primary px-3 py-1">
                                                {product.brand.name}
                                            </Badge>
                                        )}
                                        <div className="flex items-center gap-1 text-slate-400">
                                             <Share2 className="h-4 w-4 cursor-pointer hover:text-brand-primary" />
                                             <Heart className="h-4 w-4 cursor-pointer hover:text-red-500" />
                                        </div>
                                    </div>

                                    {/* Product Main Title */}
                                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2 leading-tight">
                                        {product.name}
                                    </h1>
                                    
                                    {/* Short description / Hook */}
                                    {product.short_description && (
                                        <p className="text-lg text-slate-500 dark:text-slate-400 mb-6 font-medium leading-relaxed">
                                            {product.short_description}
                                        </p>
                                    )}

                                    {/* Price Card */}
                                    <div className="mb-8 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-baseline gap-4 mb-2">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black text-brand-primary">
                                                    {formatPrice(product.base_price)}
                                                </span>
                                                <span className="text-sm text-slate-400 font-medium">IVA incluido</span>
                                            </div>
                                            
                                            {/* Stock Status */}
                                            {product.stock > 0 ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                                    En Stock
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive">
                                                    Agotado
                                                </Badge>
                                            )}
                                        </div>
                                        
                                        {/* Restricted Banner */}
                                        {product.age_verification_required && (
                                            <div className="mt-4 flex items-start gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/50">
                                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                                <p className="text-xs font-bold uppercase tracking-tight">
                                                    Venta solo para mayores de 18 años
                                                </p>
                                            </div>
                                        )}

                                        {/* Purchase Button */}
                                        <div className="mt-8">
                                            <Button 
                                                size="lg" 
                                                className="w-full bg-action-buy hover:bg-action-hover h-14 text-lg font-bold shadow-xl shadow-brand-primary/10 transition-all hover:scale-[1.01] active:scale-[0.98]"
                                                disabled={!product.is_active || product.stock <= 0}
                                                onClick={() => {
                                                    useCartStore.getState().addToCart(product);
                                                    import('@inertiajs/react').then(({ router }) => {
                                                        router.visit('/checkout');
                                                    });
                                                }}
                                            >
                                                <ShoppingCart className="mr-3 h-6 w-6" />
                                                Agregar al Carrito
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Trust Badges Panel */}
                                    <div className="grid grid-cols-1 gap-4 mb-8">
                                        <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                                <Truck className="h-5 w-5 text-green-600 dark:text-green-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Envío a Todo Chile</p>
                                                <p className="text-xs text-slate-500">Despacho seguro en 24/48hrs</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Compra Protegida</p>
                                                <p className="text-xs text-slate-500">Garantía oficial Facchile</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Paga seguro con:</p>
                                            <img 
                                                src="/images/logowebpay-plus.png" 
                                                alt="Webpay Plus" 
                                                className="h-12 w-auto grayscale opacity-70 dark:brightness-0 dark:invert"
                                            />
                                        </div>
                                    </div>

                                    {/* Extra Info */}
                                    {product.shipping_class && (
                                        <div className="mt-auto text-xs text-slate-400">
                                             Clasificación: <span className="font-bold text-slate-500 underline">{product.shipping_class.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="mt-12 border-t dark:border-slate-800 pt-12">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                                    Descripción del Producto
                                </h2>
                                <div 
                                    className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </div>
                        )}

                        {/* Category Info */}
                                {product.category && product.category.slug && (
                                    <div className="mt-12 border-t dark:border-slate-800 pt-12">
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
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

                {/* Sticky Mobile Purchase Bar */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 p-4 animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase text-slate-400">Total</span>
                            <span className="text-lg font-black text-brand-primary leading-none">{formatPrice(product.base_price)}</span>
                        </div>
                        <Button 
                            className="flex-1 bg-action-buy hover:bg-action-hover h-12 text-sm font-bold shadow-lg shadow-brand-primary/10"
                            disabled={!product.is_active || product.stock <= 0}
                            onClick={() => {
                                useCartStore.getState().addToCart(product);
                                import('@inertiajs/react').then(({ router }) => {
                                    router.visit('/checkout');
                                });
                            }}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Lo quiero ahora
                        </Button>
                    </div>
                </div>

                {/* Image Zoom Modal */}
                <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
                    <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-none flex items-center justify-center overflow-hidden">
                        <DialogTitle className="sr-only">
                            {product.name} - Imagen {currentImageIndex + 1}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            Vista ampliada de la imagen del producto
                        </DialogDescription>
                        <button 
                            onClick={() => setIsZoomOpen(false)}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors"
                        >
                            <XIcon className="h-6 w-6" />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center">
                            <img
                                src={displayImages[currentImageIndex]}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain"
                            />

                            {/* Modal Navigation */}
                            {displayImages.length > 1 && (
                                <>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
                                    >
                                        <ChevronLeft className="h-8 w-8" />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
                                    >
                                        <ChevronRight className="h-8 w-8" />
                                    </button>
                                </>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
