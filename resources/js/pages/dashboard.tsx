import { Head, usePage, Link } from '@inertiajs/react';
import type { SharedData } from '@/types';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Package, MapPin, User, Heart, LogOut } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;

    const menuItems = [
        { title: 'Mis Pedidos', icon: Package, href: '/customer/orders', description: 'Revisa el estado de tus compras' },
        { title: 'Direcciones', icon: MapPin, href: '/customer/addresses', description: 'Gestiona tus direcciones de envío' },
        { title: 'Datos Personales', icon: User, href: '/settings/profile', description: 'Actualiza tu información de contacto' },
        { title: 'Favoritos', icon: Heart, href: '/customer/favorites', description: 'Tus productos guardados' },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col">
            <Head title="Mi Cuenta | Facchile Outdoor" />
            
            <Header />

            <div className="pt-[142px] md:pt-[152px] lg:pt-[162px] flex-1">
                <div className="bg-[#f4f4f4] py-8 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 mb-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl font-black uppercase text-slate-900 dark:text-white tracking-tight mb-2">
                            Hola, {auth.user.name}
                        </h1>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                            Bienvenido a tu panel de cliente
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {menuItems.map((item) => (
                            <Link key={item.title} href={item.href} className="block group">
                                <Card className="h-full hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                    <CardHeader className="text-center">
                                        <div className="mx-auto bg-slate-100 dark:bg-slate-800 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                            <item.icon className="w-8 h-8" />
                                        </div>
                                        <CardTitle className="uppercase text-sm font-bold">{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center">
                                        <CardDescription>{item.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                         <Link 
                            href="/logout" 
                            method="post" 
                            as="button"
                            className={cn(buttonVariants({ variant: "destructive" }), "gap-2")}
                        >
                            <LogOut className="w-4 h-4" />
                            Cerrar Sesión
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
            <WhatsAppFloating />
        </div>
    );
}
