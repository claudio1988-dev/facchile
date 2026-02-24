import { Head, Link } from '@inertiajs/react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle2, Package, ArrowRight, Printer, Wallet, Info, MessageCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
    product_name: string;
    quantity: number;
    unit_price: string; // or number depending on backend cast
    total: string;
}

interface Order {
    order_number: string;
    total: string;
    status: string;
    items: OrderItem[];
    created_at: string;
    metadata: {
        payment_method: string;
        [key: string]: any;
    };
}

interface Props {
    order: Order;
}

import { useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';

export default function Success({ order }: Props) {
    const clearCart = useCartStore(state => state.clearCart);

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <>
            <Head title="Compra Exitosa" />
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
                <Header />

                <main className="pt-[142px] md:pt-[152px] lg:pt-[162px] pb-16">
                    <div className="container py-12 max-w-2xl mx-auto px-4">
                        <Card className="text-center shadow-lg border-green-100">
                            <CardHeader>
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-4">
                                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                                </div>
                                <CardTitle className="text-3xl font-bold text-green-700">¡Gracias por tu compra!</CardTitle>
                                <p className="text-gray-500 mt-2">
                                    Tu pedido <span className="font-bold text-gray-900">#{order.order_number}</span> ha sido recibido correctamente.
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-6 text-left">
                                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <Package className="h-5 w-5 text-gray-500" /> Detalle del Pedido
                                    </h3>
                                    <div className="space-y-3">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-gray-600">{item.quantity}x {item.product_name}</span>
                                                <span className="font-medium">{formatPrice(item.unit_price)}</span>
                                            </div>
                                        ))}
                                        <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                                            <span>Total Productos</span>
                                            <span>{formatPrice(order.total)}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                                            <span>🚚</span>
                                            El costo del despacho se paga al recibir el pedido.
                                        </p>
                                    </div>
                                </div>

                                {order.metadata?.payment_method === 'transfer' && (
                                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900">
                                        <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-4 flex items-center gap-2">
                                            <Wallet className="h-5 w-5" /> Datos para Transferencia
                                        </h3>
                                        <div className="space-y-4 text-sm">
                                            <p className="text-blue-800 dark:text-blue-300 bg-white/50 dark:bg-blue-950/40 p-3 rounded-md border border-blue-100 dark:border-blue-900 flex items-start gap-2">
                                                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                                Por favor, realiza la transferencia con los siguientes datos y envía el comprobante a nuestro email.
                                            </p>
                                            
                                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-blue-100 dark:border-blue-900 pt-4">
                                                <div className="text-blue-700/60 dark:text-blue-400 font-medium uppercase text-[10px] tracking-wider">Titular</div>
                                                <div className="text-blue-900 dark:text-blue-100 font-bold">Fabián Esteban Acuña Campos</div>
                                                
                                                <div className="text-blue-700/60 dark:text-blue-400 font-medium uppercase text-[10px] tracking-wider">RUT</div>
                                                <div className="text-blue-900 dark:text-blue-100 font-bold">17.196.505-5</div>
                                                
                                                <div className="text-blue-700/60 dark:text-blue-400 font-medium uppercase text-[10px] tracking-wider">Banco</div>
                                                <div className="text-blue-900 dark:text-blue-100 font-bold">Mercado Pago</div>
                                                
                                                <div className="text-blue-700/60 dark:text-blue-400 font-medium uppercase text-[10px] tracking-wider">Tipo de Cuenta</div>
                                                <div className="text-blue-900 dark:text-blue-100 font-bold">Cuenta Vista</div>
                                                
                                                <div className="text-blue-700/60 dark:text-blue-400 font-medium uppercase text-[10px] tracking-wider">Nº de Cuenta</div>
                                                <div className="text-blue-900 dark:text-blue-100 font-bold">1004087752</div>
                                                
                                                <div className="text-blue-700/60 dark:text-blue-400 font-medium uppercase text-[10px] tracking-wider">Email para comprobante</div>
                                                <div className="text-blue-900 dark:text-blue-100 font-bold">facpesca@gmail.com</div>
                                            </div>
                                        </div>

                                        {/* WhatsApp Button */}
                                        <a
                                            href={`https://wa.me/56978155169?text=${encodeURIComponent(`Hola! Acabo de realizar una transferencia para el pedido *#${order.order_number}* por un total de *${formatPrice(order.total)}*. Adjunto el comprobante. ¡Gracias!`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-3 w-full mt-4 bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
                                        >
                                            <MessageCircle className="h-5 w-5" />
                                            Informar transferencia por WhatsApp
                                        </a>
                                    </div>
                                )}
                                
                                <div className="text-sm text-center text-gray-500">
                                    Hemos enviado un correo de confirmación a tu dirección de email.
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-center gap-4 pb-8">
                                <Button variant="outline" onClick={() => window.print()}>
                                    <Printer className="mr-2 h-4 w-4" />
                                    Imprimir
                                </Button>
                                <Link href="/catalogo">
                                    <Button className="bg-brand-primary hover:bg-brand-primary/90">
                                        Seguir Comprando <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>
                </main>

                <Footer />
                <WhatsAppFloating />
            </div>
        </>
    );
}
