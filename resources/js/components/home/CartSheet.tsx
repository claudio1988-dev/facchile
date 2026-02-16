import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetDescription } from '@/components/ui/sheet';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/useCartStore';
import { Link } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function CartSheet({ children }: { children: React.ReactNode }) {
    const { items, removeFromCart, updateQuantity, getTotal } = useCartStore();
    const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col sm:max-w-md bg-white dark:bg-[#111110] border-l dark:border-white/10 shadow-2xl">
                <SheetHeader className="px-1 border-b dark:border-white/5 pb-4">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="flex items-center gap-2 text-xl font-black italic tracking-tighter">
                            <div className="p-2 bg-brand-primary/10 rounded-lg">
                                <ShoppingCart className="h-5 w-5 text-brand-primary" />
                            </div>
                            TU CARRITO
                        </SheetTitle>
                        <Badge variant="outline" className="rounded-full px-3 py-1 font-bold bg-slate-50 dark:bg-white/5 border-none">
                            {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                        </Badge>
                    </div>
                </SheetHeader>

                {/* Free Shipping Progress */}
                {items.length > 0 && (
                    <div className="px-1 pt-6 pb-2">
                        {(() => {
                            const shippingThreshold = 100000;
                            const currentTotal = getTotal();
                            const progress = Math.min((currentTotal / shippingThreshold) * 100, 100);
                            const remaining = shippingThreshold - currentTotal;

                            return (
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                        <span className={cn(progress >= 100 ? "text-green-600 dark:text-green-400" : "text-text-muted")}>
                                            {progress >= 100 ? '¡Envío gratis desbloqueado!' : `Te faltan ${formatPrice(remaining)} para envío gratis`}
                                        </span>
                                        <span className="text-brand-primary">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className={cn(
                                                "h-full transition-all duration-1000 ease-out rounded-full",
                                                progress >= 100 ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" : "bg-brand-primary"
                                            )}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto py-6 px-1 custom-scrollbar">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-brand-primary/20 blur-3xl rounded-full scale-150" />
                                <div className="relative rounded-full bg-slate-100 p-8 dark:bg-white/5 border dark:border-white/5">
                                    <ShoppingCart className="h-12 w-12 text-slate-400 dark:text-white/20" />
                                </div>
                            </div>
                            <div className="max-w-[240px]">
                                <h3 className="text-xl font-black tracking-tight text-text-main dark:text-white uppercase italic">Vacío y disponible</h3>
                                <p className="text-sm text-text-muted mt-2">Tu equipo espera por la próxima aventura. ¡Empieza a equiparte!</p>
                            </div>
                            <Button asChild className="mt-4 bg-brand-primary hover:bg-action-hover text-white rounded-full px-8 h-12 font-bold shadow-xl shadow-brand-primary/20 transition-transform active:scale-95">
                                <Link href="/catalogo">VER CATÁLOGO</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="group relative flex gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all border border-transparent hover:border-slate-100 dark:hover:border-white/5">
                                    <div className="h-24 w-24 flex-none overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5 p-1 relative">
                                        <img
                                            src={item.image || '/images/gentepescando.jpeg'}
                                            alt={item.name}
                                            className="h-full w-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => { e.currentTarget.src = '/images/gentepescando.jpeg'; }}
                                        />
                                        {item.is_restricted && (
                                            <span className="absolute top-1 left-1 bg-red-600 text-[8px] font-black text-white px-1.5 py-0.5 rounded uppercase leading-none shadow-lg">18+</span>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="text-[13px] font-bold leading-tight text-text-main dark:text-slate-200 line-clamp-2 uppercase italic tracking-tight">
                                                    {item.name}
                                                </h4>
                                                <button 
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-1 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm font-black text-brand-primary mt-1.5 tracking-tighter">
                                                {formatPrice(item.price)}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100 dark:bg-white/5 border dark:border-white/5">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white dark:bg-white/10 shadow-sm text-slate-500 hover:text-brand-primary active:scale-90 transition-transform"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-6 text-center text-xs font-black">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white dark:bg-white/10 shadow-sm text-slate-500 hover:text-brand-primary active:scale-90 transition-transform"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <span className="text-sm font-black text-text-main dark:text-white tracking-tighter">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="border-t dark:border-white/5 pt-6 pb-6 space-y-4">
                        <div className="space-y-1.5 px-1">
                            <div className="flex items-center justify-between text-xs text-text-muted uppercase font-bold tracking-widest">
                                <span>Total Parcial</span>
                                <span className="text-text-main dark:text-white">{formatPrice(getTotal())}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-black tracking-tighter italic uppercase text-text-main dark:text-white">Total Final</span>
                                <span className="text-2xl font-black tracking-tighter text-brand-primary">{formatPrice(getTotal())}</span>
                            </div>
                        </div>
                        
                        {items.some(i => i.is_restricted) && (
                            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 flex gap-3">
                                <div className="h-4 w-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 animate-pulse">!</div>
                                <p className="text-[11px] font-medium text-red-700 dark:text-red-400">
                                    Contienes artículos con restricción. Se requerirá cédula de identidad al finalizar.
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col gap-3 px-1 pt-2">
                            <Button asChild className="w-full relative overflow-hidden h-14 bg-brand-primary hover:bg-brand-primary/90 text-white shadow-2xl shadow-brand-primary/30 group transition-all rounded-2xl active:scale-[0.98]">
                                <Link href="/checkout" className="flex items-center justify-center gap-3">
                                    <span className="text-lg font-black tracking-tight italic uppercase">Finalizar Compra</span>
                                    <div className="p-1.5 bg-white/20 rounded-lg group-hover:translate-x-1 transition-transform">
                                        <ArrowRight className="h-5 w-5" />
                                    </div>
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </Link>
                            </Button>
                            
                            <Button asChild variant="ghost" className="w-full h-12 font-bold text-text-muted hover:text-text-main dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl">
                                <Link href="/catalogo">VOLVER A LA TIENDA</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
