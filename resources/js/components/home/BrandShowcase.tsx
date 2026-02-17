export default function BrandShowcase() {
    const brands = [
        { name: 'Gamo', logo: 'https://placehold.co/200x100/png?text=Gamo' },
        { name: 'Shimano', logo: 'https://placehold.co/200x100/png?text=Shimano' },
        { name: 'Doite', logo: 'https://placehold.co/200x100/png?text=Doite' },
        { name: 'Lippi', logo: 'https://placehold.co/200x100/png?text=Lippi' },
        { name: 'Victorinox', logo: 'https://placehold.co/200x100/png?text=Victorinox' },
        { name: 'Rapala', logo: 'https://placehold.co/200x100/png?text=Rapala' },
    ];

    return (
        <section className="bg-white py-16 sm:py-24 dark:bg-[#0a0a0a]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                        Trabajamos con las mejores marcas
                    </h2>
                </div>

                <div className="mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
                    {brands.map((brand) => (
                        <div 
                            key={brand.name} 
                            className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-center aspect-[3/2] group hover:-translate-y-1"
                        >
                            <img
                                className="max-h-12 w-full object-contain grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
                                src={brand.logo}
                                alt={brand.name}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
