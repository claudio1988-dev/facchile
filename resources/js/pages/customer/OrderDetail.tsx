import { Head, Link } from '@inertiajs/react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowLeft, Package, Truck, CreditCard, Calendar, Hash, MapPin, Wallet, Info, CheckCircle2, Clock, XCircle, MessageSquare, ArrowRight } from 'lucide-react';

interface OrderItem {
    id: number;
    product_name: string;
    sku: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    main_image_url: string | null;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: number;
    subtotal: number;
    tax: number;
    shipping_cost: number;
    created_at: string;
    payment_status: string;
    metadata: {
        payment_method: string;
        [key: string]: any;
    };
    items: OrderItem[];
    shipping_address: {
        line1: string;
        line2: string | null;
        commune: string;
        region: string;
    };
    carrier_name: string | null;
}

const ORDER_STEPS = [
    { key: 'pending',    label: 'Recibido',       icon: Clock },
    { key: 'confirmed',  label: 'Confirmado',      icon: CheckCircle2 },
    { key: 'processing', label: 'En preparación',  icon: Package },
    { key: 'shipped',    label: 'Enviado',          icon: Truck },
    { key: 'delivered',  label: 'Entregado',        icon: CheckCircle2 },
];

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

function StatusBadge({ status, label }: { status: string; label: string }) {
    const styles: Record<string, string> = {
        pending:    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
        confirmed:  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        shipped:    'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
        delivered:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        cancelled:  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        paid:       'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        failed:     'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        refunded:   'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        verifying:  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    };
     const defaultLabel = statusMap[status]?.label || status;
    return (
        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', styles[status] ?? styles.pending)}>
            {label || defaultLabel}
        </span>
    );
}

interface Props {
    order: Order;
}

const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500 hover:bg-yellow-600' },
    processing: { label: 'Procesando', color: 'bg-blue-500 hover:bg-blue-600' },
    shipped: { label: 'Enviado', color: 'bg-indigo-500 hover:bg-indigo-600' },
    delivered: { label: 'Entregado', color: 'bg-green-500 hover:bg-green-600' },
    cancelled: { label: 'Cancelado', color: 'bg-red-500 hover:bg-red-600' },
};

const paymentStatusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'text-yellow-600 bg-yellow-50' },
    verifying: { label: 'En verificación', color: 'text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300' },
    paid: { label: 'Pagado', color: 'text-green-600 bg-green-50' },
    failed: { label: 'Fallido', color: 'text-red-600 bg-red-50' },
    refunded: { label: 'Reembolsado', color: 'text-gray-600 bg-gray-50' },
};

export default function OrderDetail({ order }: Props) {
    const currentStepIndex = STATUS_ORDER.indexOf(order.status);
    const isCancelled = order.status === 'cancelled';

    // If payment is transfer + pending → show as "En verificación"
    const isTransferPending = order.metadata?.payment_method === 'transfer' && order.payment_status === 'pending';
    const effectivePaymentStatus = isTransferPending ? 'verifying' : order.payment_status;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex flex-col">
            <Head title={`Pedido #${order.order_number} | Facchile Outdoor`} />
            <Header />

            <div className="pt-[142px] md:pt-[152px] lg:pt-[162px] flex-1 bg-slate-50/50 dark:bg-[#0a0a0a]">
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
                        <Link 
                            href="/customer/orders" 
                            className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 hover:text-brand-primary transition-colors mb-2 block"
                        >
                            ← Volver a pedidos
                        </Link>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-brand-primary rounded-full" />
                                        Orden #{order.order_number}
                                    </h1>
                                    <StatusBadge status={order.status} label={statusMap[order.status]?.label} />
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-medium text-slate-500 mt-1">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {order.created_at}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CreditCard className="w-3 h-3" />
                                        <StatusBadge status={effectivePaymentStatus} label={paymentStatusMap[effectivePaymentStatus]?.label} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50 transition-colors">
                                    Boleta
                                </button>
                                {order.status === 'pending' && (
                                    <Link href={`/webpay/pay/${order.id}`}>
                                        <button className="bg-brand-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-brand-secondary transition-colors">
                                            Pagar
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">

                    {/* Transfer pending banner — full width, very visible */}
                    {isTransferPending && (
                        <div className="mb-6 flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 shadow-sm">
                            <Clock className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-amber-900 dark:text-amber-200 text-sm mb-0.5">
                                    Transferencia en verificación
                                </p>
                                <p className="text-sm text-amber-800 dark:text-amber-300">
                                    Tu pago está siendo verificado por nuestro equipo. Te notificaremos cuando se confirme y tu pedido sea procesado.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Order Items */}
                        <div className="md:col-span-2 space-y-6">

                            {/* Progress Stepper */}
                            {!isCancelled && (
                                <Card className="border-none shadow-sm overflow-hidden">
                                     <CardContent className="p-4 sm:p-6">
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 sm:mb-6">Estado del Pedido</p>
                                        <div className="relative">
                                            <div className="flex items-center gap-0 overflow-x-auto pb-2 scrollbar-hide sm:overflow-visible sm:pb-0">
                                                {ORDER_STEPS.map((step, idx) => {
                                                    const Icon = step.icon;
                                                    const isCompleted = idx <= currentStepIndex;
                                                    const isCurrent = idx === currentStepIndex;
                                                    return (
                                                        <div key={step.key} className="flex items-center flex-1 min-w-[60px] last:flex-none last:min-w-0">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <div className={cn(
                                                                    'h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-all shrink-0',
                                                                    isCompleted
                                                                        ? 'bg-brand-primary text-white shadow-md'
                                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400',
                                                                    isCurrent && 'ring-2 sm:ring-4 ring-brand-primary/20 ring-offset-2 dark:ring-offset-slate-900'
                                                                )}>
                                                                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                                                </div>
                                                                <span className={cn(
                                                                    'text-[9px] sm:text-xs font-medium text-center leading-tight max-w-[70px]',
                                                                    isCompleted ? 'text-brand-primary font-bold' : 'text-slate-400'
                                                                )}>
                                                                    {step.label}
                                                                </span>
                                                            </div>
                                                            {idx < ORDER_STEPS.length - 1 && (
                                                                <div className={cn(
                                                                    'flex-1 h-0.5 sm:h-1 mb-6 mx-1 sm:mx-2 transition-all rounded-full min-w-[20px]',
                                                                    idx < currentStepIndex ? 'bg-brand-primary' : 'bg-slate-100 dark:bg-slate-800'
                                                                )} />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                     </CardContent>
                                </Card>
                            )}

                            {isCancelled && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                                    <XCircle className="h-6 w-6 text-red-500 shrink-0" />
                                    <div>
                                        <p className="font-bold text-red-800 dark:text-red-400">Pedido Cancelado</p>
                                        <p className="text-sm text-red-600/80 dark:text-red-500/70">Este pedido ha sido cancelado. Si tienes dudas, contáctanos.</p>
                                    </div>
                                </div>
                            )}

                            {/* Seller Message */}
                            {order.metadata?.seller_message && (
                                <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center gap-2 mb-3">
                                        <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <p className="font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider text-sm">Mensaje del Vendedor</p>
                                    </div>
                                    <p className="text-blue-800 dark:text-blue-200 leading-relaxed text-sm md:text-base">
                                        {order.metadata.seller_message}
                                    </p>
                                </div>
                            )}

                            <Card className="border-none shadow-sm overflow-hidden">
                                <CardHeader className="bg-white dark:bg-slate-900 border-b dark:border-slate-800">
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <Package className="w-5 h-5 text-brand-primary" />
                                        Productos ({order.items.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="p-4 flex gap-4 bg-white dark:bg-slate-900">
                                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-none">
                                                    <img 
                                                        src={item.main_image_url || '/images/imagenesdemo/1.avif'} 
                                                        alt={item.product_name} 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.currentTarget.src = "/images/imagenesdemo/1.avif"; }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-tight mb-1">
                                                        {item.product_name}
                                                    </h4>
                                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">SKU: {item.sku}</p>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-xs text-slate-500">Cant: {item.quantity}</p>
                                                        <p className="font-bold text-brand-primary">{formatPrice(item.subtotal)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Shipping Info */}
                                <Card className="border-none shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                            <Truck className="w-4 h-4 text-brand-primary" />
                                            Envío
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm space-y-3">
                                        {order.carrier_name && (
                                            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Transportista</p>
                                                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    {order.carrier_name}
                                                    {order.metadata?.tracking_code && (
                                                        <Badge variant="secondary" className="font-mono text-[10px]">
                                                            {order.metadata.tracking_code}
                                                        </Badge>
                                                    )}
                                                </p>
                                                {order.metadata?.tracking_number && (
                                                     <div className="mt-1">
                                                         <p className="text-[10px] text-slate-400">Tracking Number:</p>
                                                         <p className="font-mono text-xs font-bold text-brand-primary">{order.metadata.tracking_number}</p>
                                                     </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <MapPin className="w-4 h-4 text-slate-400 flex-none mt-0.5" />
                                            <div>
                                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Dirección de entrega</p>
                                                <p className="font-bold">{order.shipping_address.line1}</p>
                                                {order.shipping_address.line2 && <p className="text-slate-500">{order.shipping_address.line2}</p>}
                                                <p className="text-slate-500">{order.shipping_address.commune}, {order.shipping_address.region}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Payment Method Placeholder */}
                                <Card className="border-none shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-brand-primary" />
                                            Pago
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${paymentStatusMap[effectivePaymentStatus]?.color ?? paymentStatusMap.pending.color}`}>
                                                {paymentStatusMap[effectivePaymentStatus]?.label ?? 'Pendiente'}
                                            </span>
                                        </div>
                                        <p className="text-slate-500">
                                            {order.metadata?.payment_method === 'transfer'
                                                ? 'Transacción vía Transferencia Bancaria'
                                                : 'Transacción procesada vía Webpay Plus'}
                                        </p>
                                        {isTransferPending && (
                                            <div className="mt-3 flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                                                <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                                                    Tu transferencia está siendo verificada por nuestro equipo. Te notificaremos cuando se confirme.
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {order.metadata?.payment_method === 'transfer' && order.payment_status === 'pending' && (
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 dark:bg-blue-900/10 dark:border-blue-800">
                                        <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2 text-xs uppercase tracking-wider">
                                            <Wallet className="h-4 w-4" /> Datos para Transferencia
                                        </h3>
                                        <div className="space-y-3 text-[11px]">
                                            <div className="grid grid-cols-2 gap-y-2 border-t border-blue-100 dark:border-blue-800 pt-3">
                                                <div className="text-blue-700/60 dark:text-blue-400 font-medium">Titular</div>
                                                <div className="text-blue-900 dark:text-blue-100 font-bold">Fabián Esteban Acuña Campos</div>
                                                
                                                <div className="text-blue-700/60 dark:text-blue-400 font-medium">RUT</div>
                                                <div className="text-blue-900 dark:text-blue-100 font-bold">17.196.505-5</div>
                                                
                                                <div className="text-blue-700/60 dark:text-blue-400 font-medium">Banco</div>
                                                <div className="text-blue-900 dark:text-blue-100 font-bold">Mercado Pago</div>
                                                
                                                <div className="text-blue-700/60 dark:text-blue-400 font-medium">Cuenta</div>
                                                <div className="text-blue-900 dark:text-blue-100 font-bold">Vista / 1004087752</div>
                                                
                                                <div className="text-blue-700/60 dark:text-blue-400 font-medium">Email</div>
                                                <div className="text-blue-900 dark:text-blue-100 font-bold">facpesca@gmail.com</div>
                                            </div>
                                            <p className="bg-blue-100/50 dark:bg-blue-900/30 p-2 rounded text-blue-800 dark:text-blue-300 flex gap-2">
                                                <Info className="h-3 w-3 shrink-0 mt-0.5" />
                                                Envía el comprobante a nuestro email para procesar tu pedido.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="space-y-6">
                            <Card className="border-none shadow-md bg-white dark:bg-slate-900 overflow-hidden">
                                <div className="bg-brand-primary h-1 w-full" />
                                <CardHeader>
                                    <CardTitle className="text-lg font-black uppercase">Resumen</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Subtotal</span>
                                        <span className="font-medium">{formatPrice(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">IVA (19%)</span>
                                        <span className="font-medium">{formatPrice(order.tax)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Envío</span>
                                        <span className="font-medium text-green-600">{order.shipping_cost === 0 ? 'Gratis' : formatPrice(order.shipping_cost)}</span>
                                    </div>
                                    <div className="pt-4 border-t dark:border-slate-800 flex justify-between items-baseline">
                                        <span className="text-slate-900 dark:text-white font-bold">TOTAL</span>
                                        <span className="text-2xl font-black text-brand-primary">{formatPrice(order.total)}</span>
                                    </div>
                                    
                                    <div className="mt-6 pt-6 border-t dark:border-slate-800 text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
                                         ID de transacción: {order.id.toString().padStart(8, '0')}
                                    </div>
                                </CardContent>
                            </Card>
                            
                            {/* Support Banner */}
                            <div className="p-6 rounded-xl bg-slate-900 text-white shadow-xl relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
                                <h4 className="font-bold mb-2 relative z-10">¿Necesitas ayuda?</h4>
                                <p className="text-xs text-slate-400 mb-4 relative z-10">Si tienes dudas sobre tu pedido, contáctanos vía WhatsApp.</p>
                                <a 
                                    href="https://wa.me/56912345678" 
                                    target="_blank" 
                                    className="inline-block bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors relative z-10"
                                >
                                    Contactar Soporte
                                </a>
                            </div>

                            {/* WhatsApp Action */}
                            <a
                                href={`https://wa.me/56978155169?text=${encodeURIComponent(`Hola, tengo una consulta sobre mi pedido *${order.order_number}*`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20b858] text-white text-sm font-bold text-center transition-colors shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                            >
                                <ArrowRight className="h-4 w-4" />
                                Consultar por WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <WhatsAppFloating />
        </div>
    );
}
