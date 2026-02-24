import { Head, Link, router } from '@inertiajs/react';
import { Search, Filter, LayoutGrid, List, ShoppingCart, ChevronDown, Check, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn, formatPrice } from '@/lib/utils';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useCartStore } from '@/store/useCartStore';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from 'sonner';

// ... imports ...

interface Category {
    id: number;
    name: string;
    slug: string;
    products_count: number;
    children?: Category[];
}

interface Brand {
    id: number;
    name: string;
    products_count: number;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    base_price: number;
    main_image_url: string | null;
    is_restricted: boolean;
    category: Category | null;
    brand: Brand | null;
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface Props {
    paginatedProducts: PaginatedProducts;
    categories: Category[];
    brands: Brand[];
    filters: {
        search?: string;
        category?: string;
        brand?: string;
        restricted?: boolean;
        sort?: string;
    };
    onlyOffers?: boolean;
    currentCategory?: Category | null;
}

// Recursive Category Item Component
const CategoryItem = ({ category, selectedSlugs, onToggle }: { category: Category, selectedSlugs: string[], onToggle: (slug: string, checked: boolean) => void }) => {
    const isSelected = selectedSlugs.includes(category.slug);
    // Check if any child is selected to auto-expand or highlights
    const hasSelectedChild = category.children?.some(child => selectedSlugs.includes(child.slug) || child.children?.some(grand => selectedSlugs.includes(grand.slug)));
    const [isExpanded, setIsExpanded] = useState(hasSelectedChild);

    useEffect(() => {
        if (hasSelectedChild) setIsExpanded(true);
    }, [hasSelectedChild]);

    // Use total recursive count if available, otherwise direct count
    const count = (category as any).total_products_count ?? category.products_count;

    return (
        <div className="ml-1">
             <div className="flex items-center justify-between group py-1">
                <div className="flex items-center gap-2">
                    {category.children && category.children.length > 0 && (
                        <button 
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)} 
                            className="p-0.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                    )}
                    
                    <Checkbox 
                        id={`cat-${category.slug}`} 
                        className="rounded-none w-3.5 h-3.5 border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
                        checked={isSelected}
                        onCheckedChange={(checked) => onToggle(category.slug, checked === true)}
                    />
                    <label 
                        htmlFor={`cat-${category.slug}`}
                        className={cn(
                            "text-sm transition-colors cursor-pointer select-none",
                            isSelected ? "font-bold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 group-hover:text-black dark:group-hover:text-white"
                        )}
                    >
                        {category.name}
                    </label>
                </div>
                {count > 0 && (
                    <span className="text-[10px] text-slate-400">({count})</span>
                )}
            </div>
            
            {/* Render Children */}
            {isExpanded && category.children && (
                <div className="ml-4 border-l border-slate-100 pl-2 space-y-1 mt-1">
                    {category.children.map(child => (
                        <CategoryItem 
                            key={child.id} 
                            category={child} 
                            selectedSlugs={selectedSlugs} 
                            onToggle={onToggle} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// ... existing code ...

// Update Catalog default export to filter brands with 0 products or weird names if needed
// Or better do it in Controller.


export default function Catalog({ paginatedProducts, categories, brands, filters, onlyOffers = false, currentCategory }: Props) {

    const addToCart = useCartStore((state) => state.addToCart);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [search, setSearch] = useState(filters.search || '');

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                updateFilters({ search: search });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const updateFilters = (newFilters: Partial<typeof filters>) => {
        router.get('/catalogo', { ...filters, ...newFilters }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleCategoryChange = (slug: string, checked: boolean) => {
        const current = filters.category ? filters.category.split(',') : [];
        let updated: string[];
        
        if (checked) {
            updated = [...current, slug];
        } else {
            updated = current.filter(c => c !== slug);
        }
        
        updateFilters({ category: updated.length > 0 ? updated.join(',') : undefined });
    };

    const handleBrandChange = (name: string, checked: boolean) => {
        const current = filters.brand ? filters.brand.split(',') : [];
        let updated: string[];

        if (checked) {
            updated = [...current, name];
        } else {
            updated = current.filter(b => b !== name);
        }

        updateFilters({ brand: updated.length > 0 ? updated.join(',') : undefined });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
            {/* Adjusted Spacer for fixed header: TopBar (~32px) + Header (~80px) + Nav (~50px) = ~162px */}
            <div className="pt-[110px] md:pt-[145px] lg:pt-[155px]"> {/* Spacer for fixed header */}
                <Head title={onlyOffers ? "Ofertas Especiales | Facchile Outdoor" : "Catálogo | Facchile Outdoor"} />
                
                <Header />

                {/* Breadcrumbs Section */}
                <div className="bg-[#f4f4f4] py-3 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                         <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/" className="text-xs text-slate-500 uppercase">Inicio</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-xs font-bold text-slate-900 uppercase dark:text-white">
                                        {onlyOffers ? 'Ofertas' : 'Productos'}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                             </BreadcrumbList>
                         </Breadcrumb>

                        <div className="text-right flex items-center gap-2">
                             <h1 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-tight">
                                  {onlyOffers ? 'Ofertas' : (currentCategory ? currentCategory.name : 'Productos')}
                             </h1>
                             <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                                 ({paginatedProducts.total} Productos)
                             </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    
                    {/* Horizontal Category Scroll (Mobile Only) */}
                    <div className="lg:hidden mb-8 -mx-4 px-4 overflow-x-auto no-scrollbar flex items-center gap-2 pb-2">
                        <Button 
                            variant={!filters.category ? "default" : "outline"} 
                            size="sm" 
                            className="rounded-full text-[10px] h-8 px-4 shrink-0 font-bold uppercase tracking-tight"
                            onClick={() => updateFilters({ category: undefined })}
                        >
                            Todo
                        </Button>
                        {categories.map((cat) => (
                            <Button 
                                key={cat.id}
                                variant={filters.category?.split(',').includes(cat.slug) ? "default" : "outline"}
                                size="sm" 
                                className={cn(
                                    "rounded-full text-[10px] h-8 px-4 shrink-0 font-bold uppercase tracking-tight transition-all",
                                    filters.category?.split(',').includes(cat.slug) ? "bg-brand-primary text-white border-brand-primary" : ""
                                )}
                                onClick={() => handleCategoryChange(cat.slug, !filters.category?.split(',').includes(cat.slug))}
                            >
                                {cat.name}
                            </Button>
                        ))}
                    </div>

                    {/* Toolbar & Layout */}
                    <div className="flex flex-col lg:flex-row gap-12">
                        
                        {/* Sidebar Filters */}
                        <aside className="w-full lg:w-64 flex-none space-y-8">
                            
                            {/* Toolbar (Mobile only) */}
                            <div className="lg:hidden flex justify-between items-center mb-6 gap-3">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="flex-1 gap-2 h-11 font-bold">
                                            <Filter className="w-4 h-4" /> Filtros Avanzados
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-full sm:w-[320px] p-0 bg-white dark:bg-[#0a0a0a]">
                                        <SheetHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
                                            <SheetTitle className="text-left font-black uppercase text-slate-900 dark:text-white">Filtros</SheetTitle>
                                            <SheetDescription className="text-left">Ajusta los parámetros de búsqueda.</SheetDescription>
                                        </SheetHeader>
                                        <div className="p-6 overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar">
                                            <div className="space-y-10">
                                                {/* Reusing Categories & Brands here would be ideal, but for now just move them */}
                                                <div className="mb-8">
                                                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest border-l-2 border-brand-primary pl-3">Categorías</h4>
                                                    <div className="space-y-3">
                                                        {categories.map((cat) => (
                                                            <CategoryItem 
                                                                key={cat.id} 
                                                                category={cat}
                                                                selectedSlugs={filters.category?.split(',') || []}
                                                                onToggle={handleCategoryChange}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="mb-0">
                                                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest border-l-2 border-brand-primary pl-3">Marcas</h4>
                                                    <div className="space-y-4">
                                                        {brands.map((brand) => (
                                                            <div key={brand.id} className="flex items-center justify-between group">
                                                                <div className="flex items-center gap-3">
                                                                    <Checkbox 
                                                                        id={`drawer-brand-${brand.id}`} 
                                                                        className="rounded-none border-slate-300"
                                                                        checked={filters.brand?.split(',').includes(brand.name)}
                                                                        onCheckedChange={(checked) => handleBrandChange(brand.name, checked === true)}
                                                                    />
                                                                    <label htmlFor={`drawer-brand-${brand.id}`} className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white cursor-pointer">{brand.name}</label>
                                                                </div>
                                                                <span className="text-[10px] font-bold text-slate-400">({brand.products_count})</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#0a0a0a] border-t border-slate-100 dark:border-slate-800">
                                            <SheetTrigger asChild>
                                                <Button className="w-full bg-brand-primary h-12 font-bold uppercase tracking-widest text-xs">
                                                    Ver {paginatedProducts.total} Productos
                                                </Button>
                                            </SheetTrigger>
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                <Select 
                                    value={filters.sort || 'popular'} 
                                    onValueChange={(value) => updateFilters({ sort: value })}
                                >
                                    <SelectTrigger className="flex-1 h-11 font-bold">
                                        <SelectValue placeholder="Ordenar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="popular">Más Populares</SelectItem>
                                        <SelectItem value="newest">Más Recientes</SelectItem>
                                        <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                                        <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Filters Content (Desktop and Hidden on Mobile) */}
                            <div className="hidden lg:block">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white">Filtros</h3>
                                    <Filter className="w-4 h-4 text-slate-400" />
                                </div>
                                <Separator className="mb-6" />

                                {/* Categories */}
                                <div className="mb-8">
                                    <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-4 tracking-wider">Categorías</h4>
                                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                        {categories.map((cat) => (
                                            <CategoryItem 
                                                key={cat.id} 
                                                category={cat}
                                                selectedSlugs={filters.category?.split(',') || []}
                                                onToggle={handleCategoryChange}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Brands */}
                                <div className="mb-8">
                                    <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-4 tracking-wider">Marcas</h4>
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        {brands.map((brand) => (
                                            <div key={brand.id} className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <Checkbox 
                                                        id={`brand-${brand.id}`} 
                                                        className="rounded-none border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
                                                        checked={filters.brand?.split(',').includes(brand.name) ?? false}
                                                        onCheckedChange={(checked) => handleBrandChange(brand.name, checked === true)}
                                                    />
                                                    <label 
                                                        htmlFor={`brand-${brand.id}`}
                                                        className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-black dark:group-hover:text-white transition-colors cursor-pointer"
                                                    >
                                                        {brand.name}
                                                    </label>
                                                </div>
                                                <span className="text-xs text-slate-400">({brand.products_count})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range (Placeholder for now) */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-4 tracking-wider">Precio</h4>
                                    {/* Include price slider/inputs here if needed later */}
                                </div>
                            </div>
                        </aside>

                        {/* Product Grid Area */}
                        <div className="flex-1">
                            {/* Toolbar (Desktop) */}
                            <div className="hidden lg:flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span className="font-medium text-slate-900 dark:text-white">Ver como</span>
                                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded">
                                        <button 
                                            onClick={() => setViewMode('grid')}
                                            className={cn("p-1.5 rounded transition-all", viewMode === 'grid' ? "bg-white shadow text-black" : "text-slate-400 hover:text-slate-600")}
                                        >
                                            <LayoutGrid className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => setViewMode('list')}
                                            className={cn("p-1.5 rounded transition-all", viewMode === 'list' ? "bg-white shadow text-black" : "text-slate-400 hover:text-slate-600")}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-slate-500">Ordenar por</span>
                                    <Select 
                                        value={filters.sort || 'popular'} 
                                        onValueChange={(value) => updateFilters({ sort: value })}
                                    >
                                        <SelectTrigger className="w-[200px] border-none bg-transparent hover:bg-slate-50 focus:ring-0 text-slate-900 font-medium text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="popular">Alfabéticamente, A-Z</SelectItem>
                                            <SelectItem value="newest">Más Recientes</SelectItem>
                                            <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                                            <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Products Grid */}
                            <div className={viewMode === 'grid' ? 
                                "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8" : 
                                "flex flex-col gap-6"
                            }>
                                {paginatedProducts.data.map((product) => (
                                    <div key={product.id} className={viewMode === 'grid' ? 
                                        "group" : 
                                        "group flex gap-6 bg-white border p-4 rounded-lg"
                                    }>
                                        {/* Product Image */}
                                        <div className={viewMode === 'grid' ? 
                                            "relative aspect-square bg-[#f6f6f6] dark:bg-slate-800 mb-4 overflow-hidden" :
                                            "relative w-48 aspect-square bg-[#f6f6f6] dark:bg-slate-800 flex-none"
                                        }>
                                            <Link href={`/producto/${product.slug}`} className="block w-full h-full">
                                                <img
                                                    src={product.main_image_url || '/images/gentepescando.jpeg'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
                                                    onError={(e) => { e.currentTarget.src = '/images/gentepescando.jpeg'; }}
                                                />
                                            </Link>
                                            
                                            {/* Badges */}
                                            {product.is_restricted && (
                                                <div className="absolute top-2 right-2">
                                                    <Badge className="bg-red-600 hover:bg-red-700 text-[10px] uppercase font-bold tracking-wider rounded-sm">
                                                        Restringido
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className={cn(
                                            "p-2 md:p-0",
                                            viewMode === 'grid' ? "text-center md:text-left" : "flex-1 flex flex-col justify-center"
                                        )}>
                                            {product.brand && (
                                                <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                                    {product.brand.name}
                                                </p>
                                            )}
                                            
                                            <h3 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white mb-2 leading-tight min-h-[3em] md:min-h-[2.5em]">
                                                <Link href={`/producto/${product.slug}`} className="hover:text-brand-primary transition-colors line-clamp-2">
                                                    {product.name}
                                                </Link>
                                            </h3>

                                            <div className="flex items-center justify-between mt-1 md:mt-2">
                                                <p className="text-sm md:text-lg font-black text-slate-900 dark:text-white">
                                                    {formatPrice(product.base_price)}
                                                </p>
                                                
                                                {/* Add to Cart Button */}
                                                <button 
                                                    className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 bg-brand-primary text-white rounded-full hover:bg-brand-secondary transition-all shadow-sm"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        addToCart(product);
                                                        import('@inertiajs/react').then(({ router }) => {
                                                            router.visit('/checkout');
                                                        });
                                                    }}
                                                    title="Agregar al carrito"
                                                >
                                                    <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {paginatedProducts.links.length > 3 && (
                                <div className="mt-16 flex justify-center">
                                    <nav className="flex items-center gap-2">
                                        {paginatedProducts.links.map((link, i) => {
                                            const isNumeric = !isNaN(Number(link.label));
                                            return link.url ? (
                                                <Link 
                                                    key={i} 
                                                    href={link.url}
                                                    preserveScroll
                                                    preserveState
                                                >
                                                    <Button 
                                                        variant={link.active ? "default" : "outline"}
                                                        size="sm"
                                                        className={cn(
                                                            "h-10 px-3",
                                                            isNumeric ? "w-10 p-0" : "w-auto px-4",
                                                            link.active ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                        )}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                </Link>
                                            ) : (
                                                <span 
                                                    key={i} 
                                                    className={cn(
                                                        "flex items-center justify-center h-10 px-2 text-slate-300",
                                                        !isNumeric && "px-4"
                                                    )} 
                                                    dangerouslySetInnerHTML={{ __html: link.label }} 
                                                />
                                            );
                                        })}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                <Footer />
                <WhatsAppFloating />
            </div>
        </div>
    );
}
