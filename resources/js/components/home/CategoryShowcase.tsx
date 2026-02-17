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
        <section 
            className="relative py-12 sm:py-24 bg-slate-50 overflow-hidden"
            style={{ 
                backgroundImage: 'url("/images/categories/rifles_aire_comprimido_1771205335620.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Stronger white overlay for a cleaner, brighter look */}
            <div className="absolute inset-0 bg-white/85 dark:bg-black/80 pointer-events-none" />
            
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-10 sm:mb-16 text-center">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white uppercase">
                        Explora Nuestras Categorías
                    </h2>
                    <div className="mt-2 h-1 w-20 bg-brand-primary mx-auto rounded-full" />
                    <p className="mt-4 text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Equipamiento de alta calidad para cada tipo de aventura. Seleccionamos lo mejor para tu pasión.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                    {categories.map((category) => (
                        <Link 
                            key={category.id} 
                            href={`/categoria/${category.slug}`}
                            className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white"
                        >
                            <div className="aspect-[4/5] sm:aspect-[4/4] relative w-full overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                            </div>
                            
                            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                                <h3 className="text-sm sm:text-lg font-bold text-white leading-tight group-hover:text-brand-primary transition-colors">
                                    {category.name}
                                </h3>
                                <div className="mt-1 flex items-center gap-1.5">
                                    <span className="h-px w-4 bg-brand-primary" />
                                    <span className="text-[9px] sm:text-xs text-slate-300 font-medium uppercase tracking-widest">
                                        {category.count}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
