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
    const { auth, categories = [] } = usePage<SharedProps>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
            { name: 'BLOG', href: '#', type: 'simple' },
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
            className="fixed top-0 z-50 w-full bg-white dark:bg-[#0a0a0a] shadow-sm transition-all duration-300"
            onMouseLeave={handleMouseLeave}
        >
            {/* 1. Top Bar */}
            <div className="bg-brand-secondary text-white py-1.5 px-4 text-xs font-medium tracking-wide">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <p>Disfruta de envío gratis en compras sobre $150.000</p>
                    <div className="flex items-center gap-4 sm:gap-6 uppercase text-[10px] sm:text-[11px]">
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
                    {/* Left: Mobile Menu & Search */}
                    <div className="flex items-center flex-1 gap-4">
                        <div className="lg:hidden">
                            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                        <div className="hidden lg:flex w-full max-w-xs relative bg-slate-100 rounded-md">
                            <div className="flex items-center px-3 border-r border-slate-300">
                                <span className="text-xs font-medium text-slate-600">Todos</span>
                                <ChevronDown className="h-3 w-3 ml-1 text-slate-500" />
                            </div>
                            <Input 
                                placeholder="Buscar el cuchillo perfecto..." 
                                className="pl-3 bg-transparent border-none focus-visible:ring-0 h-10 w-full text-xs"
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
                                    <DropdownMenuItem asChild><Link href="/profile">Perfil</Link></DropdownMenuItem>
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
                        <CartSheet>
                            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-action-buy text-[10px] font-bold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </CartSheet>
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
                    className="absolute left-0 w-full bg-white dark:bg-[#0a0a0a] border-b border-slate-200 dark:border-slate-800 shadow-xl z-10 animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseEnter={() => handleMouseEnter(activeCategory)}
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
                                                "flex items-center justify-between px-4 py-2.5 text-xs font-bold uppercase tracking-wide rounded-md transition-colors",
                                                activeSubcategory === sub.name 
                                                    ? "bg-slate-100 text-black dark:bg-slate-800 dark:text-white"
                                                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
                                            )}
                                            onMouseEnter={() => handleSubCategoryHover(sub.name)}
                                        >
                                            {sub.name}
                                            <ChevronRight className="h-3 w-3 opacity-50" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Content Grid Column */}
                        <div className="flex-1 p-8 bg-slate-50/50 dark:bg-slate-900/20 overflow-y-auto max-h-[600px]">
                            {currentSubCategoryData ? (
                                <div>
                                    {currentSubCategoryData.items && currentSubCategoryData.items.length > 0 ? (
                                        <div className="grid grid-cols-4 gap-6">
                                            {currentSubCategoryData.items.map((item) => (
                                                <Link key={item.name} href={item.href} className="group block text-center">
                                                    <div className="aspect-square bg-white dark:bg-slate-800 mb-3 overflow-hidden flex items-center justify-center p-4 border border-slate-100 dark:border-slate-700 transition-shadow group-hover:shadow-md">
                                                        <img 
                                                            src={item.image || PLACEHOLDER_IMAGE} 
                                                            alt={item.name}
                                                            onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }}
                                                            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-600 group-hover:text-brand-primary dark:text-slate-300 line-clamp-2">
                                                        {item.name}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                                            <p className="text-sm">Explora nuestra colección de {currentSubCategoryData.name}</p>
                                            <Button variant="outline" size="sm" className="mt-4" asChild>
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
                <div className="lg:hidden absolute top-0 left-0 w-full h-screen z-50 bg-white dark:bg-black overflow-y-auto">
                     <div className="p-4 flex justify-between items-center border-b">
                        <span className="font-bold">Menú</span>
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                            <X className="h-6 w-6" />
                        </Button>
                     </div>
                     <div className="p-4">
                        <nav className="space-y-4">
                            {navigationData.map((item) => (
                                <div key={item.name} className="border-b border-slate-100 pb-2">
                                    <Link 
                                        href={item.href} 
                                        className="text-sm font-bold uppercase block py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                    {item.subcategories && (
                                        <div className="pl-4 mt-1 space-y-2">
                                            {item.subcategories.map(sub => (
                                                <Link 
                                                    key={sub.name}
                                                    href={sub.href}
                                                    className="block text-xs text-slate-600 py-1"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                     </div>
                </div>
            )}
        </header>
    );
}
