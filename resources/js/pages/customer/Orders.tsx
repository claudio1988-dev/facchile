import { Head, Link } from '@inertiajs/react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, ChevronRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, formatPrice } from '@/lib/utils';

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

            <div className="pt-[142px] md:pt-[152px] lg:pt-[162px] flex-1 bg-slate-50/50 dark:bg-[#0a0a0a]">
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                        <Link href="/dashboard" className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 hover:text-brand-primary transition-colors mb-1.5 block">
                            ← Dashboard
                        </Link>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-brand-primary rounded-full" />
                            Mis Pedidos
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Historial de tus compras realizadas
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

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
                        <div className="grid gap-3">
                            {orders.map((order) => (
                                <Card key={order.id} className="overflow-hidden hover:shadow-sm border-slate-200 dark:border-slate-800 transition-all duration-300">
                                    <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                                                <Package className="w-4 h-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold uppercase tracking-tight text-slate-900 dark:text-white">Orden #{order.order_number}</div>
                                                <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 mt-0.5">
                                                    <Clock className="w-3 h-3" />
                                                    {order.created_at}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-6 md:gap-12 flex-1">
                                            <div className="text-left md:text-right">
                                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-1">Estado</span>
                                                <Badge variant="outline" className={cn("text-[10px] h-5 font-bold uppercase py-0", statusMap[order.status]?.color?.replace('bg-', 'text-'))}>
                                                    {statusMap[order.status]?.label || order.status}
                                                </Badge>
                                            </div>
                                            <div className="text-right min-w-[80px]">
                                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-1">Total</span>
                                                <div className="text-sm font-bold text-brand-primary dark:text-white">{formatPrice(order.total)}</div>
                                            </div>
                                            <Link 
                                                href={`/customer/orders/${order.id}`} 
                                                className="text-[10px] font-bold uppercase text-slate-400 hover:text-brand-primary transition-colors flex items-center gap-1"
                                            >
                                                Detalles
                                                <ChevronRight className="w-3 h-3" />
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
