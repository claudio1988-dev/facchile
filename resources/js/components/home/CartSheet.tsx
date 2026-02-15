import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
            <SheetContent className="flex w-full flex-col sm:max-w-md bg-white dark:bg-[#161615]">
                <SheetHeader className="px-1 border-b pb-4">
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-brand-primary" />
                        Tu Carrito ({itemsCount})
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6 px-1 custom-scrollbar">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
                            <div className="rounded-full bg-slate-100 p-6 dark:bg-slate-800">
                                <ShoppingCart className="h-10 w-10 text-slate-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-text-main dark:text-white">El carrito está vacío</h3>
                                <p className="text-sm text-text-muted mt-1">¡Explora nuestra tienda y encuentra tu próximo equipo!</p>
                            </div>
                            <Button asChild variant="outline" className="mt-4">
                                <Link href="/catalogo">Explorar Catálogo</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="h-20 w-20 flex-none overflow-hidden rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                                        <img
                                            src={item.image || '/images/imagenesdemo/1.avif'}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-sm font-bold text-text-main dark:text-slate-200 line-clamp-1">
                                                    {item.name}
                                                </h4>
                                                <button 
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm font-bold text-brand-primary mt-1">
                                                {formatPrice(item.price)}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center border rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-2 py-1 text-slate-500 hover:text-brand-primary"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-2 py-1 text-slate-500 hover:text-brand-primary"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <span className="text-sm font-black text-text-main dark:text-white">
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
                    <div className="border-t pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-base font-semibold text-text-main dark:text-white">Subtotal</span>
                            <span className="text-xl font-black text-brand-primary">{formatPrice(getTotal())}</span>
                        </div>
                        <p className="text-xs text-text-muted">Artículos con restricción de edad requieren validación en el checkout.</p>
                        <SheetFooter className="flex-col sm:flex-col gap-2">
                            <Button asChild className="w-full bg-action-buy hover:bg-action-hover h-12 text-base font-bold text-white shadow-lg">
                                <Link href="/checkout">
                                    Ir a Pagar
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/catalogo">Seguir Comprando</Link>
                            </Button>
                        </SheetFooter>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
