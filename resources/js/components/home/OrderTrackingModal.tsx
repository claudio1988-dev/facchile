import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Package,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    CreditCard,
    MessageSquare,
    Search,
    AlertCircle,
    ShoppingBag,
    ArrowRight,
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';

interface OrderData {
    found: boolean;
    order_number: string;
    status: string;
    status_label: string;
    payment_status: string;
    payment_status_label: string;
    payment_method: string | null;
    total: string;
    created_at: string;
    carrier: string | null;
    tracking_code: string | null;
    seller_message: string | null;
    items_count: number;
    items: { name: string; quantity: number; price: string }[];
}

interface Props {
    open: boolean;
    onClose: () => void;
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
    };
    return (
        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', styles[status] ?? styles.pending)}>
            {label}
        </span>
    );
}

export default function OrderTrackingModal({ open, onClose }: Props) {
    const [orderNumber, setOrderNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [order, setOrder] = useState<OrderData | null>(null);

    const handleSearch = async () => {
        if (!orderNumber.trim()) return;
        setLoading(true);
        setError(null);
        setOrder(null);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
            const res = await fetch('/api/tracking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ order_number: orderNumber.trim() }),
            });

            const data = await res.json();

            if (!res.ok || !data.found) {
                setError(data.message ?? 'No se encontró el pedido.');
            } else {
                setOrder(data);
            }
        } catch {
            setError('Error de conexión. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOrderNumber('');
        setOrder(null);
        setError(null);
        onClose();
    };

    const currentStepIndex = order ? STATUS_ORDER.indexOf(order.status) : -1;
    const isCancelled = order?.status === 'cancelled';



    const paymentMethodLabel: Record<string, string> = {
        transfer: 'Transferencia Bancaria',
        webpay:   'WebPay / Tarjeta',
        cash:     'Efectivo',
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                    <Truck className="h-5 w-5 text-brand-primary" />
                    Seguimiento de Pedido
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                    Ingresa tu número de pedido para ver el estado actual.
                </DialogDescription>

                {/* Search Input */}
                <div className="flex gap-2 mt-2">
                    <Input
                        placeholder="Ej: FAC-2025-001234"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="flex-1"
                        autoFocus
                    />
                    <Button
                        onClick={handleSearch}
                        disabled={loading || !orderNumber.trim()}
                        className="bg-brand-primary hover:bg-brand-primary/90 shrink-0"
                    >
                        {loading ? (
                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Search className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-400">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        {error}
                    </div>
                )}

                {/* Order Result */}
                {order && (
                    <div className="space-y-4 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">

                        {/* Header Info */}
                        <div className="flex items-start justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <div>
                                <p className="text-xs text-muted-foreground">Pedido</p>
                                <p className="font-bold text-slate-900 dark:text-white">{order.order_number}</p>
                                <p className="text-xs text-muted-foreground mt-1">{order.created_at}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Total</p>
                                <p className="font-black text-brand-primary text-lg">{formatPrice(order.total)}</p>
                                <StatusBadge status={order.status} label={order.status_label} />
                            </div>
                        </div>

                        {/* Progress Steps */}
                        {!isCancelled && (
                            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Estado del Pedido</p>
                                <div className="flex items-center gap-0">
                                    {ORDER_STEPS.map((step, idx) => {
                                        const Icon = step.icon;
                                        const isCompleted = idx <= currentStepIndex;
                                        const isCurrent = idx === currentStepIndex;
                                        return (
                                            <div key={step.key} className="flex items-center flex-1 last:flex-none">
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className={cn(
                                                        'h-8 w-8 rounded-full flex items-center justify-center transition-all',
                                                        isCompleted
                                                            ? 'bg-brand-primary text-white shadow-md'
                                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400',
                                                        isCurrent && 'ring-2 ring-brand-primary ring-offset-2'
                                                    )}>
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <span className={cn(
                                                        'text-[9px] font-medium text-center leading-tight max-w-[50px]',
                                                        isCompleted ? 'text-brand-primary' : 'text-slate-400'
                                                    )}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                                {idx < ORDER_STEPS.length - 1 && (
                                                    <div className={cn(
                                                        'flex-1 h-0.5 mb-5 mx-1 transition-all',
                                                        idx < currentStepIndex ? 'bg-brand-primary' : 'bg-slate-200 dark:bg-slate-700'
                                                    )} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {isCancelled && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                                <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                                <div>
                                    <p className="font-semibold text-red-700 dark:text-red-400 text-sm">Pedido Cancelado</p>
                                    <p className="text-xs text-red-600/70 dark:text-red-500/70">Este pedido fue cancelado. Contáctanos si tienes dudas.</p>
                                </div>
                            </div>
                        )}

                        {/* Payment Info */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pago</p>
                                </div>
                                <StatusBadge status={order.payment_status} label={order.payment_status_label} />
                                {order.payment_method && (
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        {paymentMethodLabel[order.payment_method] ?? order.payment_method}
                                    </p>
                                )}
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Envío</p>
                                </div>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    {order.carrier ?? 'Por definir'}
                                </p>
                                {order.tracking_code && (
                                    <p className="text-[10px] text-brand-primary font-mono mt-1">{order.tracking_code}</p>
                                )}
                            </div>
                        </div>

                        {/* Seller Message */}
                        {order.seller_message && (
                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                                <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">Mensaje del Vendedor</p>
                                </div>
                                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{order.seller_message}</p>
                            </div>
                        )}

                        {/* Items Summary */}
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-3">
                                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Productos ({order.items_count})
                                </p>
                            </div>
                            <div className="space-y-2">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <span className="text-slate-700 dark:text-slate-300 truncate flex-1 mr-2">
                                            {item.quantity}× {item.name}
                                        </span>
                                        <span className="font-semibold text-slate-900 dark:text-white shrink-0">
                                            {formatPrice(Number(item.price) * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Help CTA */}
                        <a
                            href={`https://wa.me/56978155169?text=${encodeURIComponent(`Hola, tengo una consulta sobre mi pedido *${order.order_number}*`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20b858] text-white text-sm font-semibold transition-colors"
                        >
                            <ArrowRight className="h-4 w-4" />
                            Consultar por WhatsApp
                        </a>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
