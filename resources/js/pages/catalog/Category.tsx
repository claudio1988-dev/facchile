import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { LayoutGrid, List, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryProps {
    categorySlug: string;
}

const CATEGORY_DATA: Record<string, { title: string; description: string; image: string; brands: string[] }> = {
    'rifles-aire-comprimido': {
        title: 'Rifles y Aire Comprimido',
        description: 'Potencia, precisión y tecnología de punta para tiro deportivo y control de plagas.',
        image: '/images/imagenesdemo/1.avif',
        brands: ['Gamo', 'Hatsan', 'Crosman', 'Airforce', 'Kral']
    },
    'pesca-deportiva': {
        title: 'Pesca Deportiva',
        description: 'Todo lo que necesitas para tu próxima captura: carretes, cañas y señuelos de alto rendimiento.',
        image: '/images/imagenesdemo/5.png',
        brands: ['Shimano', 'Rapala', 'Okuma', 'Abu Garcia', 'Penn']
    },
    'camping-outdoor': {
        title: 'Camping & Outdoor',
        description: 'Explora lo inexplorado con el mejor equipamiento: carpas, mochilas y supervivencia.',
        image: '/images/imagenesdemo/3.jpg',
        brands: ['Doite', 'Lippi', 'Coleman', 'Naturehike', 'Sea to Summit']
    },
    'caza-supervivencia': {
        title: 'Caza y Supervivencia',
        description: 'Herramientas robustas y vestimenta táctica diseñada para las condiciones más exigentes.',
        image: '/images/imagenesdemo/1.avif',
        brands: ['Victorinox', 'Gerber', 'Spyderco', '5.11 Tactical', 'Browning']
    }
};

// Mock products filtered by category slug (simplified)
const allProducts = [
    { id: 1, name: 'Rifle Nitro Piston Gamo Swarm Fox', cat: 'rifles-aire-comprimido', p: 289990, image: '/images/imagenesdemo/1.avif', brand: 'Gamo', stock: 5 },
    { id: 2, name: 'Reel Shimano Nasci FB', cat: 'pesca-deportiva', p: 124990, image: '/images/imagenesdemo/5.png', brand: 'Shimano', stock: 2 },
    { id: 3, name: 'Carpa Doite Himalaya 2 Personas', cat: 'camping-outdoor', p: 159990, image: '/images/imagenesdemo/3.jpg', brand: 'Doite', stock: 12 },
    { id: 4, name: 'Cuchillo Victorinox Ranger Grip 79', cat: 'caza-supervivencia', p: 84990, image: '/images/imagenesdemo/5.png', brand: 'Victorinox', stock: 25 },
    { id: 5, name: 'Rifle Hatsan Factor FDE PCP', cat: 'rifles-aire-comprimido', p: 850000, image: '/images/imagenesdemo/1.avif', brand: 'Hatsan', stock: 3 },
    { id: 6, name: 'Reel Baitcasting High Performance', cat: 'pesca-deportiva', p: 89990, image: '/images/imagenesdemo/3.jpg', brand: 'Generic', stock: 8 },
    { id: 7, name: 'Señuelo Rapala Magnum Countdown', cat: 'pesca-deportiva', p: 14990, image: '/images/imagenesdemo/2.jpg', brand: 'Rapala', stock: 45 },
    { id: 8, name: 'Carrete Okuma Custom Black CB-60', cat: 'pesca-deportiva', p: 89990, image: '/images/imagenesdemo/5.png', brand: 'Okuma', stock: 15 },
];

export default function Category({ categorySlug: rawSlug }: CategoryProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    
    // Normalize slug to handle both underscores and hyphens
    const categorySlug = rawSlug.replace(/_/g, '-');

    const category = CATEGORY_DATA[categorySlug] || {
        title: 'Explorar Categoría',
        description: 'Encuentra el mejor equipamiento para tu pasión outdoor.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
        brands: ['Gamo', 'Shimano', 'Doite']
    };

    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => p.cat === categorySlug || p.cat === rawSlug);
    }, [categorySlug, rawSlug]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a]">
            <Head title={`${category.title} | Facchile Outdoor`} />
            <Header />

            {/* Category Hero */}
            <div className="relative h-[100px] w-full mt-24 overflow-hidden">
                <img 
                    src={category.image} 
                    alt={category.title} 
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary to-transparent" />
                <div className="relative z-10 mx-auto max-w-7xl px-4 h-full flex flex-col justify-end pb-3 sm:px-6 lg:px-8 text-white">
                    <h1 className="text-xl font-black tracking-tight drop-shadow-lg">
                        {category.title}
                    </h1>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
                <div className="flex gap-8">
                    {/* Sidebar Filters */}
                    <aside className="hidden lg:block w-64 flex-none">
                        <div className="sticky top-24 space-y-8">
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-text-main dark:text-white mb-4">
                                    Marcas Especializadas
                                </h3>
                                <div className="space-y-2">
                                    {category.brands.map((brand) => (
                                        <label key={brand} className="flex items-center gap-2 group cursor-pointer text-sm">
                                            <Checkbox />
                                            <span className="text-text-muted group-hover:text-brand-primary transition-colors dark:text-slate-400">
                                                {brand}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <Separator />

                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-text-main dark:text-white mb-4">
                                    Rango de Precio
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="Min" className="h-8 text-xs" />
                                    <Input placeholder="Max" className="h-8 text-xs" />
                                </div>
                            </section>

                            <Separator />

                            <section>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <Checkbox />
                                    <span className="text-sm text-text-muted dark:text-slate-400">En promoción</span>
                                </label>
                                <label className="flex items-center gap-2 mt-2 cursor-pointer group">
                                    <Checkbox />
                                    <span className="text-sm text-text-muted dark:text-slate-400">Entrega rápida</span>
                                </label>
                            </section>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-8 bg-white dark:bg-[#1C1C1A] p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-2 text-sm text-text-muted">
                                <span className="font-semibold text-text-main dark:text-white">{filteredProducts.length}</span> productos encontrados
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex items-center gap-1 border rounded-lg p-1 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                    <Button 
                                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                                        size="icon" 
                                        className="h-7 w-7"
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                                        size="icon" 
                                        className="h-7 w-7"
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
                                        <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                                        <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className={cn(
                            viewMode === 'grid' 
                                ? "grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3" 
                                : "flex flex-col gap-4"
                        )}>
                            {filteredProducts.map((product) => (
                                <div key={product.id} className={cn(
                                    "relative",
                                    viewMode === 'grid' 
                                        ? "group relative flex flex-col rounded-3xl bg-white dark:bg-[#1C1C1A] overflow-hidden border border-slate-100 dark:border-slate-800 transition-all hover:shadow-2xl" 
                                        : "group relative flex items-center gap-6 p-4 rounded-3xl bg-white dark:bg-[#1C1C1A] border border-slate-100 dark:border-slate-800 transition-all hover:shadow-xl"
                                )}>
                                    {/* Image Wrapper */}
                                    <div className={cn(
                                        "relative overflow-hidden bg-white",
                                        viewMode === 'grid' ? "aspect-square w-full" : "h-32 w-32 flex-none rounded-2xl"
                                    )}>
                                        <Link href={`/producto/${product.id}`} className="block h-full w-full">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </Link>
                                        <div className="absolute top-4 left-4 z-20">
                                            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-[10px] font-bold dark:bg-black/50">
                                                {product.brand}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Content Wrapper */}
                                    <div className={cn(
                                        "flex flex-col flex-1",
                                        viewMode === 'grid' ? "p-6" : "pr-4"
                                    )}>
                                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2 leading-tight relative z-10">
                                            <Link href={`/producto/${product.id}`} className="hover:text-brand-primary transition-colors">
                                                {product.name}
                                            </Link>
                                        </h3>
                                        <div className="mt-auto flex items-center justify-between">
                                            <div>
                                                <p className="text-2xl font-black text-brand-primary dark:text-[#7EB55B]">
                                                    ${product.p.toLocaleString('es-CL')}
                                                </p>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">IVA incluido</p>
                                            </div>
                                            <Button size="icon" className="h-12 w-12 rounded-2xl bg-action-buy hover:bg-action-hover transition-all shadow-lg hover:shadow-action-buy/20">
                                                <ShoppingCart className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <WhatsAppFloating />
        </div>
    );
}
