import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const products = [
    {
        id: 1,
        name: 'Rifle PCP AirVenturi Avenger .22',
        brand: 'AirVenturi',
        price: 450000,
        image: '/images/imagenesdemo/1.avif',
        is_restricted: true,
        badge: '18+',
    },
    {
        id: 2,
        name: 'Reel Mitchell MX3 SW',
        brand: 'Mitchell',
        price: 85000,
        image: '/images/imagenesdemo/2.jpg',
        is_restricted: false,
    },
    {
        id: 3,
        name: 'Carpa Doite Himalaya 2 Personas',
        brand: 'Doite',
        price: 120000,
        image: '/images/imagenesdemo/3.jpg',
        is_restricted: false,
        discount: 150000,
    },
    {
        id: 4,
        name: 'Cuchillo de Supervivencia Morakniv',
        brand: 'Morakniv',
        price: 35000,
        image: '/images/imagenesdemo/5.png',
        is_restricted: true,
        badge: '18+',
    },
];

export default function FeaturedProducts() {
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
                        <div key={product.id} className="group relative rounded-lg bg-bg-card p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-[#2C2C2A]">
                            <div className="aspect-square w-full overflow-hidden rounded-md bg-slate-100 group-hover:opacity-75 relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                />
                                {product.is_restricted && (
                                    <span className="absolute top-2 right-2 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
                                        {product.badge}
                                    </span>
                                )}
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-text-main dark:text-slate-200">
                                        <Link href={`/producto/${product.id}`}>
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {product.name}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-text-muted dark:text-slate-400">{product.brand}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-text-main dark:text-white">
                                        ${product.price.toLocaleString('es-CL')}
                                    </p>
                                    {product.discount && (
                                        <p className="text-xs text-slate-400 line-through">
                                            ${product.discount.toLocaleString('es-CL')}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Button className="mt-4 w-full bg-action-buy hover:bg-action-hover text-white shadow-lg transition-all hover:scale-[1.02]" size="sm">
                                <ShoppingCart className="mr-2 h-4 w-4" /> Agregar al Carrito
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
