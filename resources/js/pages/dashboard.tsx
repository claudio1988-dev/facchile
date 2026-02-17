import { Head, usePage, Link } from '@inertiajs/react';
import type { SharedData } from '@/types';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Package, MapPin, User, Heart, LogOut } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function Dashboard(props: { recentOrders?: any[] }) {
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

            <div className="pt-[142px] md:pt-[152px] lg:pt-[162px] flex-1 bg-slate-50/50 dark:bg-[#0a0a0a]">
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-brand-primary rounded-full" />
                                    Mi Cuenta
                                </h1>
                                <p className="text-xs text-slate-500 mt-1">
                                    Bienvenido de vuelta, <span className="font-semibold text-brand-primary">{auth.user.name}</span>
                                </p>
                            </div>
                            <Link 
                                href="/logout" 
                                method="post" 
                                as="button"
                                className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-red-500 flex items-center gap-1.5 transition-colors"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                Cerrar Sesión
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {menuItems.map((item) => (
                            <Link key={item.title} href={item.href} className="group">
                                <Card className="hover:border-brand-primary/50 hover:shadow-md transition-all duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate uppercase tracking-tight">
                                                    {item.title}
                                                </h3>
                                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Secciones adicionales para darle utilidad de dashboard real */}
                        <div className="lg:col-span-2">
                            <Card className="border-slate-200 dark:border-slate-800 h-full">
                                <CardHeader className="py-4 px-6 border-b border-slate-100 dark:border-slate-800">
                                    <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Actividad Reciente</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {props.recentOrders && props.recentOrders.length > 0 ? (
                                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {props.recentOrders.map((order) => (
                                                <div key={order.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">#{order.order_number}</p>
                                                        <p className="text-xs text-slate-500">{order.created_at} • {order.items_count} items</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                            ${parseFloat(order.total).toLocaleString('es-CL')}
                                                        </p>
                                                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                                                            {order.status}
                                                        </p>
                                                    </div>
                                                    <Button variant="ghost" size="sm" asChild className="ml-2 h-8 w-8 p-0">
                                                        <Link href={`/customer/orders/${order.id}`}>
                                                            <Package className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ))}
                                            <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 text-center">
                                                <Link href="/customer/orders" className="text-xs font-bold text-brand-primary hover:underline">
                                                    Ver todos mis pedidos
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center p-6">
                                            <Package className="w-10 h-10 text-slate-200 mb-2" />
                                            <p className="text-xs text-slate-500">No hay pedidos recientes para mostrar.</p>
                                            <Link href="/catalogo" className="mt-4 text-xs font-bold text-brand-primary hover:underline">Ir a comprar ahora</Link>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                            <Card className="border-slate-200 dark:border-slate-800 h-full">
                                <CardHeader className="py-4 px-6 border-b border-slate-100 dark:border-slate-800">
                                    <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Soporte Directo</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <p className="text-xs text-slate-500 leading-relaxed">¿Necesitas ayuda con un pedido o tienes dudas técnicas?</p>
                                    <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-tighter h-10 border-slate-200 dark:border-slate-800" asChild>
                                        <Link href="/contacto">Contactar Soporte</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <WhatsAppFloating />
        </div>
    );
}
