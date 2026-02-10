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
        <section className="bg-bg-body py-12 dark:bg-[#1C1C1A]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-center text-lg font-semibold leading-8 text-text-main dark:text-white">
                    Trabajamos con las mejores marcas del mundo
                </h2>
                <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-6">
                    {brands.map((brand) => (
                        <div key={brand.name} className="flex justify-center">
                            <img
                                className="col-span-2 max-h-12 w-full object-contain grayscale transition-all hover:grayscale-0 lg:col-span-1 dark:invert"
                                src={brand.logo}
                                alt={brand.name}
                                width={158}
                                height={48}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
