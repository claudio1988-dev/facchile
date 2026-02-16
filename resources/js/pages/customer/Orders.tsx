import { Head, Link } from '@inertiajs/react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, ChevronRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: number;
    created_at: string;
    items_count: number;
}

interface Props {
    orders: Order[];
}

const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500' },
    processing: { label: 'Procesando', color: 'bg-blue-500' },
    shipped: { label: 'Enviado', color: 'bg-indigo-500' },
    delivered: { label: 'Entregado', color: 'bg-green-500' },
    cancelled: { label: 'Cancelado', color: 'bg-red-500' },
};

export default function Orders({ orders = [] }: Props) {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col">
            <Head title="Mis Pedidos | Facchile Outdoor" />
            <Header />

            <div className="pt-32 lg:pt-44 pb-16 flex-1">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-brand-primary flex items-center gap-1 mb-2">
                             Dashboard
                        </Link>
                        <h1 className="text-3xl font-black uppercase">Mis Pedidos</h1>
                        <p className="text-slate-500">Historial de tus compras realizadas</p>
                    </div>

                    {orders.length === 0 ? (
                        <Card className="p-12 text-center bg-slate-50 dark:bg-slate-900 border-dashed">
                            <Package className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                            <h2 className="text-xl font-bold mb-2">Aún no tienes pedidos</h2>
                            <p className="text-slate-500 mb-6">Tus compras aparecerán aquí una vez que las realices.</p>
                            <Link href="/catalogo">
                                <button className="bg-brand-primary text-white px-8 py-3 rounded-full font-bold hover:bg-action-hover transition-colors">
                                    IR A LA TIENDA
                                </button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-6 md:flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                                            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                                                <Package className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold uppercase tracking-tight">Orden #{order.order_number}</div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    {order.created_at}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 md:gap-8">
                                            <div className="text-right">
                                                <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Estado</div>
                                                <Badge className={statusMap[order.status]?.color || 'bg-slate-500'}>
                                                    {statusMap[order.status]?.label || order.status}
                                                </Badge>
                                            </div>
                                            <div className="text-right min-w-[100px]">
                                                <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Total</div>
                                                <div className="font-black text-brand-primary">${order.total.toLocaleString('es-CL')}</div>
                                            </div>
                                            <Link 
                                                href={`/customer/orders/${order.id}`} 
                                                className="flex items-center gap-1 text-slate-400 hover:text-brand-primary transition-colors text-sm font-bold uppercase"
                                            >
                                                Ver Detalle
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
            <WhatsAppFloating />
        </div>
    );
}
