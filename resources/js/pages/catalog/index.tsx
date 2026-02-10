import { Head, Link } from '@inertiajs/react';
import { Search, Filter, SlidersHorizontal, ChevronRight, LayoutGrid, List, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Mock Data
const categories = [
    { name: 'Rifles de Aire', count: 42, slug: 'rifles' },
    { name: 'Pesca Deportiva', count: 128, slug: 'pesca' },
    { name: 'Camping', count: 85, slug: 'camping' },
    { name: 'Cuchillería', count: 64, slug: 'cuchilleria' },
    { name: 'Ropa Outdoor', count: 210, slug: 'ropa' },
];

const brands = ['Gamo', 'Shimano', 'Doite', 'Lippi', 'Victorinox', 'Rapala', 'Hatsan'];

const products = [
    {
        id: 1,
        name: 'Rifle Nitro Piston Gamo Swarm Fox',
        category: 'Rifles de Aire',
        brand: 'Gamo',
        price: 289990,
        image: '/images/imagenesdemo/1.avif',
        is_restricted: true,
        stock: 5
    },
    {
        id: 2,
        name: 'Reel Shimano Nasci FB',
        category: 'Pesca Deportiva',
        brand: 'Shimano',
        price: 124990,
        image: '/images/imagenesdemo/5.png',
        is_restricted: false,
        stock: 2
    },
    {
        id: 3,
        name: 'Carpa Doite Himalaya 2 Personas',
        category: 'Camping',
        brand: 'Doite',
        price: 159990,
        image: '/images/imagenesdemo/3.jpg',
        is_restricted: false,
        stock: 12
    },
    {
        id: 4,
        name: 'Cuchillo Victorinox Ranger Grip 79',
        category: 'Cuchillería',
        brand: 'Victorinox',
        price: 84990,
        image: '/images/imagenesdemo/5.png',
        is_restricted: false,
        stock: 25
    },
    {
        id: 5,
        name: 'Parka Lippi Expedition 8000',
        category: 'Ropa Outdoor',
        brand: 'Lippi',
        price: 329990,
        image: '/images/imagenesdemo/1.avif',
        is_restricted: false,
        stock: 8
    },
    {
        id: 6,
        name: 'Rifle Aire Comprimido Hatsan AirTact',
        category: 'Rifles de Aire',
        brand: 'Hatsan',
        price: 145000,
        image: '/images/imagenesdemo/2.jpg',
        is_restricted: true,
        stock: 15
    }
];

interface CatalogProps {
    onlyOffers?: boolean;
}

export default function Catalog({ onlyOffers = false }: CatalogProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const displayProducts = onlyOffers 
        ? products.filter(p => p.price < 200000) // Mock filter for offers
        : products;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a]">
            <Head title={onlyOffers ? "Ofertas Especiales | Facchile Outdoor" : "Catálogo | Facchile Outdoor"} />
            
            <Header />

            {/* Catalog Hero */}
            <div className="relative h-[300px] w-full mt-20 overflow-hidden bg-brand-secondary">
                <div className="absolute inset-0 opacity-40">
                    <img 
                        src="/images/imagenesdemo/1.avif" 
                        className="h-full w-full object-cover"
                        alt="Background"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary to-transparent" />
                <div className="relative z-10 mx-auto max-w-7xl px-4 h-full flex flex-col justify-end pb-8 sm:px-6 lg:px-8">
                    <Badge className="w-fit mb-4 bg-action-buy hover:bg-action-buy/90 border-none px-3 py-1">
                        {onlyOffers ? 'Precios Imbatibles' : 'Equipamiento Premium'}
                    </Badge>
                    <h1 className="text-4xl font-black text-white sm:text-5xl tracking-tight drop-shadow-lg">
                        {onlyOffers ? 'Ofertas de Temporada' : 'Explorar Catálogo'}
                    </h1>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                {/* Breadcrumb Section */}
                <div className="mb-8">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{onlyOffers ? 'Ofertas' : 'Catálogo'}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar Filters */}
                    <aside className="hidden lg:block w-64 flex-none">
                        <div className="sticky top-24 space-y-8">
                            {/* Categories */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-text-main dark:text-white mb-4">
                                    Categorías
                                </h3>
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <label key={cat.slug} className="flex items-center justify-between group cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <Checkbox id={cat.slug} />
                                                <span className="text-sm text-text-muted group-hover:text-brand-primary dark:text-slate-400 transition-colors">
                                                    {cat.name}
                                                </span>
                                            </div>
                                            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                                                {cat.count}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <Separator />

                            {/* Price range */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-text-main dark:text-white mb-4">
                                    Rango de Precio
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="Min" className="h-8 text-xs" />
                                    <Input placeholder="Max" className="h-8 text-xs" />
                                </div>
                                <Button size="sm" className="w-full mt-3 h-8 text-xs bg-brand-primary">
                                    Aplicar Filtro
                                </Button>
                            </section>

                            <Separator />

                            {/* Categories */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-text-main dark:text-white mb-4">
                                    Categorías
                                </h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <div key={category.slug} className="flex items-center justify-between">
                                            <Checkbox 
                                                id={`category-${category.slug}`} 
                                                className="border-slate-300 data-[state=checked]:bg-highlight data-[state=checked]:border-highlight"
                                            />
                                            <label 
                                                htmlFor={`category-${category.slug}`}
                                                className="flex-1 text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:text-brand-primary"
                                            >
                                                {category.name}
                                            </label>
                                            <Badge variant="secondary" className="bg-slate-100 text-[10px] text-slate-500 font-bold dark:bg-slate-800">
                                                {category.count}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <Separator />

                            {/* Brands */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-text-main dark:text-white mb-4">
                                    Marcas
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {brands.map((brand) => (
                                        <div key={brand} className="flex items-center gap-2 group cursor-pointer">
                                            <Checkbox 
                                                id={`brand-${brand}`} 
                                                className="border-slate-300 data-[state=checked]:bg-highlight data-[state=checked]:border-highlight"
                                            />
                                            <label 
                                                htmlFor={`brand-${brand}`}
                                                className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:text-brand-primary"
                                            >
                                                {brand}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <Separator />

                            {/* Options */}
                            <section>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <Checkbox id="restricted" />
                                    <span className="text-sm text-text-muted dark:text-slate-400">Ver solo restringidos</span>
                                </label>
                                <label className="flex items-center gap-2 mt-2 cursor-pointer group">
                                    <Checkbox id="stock" />
                                    <span className="text-sm text-text-muted dark:text-slate-400">Con stock disponible</span>
                                </label>
                            </section>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6 bg-white dark:bg-[#1C1C1A] p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-4">
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                     Mostrando {displayProducts.length} productos
                                 </p>
                                 <div className="hidden sm:flex items-center gap-1 border rounded-lg p-1 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                     <Button 
                                         variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                                         size="icon" 
                                         className="h-8 w-8"
                                         onClick={() => setViewMode('grid')}
                                     >
                                         <LayoutGrid className="h-4 w-4" />
                                     </Button>
                                     <Button 
                                         variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                                         size="icon" 
                                         className="h-8 w-8"
                                         onClick={() => setViewMode('list')}
                                     >
                                         <List className="h-4 w-4" />
                                     </Button>
                                 </div>
                                 <Select defaultValue="popular">
                                     <SelectTrigger className="w-[180px] h-9 text-xs">
                                         <SelectValue placeholder="Ordenar por" />
                                     </SelectTrigger>
                                     <SelectContent>
                                         <SelectItem value="popular">Más Populares</SelectItem>
                                         <SelectItem value="newest">Más Recientes</SelectItem>
                                         <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                                         <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                                     </SelectContent>
                                 </Select>
                                 
                                 <Button variant="outline" size="sm" className="lg:hidden h-9">
                                     <SlidersHorizontal className="h-4 w-4 mr-2" />
                                     Filtros
                                 </Button>
                             </div>
                         </div>
 
                         {/* Product Grid */}
                         <div className={viewMode === 'grid' ? 
                             "grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-8" : 
                             "flex flex-col gap-4"
                         }>
                             {displayProducts.map((product) => (
                                <div key={product.id} className={viewMode === 'grid' ? 
                                    "group relative flex flex-col rounded-2xl bg-white dark:bg-[#1C1C1A] overflow-hidden border border-border transition-all hover:shadow-xl hover:-translate-y-1" : 
                                    "group relative flex items-center gap-6 p-4 rounded-2xl bg-white dark:bg-[#1C1C1A] border border-border transition-all hover:shadow-lg"
                                }>
                                    {/* Image */}
                                    <div className={viewMode === 'grid' ? 
                                        "aspect-square w-full overflow-hidden bg-white relative" : 
                                        "h-32 w-32 flex-none overflow-hidden rounded-xl bg-white relative"
                                    }>
                                        <Link href={`/producto/${product.id}`} className="block h-full w-full">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </Link>
                                        {product.is_restricted && (
                                            <Badge className="absolute top-4 right-4 bg-brand-primary font-bold uppercase text-[9px] tracking-widest z-20 text-white border-none">
                                                Restringido
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className={viewMode === 'grid' ? "p-5 flex flex-col flex-1" : "flex-1 flex justify-between items-center pr-4"}>
                                        <div className={viewMode === 'grid' ? "" : "max-w-md"}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-bold uppercase tracking-tight text-highlight bg-highlight/10 px-2 py-0.5 rounded">
                                                    {product.brand}
                                                </span>
                                                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                                                    {product.category}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-semibold text-text-main dark:text-slate-200 mb-2 relative z-10">
                                                <Link href={`/producto/${product.id}`} className="hover:text-brand-primary transition-colors">
                                                    {product.name}
                                                </Link>
                                            </h3>
                                            <div className="flex items-end justify-between mt-auto">
                                                <div>
                                                    <p className="text-xl font-bold text-text-main dark:text-white">
                                                        ${product.price.toLocaleString('es-CL')}
                                                    </p>
                                                    <p className={cn(
                                                        "text-[10px] mt-1",
                                                        product.stock < 5 ? "text-orange-500 font-bold" : "text-green-600"
                                                    )}>
                                                        {product.stock < 5 ? `¡Solo ${product.stock} unidades!` : 'En stock'}
                                                    </p>
                                                </div>
                                                
                                                <Button size="icon" className="h-10 w-10 rounded-full bg-action-buy hover:bg-action-hover z-10 transition-transform group-hover:scale-110">
                                                    <ShoppingCart className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-12 flex justify-center">
                            <nav className="flex items-center gap-1">
                                <Button variant="outline" size="sm" disabled>Anterior</Button>
                                <Button variant="secondary" size="sm" className="w-10">1</Button>
                                <Button variant="ghost" size="sm" className="w-10">2</Button>
                                <Button variant="ghost" size="sm" className="w-10">3</Button>
                                <span className="px-2 text-slate-400">...</span>
                                <Button variant="ghost" size="sm" className="w-10">10</Button>
                                <Button variant="outline" size="sm">Siguiente</Button>
                            </nav>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <WhatsAppFloating />
        </div>
    );
}
