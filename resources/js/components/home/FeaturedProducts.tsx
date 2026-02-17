import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

interface Product {
    id: number;
    name: string;
    slug: string;
    base_price: number | string;
    main_image_url: string | null;
    is_restricted: boolean;
    brand?: { name: string };
}

interface Props {
    products?: Product[];
}

export default function FeaturedProducts({ products = [] }: Props) {
    const addToCart = useCartStore((state) => state.addToCart);

    // If there are no products from DB, we could show a message or just not render.
    // But since we want "BD products in home", we use the prop.
    if (products.length === 0) return null;

    return (
        <section className="bg-bg-body py-16 dark:bg-[#1C1C1A]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-text-main dark:text-white">
                        Productos Destacados
                    </h2>
                    <Link href="/catalogo" className="text-brand-primary hover:text-action-hover font-semibold">
                        Ver todo el catálogo &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <div key={product.id} className="group relative rounded-lg bg-bg-card p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-[#2C2C2A] flex flex-col h-full">
                            <div className="aspect-square w-full overflow-hidden rounded-md bg-slate-100 group-hover:opacity-75 relative">
                                <Link href={`/producto/${product.slug}`}>
                                    <img
                                        src={product.main_image_url || '/images/gentepescando.jpeg'}
                                        alt={product.name}
                                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                        onError={(e) => { e.currentTarget.src = '/images/gentepescando.jpeg'; }}
                                    />
                                </Link>
                                {product.is_restricted && (
                                    <span className="absolute top-2 right-2 rounded bg-red-600 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                                        18+
                                    </span>
                                )}
                            </div>
                            <div className="mt-4 flex justify-between flex-1">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-text-main dark:text-slate-200 line-clamp-2">
                                        <Link href={`/producto/${product.slug}`} className="hover:text-brand-primary">
                                            {product.name}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-text-muted dark:text-slate-400">
                                        {product.brand?.name || 'Genérico'}
                                    </p>
                                </div>
                                <div className="text-right ml-4">
                                    <p className="text-sm font-bold text-text-main dark:text-white">
                                        ${parseFloat(product.base_price.toString()).toLocaleString('es-CL')}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 relative z-10 w-full">
                                <Button 
                                    className="w-full bg-action-buy hover:bg-action-hover text-white shadow-lg transition-all hover:scale-[1.02]" 
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        addToCart(product);
                                        import('@inertiajs/react').then(({ router }) => {
                                            router.visit('/checkout');
                                        });
                                    }}
                                >
                                    <ShoppingCart className="mr-2 h-4 w-4" /> Agregar al Carrito
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
