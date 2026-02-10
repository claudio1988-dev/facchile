import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, Search, User, Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
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

const navigation = [
    { name: 'Rifles y Aire', href: '/categoria/rifles-aire-comprimido' },
    { name: 'Pesca Deportiva', href: '/categoria/pesca-deportiva' },
    { name: 'Camping & Outdoor', href: '/categoria/camping-outdoor' },
    { name: 'Caza', href: '/categoria/caza-supervivencia' },
    { name: 'Ofertas', href: '/ofertas', highlight: true },
    { name: 'Contacto', href: '/contacto' },
];

export default function Header() {
    const { auth, url } = usePage<SharedData>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const isHomePage = url === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // The header should only be transparent if we are on the home page and haven't scrolled yet
    const shouldBeTransparent = isHomePage && !isScrolled;

    return (
        <header 
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out",
                shouldBeTransparent 
                    ? "bg-transparent h-40 pt-6"
                    : "bg-white/95 backdrop-blur-md shadow-sm h-20 dark:bg-[#161615]/95"
            )}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex h-full items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-8 relative">
                        <Link href="/" className="flex items-center gap-2 group relative z-10">
                            <img 
                                src="/logo.png" 
                                alt="Facchile Logo" 
                                className={cn(
                                    "w-auto transition-all duration-400 ease-out",
                                    shouldBeTransparent 
                                        ? "h-36 brightness-0 invert"
                                        : "h-18 drop-shadow-sm"
                                )}
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors",
                                        shouldBeTransparent 
                                            ? item.highlight
                                                ? "text-action-buy hover:text-action-hover font-bold"
                                                : "text-white hover:text-white/80 drop-shadow-sm"
                                            : item.highlight 
                                                ? "text-action-buy hover:text-action-hover font-bold"
                                                : "text-brand-primary hover:text-action-buy dark:text-slate-300 dark:hover:text-white"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Search Bar - Hidden on small mobile */}
                    <div className="hidden flex-1 max-w-sm ml-8 lg:block">
                        <div className="relative">
                            <Search className={cn(
                                "absolute left-2.5 top-2.5 h-4 w-4",
                                shouldBeTransparent ? "text-white/70" : "text-slate-400"
                            )} />
                            <Input
                                type="search"
                                placeholder="Buscar productos..."
                                className={cn(
                                    "w-full transition-all duration-300 rounded-full",
                                    shouldBeTransparent 
                                        ? "bg-white/10 pl-9 text-white placeholder:text-white/60 border-white/20 focus:bg-white/20 backdrop-blur-sm"
                                        : "bg-bg-light pl-9 focus:bg-white dark:bg-slate-900 border-slate-200"
                                )}
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <ModeToggle className={shouldBeTransparent ? "text-white border-white/20 hover:bg-white/10" : ""} />
                        
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn(
                                "hidden sm:flex transition-colors",
                                shouldBeTransparent 
                                    ? "text-white hover:bg-white/10"
                                    : "text-brand-primary hover:text-action-buy dark:text-slate-300"
                            )}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span className="sr-only">Carrito</span>
                        </Button>

                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className={cn(
                                            "rounded-full transition-colors",
                                            shouldBeTransparent && "text-white hover:bg-white/10"
                                        )}
                                    >
                                        <User className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">Perfil</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600 focus:text-red-700">
                                        <Link href="/logout" method="post" as="button" className="flex w-full items-center gap-2">
                                            <LogOut className="h-4 w-4" />
                                            Cerrar Sesión
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                <Button 
                                    asChild 
                                    variant="ghost" 
                                    size="sm" 
                                    className={cn(
                                        "transition-colors",
                                        shouldBeTransparent 
                                            ? "text-white hover:bg-white/10"
                                            : "text-text-main hover:text-brand-primary"
                                    )}
                                >
                                    <Link href="/login">Ingresar</Link>
                                </Button>
                                <Button asChild size="sm" className="bg-action-buy hover:bg-action-hover text-white shadow-lg">
                                    <Link href="/register">Registrarse</Link>
                                </Button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={shouldBeTransparent ? "text-white hover:bg-white/10" : ""}
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t dark:border-slate-800 bg-white dark:bg-[#161615] animate-in slide-in-from-top duration-300">
                    <div className="space-y-1 px-4 py-3 sm:px-3">
                         <div className="mb-4 relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                type="search"
                                placeholder="Buscar..."
                                className="w-full bg-slate-100 pl-9 dark:bg-slate-900 border-slate-200"
                            />
                        </div>
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "block rounded-md px-3 py-2 text-base font-medium transition-colors",
                                    item.highlight 
                                        ? "text-red-600 bg-red-50 dark:bg-red-950/30"
                                        : "text-text-main hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    {!auth.user && (
                        <div className="border-t border-slate-200 pt-4 pb-4 dark:border-slate-800">
                           <div className="flex items-center px-5 gap-3">
                                <Button asChild variant="outline" className="w-full border-slate-200">
                                    <Link href="/login">Ingresar</Link>
                                </Button>
                                <Button asChild className="w-full bg-action-buy hover:bg-action-hover">
                                    <Link href="/register">Registrarse</Link>
                                </Button>
                           </div>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
