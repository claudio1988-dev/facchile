import { Link } from '@inertiajs/react';

const categories = [
    {
        id: 1,
        name: 'Rifles y Aire Comprimido',
        slug: 'rifles-aire-comprimido',
        image: '/images/categories/rifles_category_1771205378195.png',
        count: '120+ Productos',
    },
    {
        id: 2,
        name: 'Pesca Deportiva',
        slug: 'pesca-deportiva',
        image: '/images/categories/pesca_category_1771205399020.png',
        count: '350+ Productos',
    },
    {
        id: 3,
        name: 'Camping & Outdoor',
        slug: 'camping-outdoor',
        image: '/images/categories/camping_category_1771205416526.png',
        count: '200+ Productos',
    },
    {
        id: 4,
        name: 'Caza y Supervivencia',
        slug: 'caza-supervivencia',
        image: '/images/categories/hunting_survival_1771205278672.png',
        count: '85+ Productos',
    },
];

export default function CategoryShowcase() {
    return (
        <section className="bg-bg-body py-16 dark:bg-[#161615]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-text-main sm:text-4xl dark:text-white">
                        Explora Nuestras Categorías
                    </h2>
                    <p className="mt-4 text-lg text-text-muted dark:text-slate-400">
                        Equipamiento de alta calidad para cada tipo de aventura.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category) => (
                        <Link 
                            key={category.id} 
                            href={`/categoria/${category.slug}`}
                            className="group relative overflow-hidden rounded-lg shadow-lg"
                        >
                            <div className="aspect-h-3 aspect-w-4 relative h-40 sm:h-64 w-full overflow-hidden bg-slate-200">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
                            </div>
                            <div className="absolute bottom-0 p-4 sm:p-6 w-full bg-gradient-to-t from-brand-primary/80 to-transparent">
                                <h3 className="text-base sm:text-xl font-bold text-white leading-tight">
                                    {category.name}
                                </h3>
                                <p className="mt-1 text-[10px] sm:text-sm text-highlight font-medium">
                                    {category.count}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
