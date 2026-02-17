import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, Search, User, Menu, X, Phone, Truck, ShieldCheck, MapPin, ChevronRight, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ModeToggle from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SharedData } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import CartSheet from '@/components/home/CartSheet';

// Using '/images/gentepescando.jpeg' as the universal placeholder image as requested
const PLACEHOLDER_IMAGE = '/images/gentepescando.jpeg';

interface ApiCategory {
    id: number;
    name: string;
    slug: string;
    image_url: string | null;
    children: {
        id: number;
        name: string;
        slug: string;
        image_url: string | null;
        children?: {
             id: number;
             name: string;
             slug: string;
        }[];
        products: {
            name: string;
            href: string;
            image: string | null;
        }[];
    }[];
}

interface SharedProps extends SharedData {
    categories: ApiCategory[];
}

export default function Header() {
    const { auth, categories = [], filters } = usePage<SharedProps & { filters?: { search?: string } }>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Update search term if URL changes (e.g. back button)
    useEffect(() => {
        setSearchTerm(filters?.search || '');
    }, [filters?.search]);

    const handleSearch = () => {
        if (!searchTerm.trim()) return;
        
        // Use window.location for full page reload or Inertia router for SPA navigation
        // Using Inertia router is better for SPA feel
         import('@inertiajs/react').then(({ router }) => {
            router.get('/catalogo', { search: searchTerm }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        });
    };

    interface SubCategory {
        name: string;
        href: string;
        image: string;
        items: {
            name: string;
            href: string;
            image: string;
        }[];
    }

    interface NavigationItem {
        name: string;
        href: string;
        type: string;
        featured?: boolean;
        subcategories?: SubCategory[];
    }

    // Dynamic Navigation Data
    const navigationData: NavigationItem[] = useMemo(() => {
        const categoryMap = new Map((categories || []).map(c => [c.slug, c]));
        const categoryNameMap = new Map((categories || []).map(c => [c.name.toUpperCase(), c]));

        const createItem = (label: string, slug: string, dbName?: string): NavigationItem => {
            let cat = categoryMap.get(slug);
            if (!cat && dbName) cat = categoryNameMap.get(dbName.toUpperCase());
            if (!cat) cat = categoryNameMap.get(label.toUpperCase());

            if (cat) {
                 return {
                    name: label,
                    href: `/catalogo?category=${cat.slug}`,
                    type: (cat.children && cat.children.length > 0) ? 'mega' : 'simple',
                    subcategories: (cat.children || []).map(child => {
                        // Priority: Display Level 3 Categories if available (as in "Cañas de Pesca" -> "Cañas de Mar", etc.)
                        // Fallback: Display Products if no Level 3 categories exist
                        let gridItems = [];
                        
                        if (child.children && child.children.length > 0) {
                             gridItems = child.children.map(grand => ({
                                name: grand.name,
                                href: `/catalogo?category=${grand.slug}`,
                                image: child.image_url || PLACEHOLDER_IMAGE // Grandchildren don't have images in current API, reuse parent or placeholder
                             }));
                        } else {
                             gridItems = (child.products || []).map(prod => ({
                                name: prod.name,
                                href: prod.href,
                                image: prod.image || PLACEHOLDER_IMAGE
                            }));
                        }

                        return {
                            name: child.name,
                            href: `/catalogo?category=${child.slug}`,
                            image: child.image_url || PLACEHOLDER_IMAGE,
                            items: gridItems
                        };
                    })
                };
            }
            
            return { 
                name: label, 
                href: `/catalogo?category=${slug}`, 
                type: 'simple' 
            };
        };

        return [
            { name: 'TIENDA', href: '/catalogo', type: 'simple' },
            createItem('OUTDOOR', 'outdoor'),
            createItem('CUCHILLERÍA Y CAZA', 'cuchilleria-y-caza'),
            createItem('PESCA', 'pesca-deportiva'), // Mapped to pesca-deportiva based on user context
            createItem('ROPA & ACCESORIOS', 'ropa-y-accesorios', 'ROPA'),
            { name: 'OFERTAS', href: '/catalogo?offers=true', type: 'simple', featured: true },
        ];
    }, [categories]);

    // Mega Menu State
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (categoryName: string) => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setActiveCategory(categoryName);
        
        // Set default subcategory (the first one) when opening a new category
        const category = navigationData.find(c => c.name === categoryName);
        if (category?.subcategories && category.subcategories.length > 0) {
            setActiveSubcategory(category.subcategories[0].name);
        }
    };

    const handleMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setActiveCategory(null);
            setActiveSubcategory(null);
        }, 150);
    };

    const handleSubCategoryHover = (subName: string) => {
        setActiveSubcategory(subName);
    };

    const currentCategoryData = navigationData.find(c => c.name === activeCategory);
    const currentSubCategoryData = currentCategoryData?.subcategories?.find(s => s.name === activeSubcategory);

    return (
        <header 
            className="fixed top-0 z-40 w-full bg-white dark:bg-[#0a0a0a] shadow-sm transition-all duration-300"
            onMouseLeave={handleMouseLeave}
        >
            {/* 1. Top Bar */}
            <div className="bg-brand-secondary text-white py-1.5 px-4 text-[10px] sm:text-xs font-medium tracking-wide">
                <div className="mx-auto max-w-7xl flex flex-row justify-center sm:justify-between items-center gap-2">
                    <p className="text-center sm:text-left">Envío gratis en compras sobre $150.000</p>
                    <div className="hidden sm:flex items-center gap-4 uppercase text-[11px]">
                         <Link href="/tracking" className="flex items-center gap-1.5 hover:text-gray-200 transition-colors"><Truck className="h-3.5 w-3.5" /><span>Sigue tu pedido</span></Link>
                         <Link href="/despacho" className="flex items-center gap-1.5 hover:text-gray-200 transition-colors"><MapPin className="h-3.5 w-3.5" /><span>Zonas de despacho</span></Link>
                         <Link href="/garantias" className="flex items-center gap-1.5 hover:text-gray-200 transition-colors"><ShieldCheck className="h-3.5 w-3.5" /><span>Garantías</span></Link>
                         <Link href="/contacto" className="flex items-center gap-1.5 hover:text-gray-200 transition-colors"><Phone className="h-3.5 w-3.5" /><span>Contáctanos</span></Link>
                    </div>
                </div>
            </div>

            {/* 2. Main Header */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20 bg-white dark:bg-[#0a0a0a]">
                <div className="flex h-20 items-center justify-between gap-4">
                    {/* Left: Mobile Menu & Search Icon */}
                    <div className="flex items-center flex-1 gap-1">
                        <div className="lg:hidden">
                            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                        <div className="lg:hidden">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                                className={cn(isMobileSearchOpen && "text-brand-primary")}
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="hidden lg:flex w-full max-w-xs relative bg-slate-100 dark:bg-slate-800 rounded-md">
                            <div className="flex items-center px-3 border-r border-slate-300 dark:border-slate-700">
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Todos</span>
                                <ChevronDown className="h-3 w-3 ml-1 text-slate-500" />
                            </div>
                            <Input 
                                placeholder="Buscar productos..." 
                                className="pl-3 bg-transparent border-none focus-visible:ring-0 h-10 w-full text-xs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button 
                                onClick={handleSearch}
                                className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-slate-400 hover:text-brand-primary transition-colors"
                            >
                                <Search className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Center: Logo */}
                    <div className="flex-shrink-0 flex justify-center">
                        <Link href="/" className="group">
                             <img 
                                src="/logo.png" 
                                alt="Facchile Logo" 
                                className="h-16 w-auto object-contain transition-transform group-hover:scale-105 dark:brightness-0 dark:invert"
                            />
                        </Link>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-end flex-1 gap-2 sm:gap-4">
                        <ModeToggle />
                        
                        {/* User */}
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                                    <DropdownMenuItem asChild><Link href="/settings/profile">Perfil</Link></DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild><Link href="/logout" method="post" as="button" className="w-full text-left text-red-600">Cerrar Sesión</Link></DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                <Link href="/login"><User className="h-5 w-5" /></Link>
                            </Button>
                        )}

                        {/* Cart */}
                        <Link href="/checkout">
                            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-action-buy text-[10px] font-bold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Search Bar (Expandable) */}
                <div className={cn(
                    "lg:hidden overflow-hidden transition-all duration-300 bg-slate-50 dark:bg-slate-900",
                    isMobileSearchOpen ? "h-14 border-t border-slate-100 dark:border-slate-800" : "h-0"
                )}>
                    <div className="mx-auto max-w-7xl px-4 h-full flex items-center gap-2">
                        <Input 
                            id="mobile-search-input"
                            placeholder="Buscar productos..." 
                            className="flex-1 bg-white dark:bg-slate-800 border-none h-9 text-sm focus-visible:ring-brand-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button 
                            size="sm" 
                            className="bg-brand-primary h-9"
                            onClick={handleSearch}
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* 3. Navigation Bar (Desktop) */}
            <div className="hidden lg:block border-t border-slate-100 dark:border-slate-800 relative bg-white dark:bg-[#0a0a0a] z-20">
                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ul className="flex items-center justify-center gap-8 px-4 flex-wrap"> {/* added flex-wrap for safety if many categories */}
                        {navigationData.map((item) => (
                            <li 
                                key={item.name} 
                                onMouseEnter={() => handleMouseEnter(item.name)}
                                className={cn(
                                    "relative h-full py-4 border-b-2 border-transparent transition-all cursor-pointer whitespace-nowrap",
                                    activeCategory === item.name ? "border-slate-900 dark:border-white" : "hover:border-slate-300"
                                )}
                            >
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "text-xs font-bold uppercase tracking-wide flex items-center gap-1",
                                        item.featured ? "text-action-buy" : "text-slate-700 dark:text-slate-200"
                                    )}
                                >
                                    {item.name}
                                    {item.type === 'mega' && <ChevronDown className="h-3 w-3" />}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* 4. MEGA MENU DROPDOWN PANEL */}
            {activeCategory && currentCategoryData?.type === 'mega' && (
                <div 
                    className="absolute left-0 w-full bg-white dark:bg-[#0a0a0a] border-b border-slate-200 dark:border-slate-800 shadow-xl z-30 animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseEnter={() => handleMouseEnter(activeCategory)}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex min-h-[400px]">
                        
                        {/* Sidebar Column (Subcategories) */}
                        <div className="w-64 border-r border-slate-100 dark:border-slate-800 py-6 pr-6 shrink-0">
                            <ul className="space-y-1">
                                {currentCategoryData.subcategories?.map((sub) => (
                                    <li key={sub.name}>
                                        <Link 
                                            href={sub.href}
                                            className={cn(
                                                "flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wide rounded-lg transition-all",
                                                activeSubcategory === sub.name 
                                                    ? "bg-brand-primary text-white shadow-md transform scale-105"
                                                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                            )}
                                            onMouseEnter={() => handleSubCategoryHover(sub.name)}
                                        >
                                            {sub.name}
                                            {activeSubcategory === sub.name && <ChevronRight className="h-4 w-4" />}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Content Grid Column */}
                        <div className="flex-1 p-8 bg-slate-50/30 dark:bg-slate-900/10 overflow-y-auto max-h-[600px]">
                            {currentSubCategoryData ? (
                                <div className="animate-in fade-in zoom-in-95 duration-200">
                                    <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                                        <h3 className="text-lg font-black uppercase text-slate-800 dark:text-white flex items-center gap-2">
                                            {currentSubCategoryData.name}
                                            <Link href={currentSubCategoryData.href} className="text-[10px] font-bold text-brand-primary hover:underline ml-2">
                                                VER TODO
                                            </Link>
                                        </h3>
                                    </div>

                                    {currentSubCategoryData.items && currentSubCategoryData.items.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                            {currentSubCategoryData.items.map((item) => (
                                                <Link key={item.name} href={item.href} className="group flex flex-col items-center text-center gap-3">
                                                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                                                        <img 
                                                            src={item.image || PLACEHOLDER_IMAGE} 
                                                            alt={item.name}
                                                            onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }}
                                                            className="h-full w-full object-contain p-2 mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300 group-hover:text-brand-primary transition-colors line-clamp-2">
                                                        {item.name}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-[300px] text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                            <p className="text-sm font-medium">Explora nuestra colección de {currentSubCategoryData.name}</p>
                                            <Button variant="outline" size="sm" className="mt-4 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-colors" asChild>
                                                <Link href={currentSubCategoryData.href}>Ver Todo</Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    Selecciona una categoría para ver opciones
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[100] bg-white dark:bg-[#0a0a0a] animate-in slide-in-from-left duration-300">
                     <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="p-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                            <img src="/logo.png" alt="Logo" className="h-8 w-auto dark:brightness-0 dark:invert" />
                            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">
                            {/* Account Section Quick Access */}
                            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
                                {auth.user ? (
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold">
                                            {auth.user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{auth.user.name}</p>
                                            <Link href="/dashboard" className="text-xs text-brand-primary font-medium" onClick={() => setIsMobileMenuOpen(false)}>Mi Perfil</Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 w-full">
                                        <p className="text-xs text-slate-500 mb-2">Inicia sesión para una mejor experiencia</p>
                                        <Button asChild size="sm" className="bg-brand-primary w-full">
                                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Iniciar Sesión</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <nav className="p-6">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 text-center">Menú de Navegación</p>
                                <div className="space-y-2">
                                    {navigationData.map((item) => (
                                        <div key={item.name} className="border-b border-slate-50 dark:border-slate-900 last:border-0">
                                            <div className="flex items-center justify-between py-3">
                                                <Link 
                                                    href={item.href} 
                                                    className={cn(
                                                        "text-sm font-black uppercase tracking-tight",
                                                        item.featured ? "text-action-buy" : "text-slate-800 dark:text-slate-100"
                                                    )}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                                {item.subcategories && item.subcategories.length > 0 && (
                                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                                )}
                                            </div>
                                            {item.subcategories && (
                                                <div className="pl-4 pb-2 flex flex-wrap gap-2">
                                                    {item.subcategories.map(sub => (
                                                        <Link 
                                                            key={sub.name}
                                                            href={sub.href}
                                                            className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </nav>
                        </div>

                        {/* Footer Info */}
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 text-center">
                            <div className="flex justify-center gap-6 mb-4">
                               <Facebook className="h-5 w-5 text-slate-400" />
                               <Instagram className="h-5 w-5 text-slate-400" />
                               <Phone className="h-5 w-5 text-slate-400" />
                            </div>
                            <p className="text-[10px] text-slate-500">San Carlos, Chile | +56 9 7815 5169</p>
                        </div>
                     </div>
                </div>
            )}
        </header>
    );
}
