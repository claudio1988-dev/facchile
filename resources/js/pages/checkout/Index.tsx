import { Head, Link, router } from '@inertiajs/react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    ShoppingCart, 
    ShieldAlert, 
    Trash2, 
    Plus, 
    Minus, 
    CreditCard, 
    MapPin, 
    User as UserIcon,
    ChevronRight,
    ChevronLeft,
    Wallet,
    CheckCircle2
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import checkout from '@/routes/checkout';

interface Commune {
    id: number;
    name: string;
}

interface Region {
    id: number;
    name: string;
    communes: Commune[];
}

interface Props {
    isVerified: boolean;
    customer: {
        name: string;
        email: string;
        rut: string;
        birth_date: string;
        phone?: string;
        addresses?: {
            id: number;
            address_line1: string;
            address_line2: string | null;
            region_id?: number | null;
            commune_id?: number | null;
            region_name: string;
            commune_name: string;
        }[];
    } | null;
    regions: Region[];
}

type CheckoutStep = 'cart' | 'shipping' | 'payment';

export default function Index({ isVerified, customer, regions }: Props) {
    const { items, getTotal, hasRestrictedItems, removeFromCart, updateQuantity, clearCart } = useCartStore();
    const [step, setStep] = useState<CheckoutStep>('cart');
    const [processing, setProcessing] = useState(false);
    
    // Form States
    const [formData, setFormData] = useState({
        first_name: customer?.name.split(' ')[0] || '',
        last_name: customer?.name.split(' ').slice(1).join(' ') || '',
        email: customer?.email || '',
        rut: customer?.rut || '',
        phone: customer?.phone || '',
        address_line1: '',
        address_line2: '',
        region_id: '',
        commune_id: '',
        payment_method: 'webpay' as 'webpay' | 'transfer'
    });

    const communes = useMemo(() => {
        if (!formData.region_id) return [];
        const region = regions.find(r => r.id.toString() === formData.region_id);
        return region?.communes || [];
    }, [formData.region_id, regions]);

    // Check if cart has restricted items
    const restrictedItemsPresent = hasRestrictedItems();
    // Logic to determine if user can checkout
    const canContinue = items.length > 0 && (!restrictedItemsPresent || (restrictedItemsPresent && isVerified));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'region_id') newState.commune_id = ''; // Reset commune on region change
            return newState;
        });
    };

    const isStepValid = () => {
        if (step === 'cart') return canContinue;
        if (step === 'shipping') {
            return (
                formData.first_name && 
                formData.last_name && 
                formData.email && 
                formData.address_line1 && 
                formData.region_id && 
                formData.commune_id &&
                formData.phone
            );
        }
        return true;
    };

    const handleCheckout = () => {
        setProcessing(true);

        const payload = {
            items: items.map(item => ({
                id: item.id,
                quantity: item.quantity
            })),
            customer: {
               first_name: formData.first_name,
               last_name: formData.last_name,
               email: formData.email,
               rut: formData.rut,
               phone: formData.phone
            },
            shipping_address: {
                address_line1: formData.address_line1,
                address_line2: formData.address_line2,
                region_id: formData.region_id,
                commune_id: formData.commune_id
            },
            payment_method: formData.payment_method
        };

        router.post(checkout.process.url(), payload, {
            onSuccess: () => {
                clearCart();
            },
            onFinish: () => setProcessing(false),
            onError: (errors) => {
                console.error(errors);
                setProcessing(false);
            }
        });
    };

    const total = getTotal();

    return (
        <>
            <Head title="Finalizar Compra" />
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
                <Header />

                <main className="pt-[142px] md:pt-[152px] lg:pt-[162px] pb-16">
                    <div className="container py-8 max-w-5xl mx-auto px-4">
                        {/* Stepper Header */}
                        <div className="flex items-center justify-center mb-12">
                            <div className="flex items-center w-full max-w-2xl">
                                {/* Step 1 */}
                                <div className="flex flex-col items-center flex-1 relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                        step === 'cart' ? 'bg-brand-primary border-brand-primary text-white' : 'bg-muted border-muted text-muted-foreground'
                                    } ${['shipping', 'payment'].includes(step) ? 'bg-green-600 border-green-600 text-white' : ''}`}>
                                        {['shipping', 'payment'].includes(step) ? <CheckCircle2 className="size-6" /> : <ShoppingCart className="size-5" />}
                                    </div>
                                    <span className={cn("text-xs font-bold mt-2 uppercase tracking-tighter", step === 'cart' ? 'text-brand-primary' : 'text-slate-400')}>Carrito</span>
                                </div>
                                
                                <div className={`h-1 flex-1 ${['shipping', 'payment'].includes(step) ? 'bg-green-600' : 'bg-muted'}`} />

                                {/* Step 2 */}
                                <div className="flex flex-col items-center flex-1 relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                        step === 'shipping' ? 'bg-brand-primary border-brand-primary text-white' : 'bg-muted border-muted text-muted-foreground'
                                    } ${step === 'payment' ? 'bg-green-600 border-green-600 text-white' : ''}`}>
                                        {step === 'payment' ? <CheckCircle2 className="size-6" /> : <MapPin className="size-5" />}
                                    </div>
                                    <span className={cn("text-xs font-bold mt-2 uppercase tracking-tighter", step === 'shipping' ? 'text-brand-primary' : (step === 'payment' ? 'text-green-600' : 'text-slate-400'))}>Envío</span>
                                </div>

                                <div className={`h-1 flex-1 ${step === 'payment' ? 'bg-green-600' : 'bg-muted'}`} />

                                {/* Step 3 */}
                                <div className="flex flex-col items-center flex-1 relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                        step === 'payment' ? 'bg-brand-primary border-brand-primary text-white' : 'bg-muted border-muted text-muted-foreground'
                                    }`}>
                                        <CreditCard className="size-5" />
                                    </div>
                                    <span className={cn("text-xs font-bold mt-2 uppercase tracking-tighter", step === 'payment' ? 'text-brand-primary' : 'text-slate-400')}>Pago</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Left Column: Forms */}
                            <div className="lg:col-span-2 space-y-6">
                                {step === 'cart' && (
                                    <Card className="border-slate-200 dark:border-slate-800">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-brand-primary">
                                                <ShoppingCart className="size-5" />
                                                Tu Pedido
                                            </CardTitle>
                                            <CardDescription>Revisa los productos en tu carrito antes de continuar.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            {items.length === 0 ? (
                                                <div className="p-12 text-center">
                                                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                                    <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Tu carrito está vacío</h2>
                                                    <Link href="/catalogo">
                                                        <Button className="mt-4 bg-brand-primary hover:bg-brand-secondary">Ir al Catálogo</Button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="divide-y text-text-main dark:text-white border-t border-slate-100 dark:border-slate-800">
                                                    {items.map((item) => (
                                                        <div key={item.id} className="flex gap-4 p-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                                                                <img 
                                                                    src={item.image || '/images/gentepescando.jpeg'} 
                                                                    alt={item.name} 
                                                                    className="h-full w-full object-cover mix-blend-multiply dark:mix-blend-normal"
                                                                    onError={(e) => { e.currentTarget.src = '/images/gentepescando.jpeg'; }}
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex justify-between">
                                                                    <h4 className="font-bold text-sm leading-tight line-clamp-2">{item.name}</h4>
                                                                    <p className="font-black text-brand-primary dark:text-white">${Math.round(item.price * item.quantity).toLocaleString('es-CL')}</p>
                                                                </div>
                                                                <div className="flex items-center justify-between mt-2">
                                                                    <div className="flex items-center gap-2 border rounded-full h-8 px-1 bg-white dark:bg-slate-950">
                                                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                                            <Minus className="h-3 w-3" />
                                                                        </Button>
                                                                        <span className="text-sm px-2 w-6 text-center font-bold">{item.quantity}</span>
                                                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                                            <Plus className="h-3 w-3" />
                                                                        </Button>
                                                                    </div>
                                                                    <button 
                                                                        className="text-xs font-bold uppercase text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                                                                        onClick={() => removeFromCart(item.id)}
                                                                    >
                                                                        <Trash2 className="size-3.5" /> Eliminar
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                        {items.length > 0 && (
                                            <CardFooter className="justify-between bg-slate-50 dark:bg-slate-900/50 py-4 border-t border-slate-100 dark:border-slate-800 rounded-b-lg">
                                                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Subtotal Carrito</div>
                                                <div className="text-lg font-black text-brand-primary dark:text-white">${total.toLocaleString('es-CL')}</div>
                                            </CardFooter>
                                        )}
                                    </Card>
                                )}

                                {step === 'shipping' && (
                                    <div className="space-y-6">
                                        {/* Saved Addresses Selector */}
                                        {customer && customer.addresses && customer.addresses.length > 0 && (
                                            <Card className="border-slate-200 dark:border-slate-800">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                                        <MapPin className="size-4 text-brand-primary" />
                                                        Mis Direcciones Guardadas
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="grid gap-3 sm:grid-cols-2">
                                                    {customer.addresses.map((addr) => (
                                                        <div 
                                                            key={addr.id}
                                                            className={cn(
                                                                "border rounded-lg p-3 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-900",
                                                                formData.address_line1 === addr.address_line1 ? "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary" : "border-slate-200 dark:border-slate-800"
                                                            )}
                                                            onClick={() => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    address_line1: addr.address_line1,
                                                                    address_line2: addr.address_line2 || '',
                                                                    region_id: addr.region_id?.toString() || '',
                                                                    commune_id: addr.commune_id?.toString() || ''
                                                                }));
                                                            }}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={cn("mt-0.5", formData.address_line1 === addr.address_line1 ? "text-brand-primary" : "text-slate-400")}>
                                                                    {formData.address_line1 === addr.address_line1 ? <CheckCircle2 className="size-4" /> : <div className="size-4 rounded-full border-2 border-slate-300" />}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-xs uppercase text-slate-900 dark:text-white">{addr.address_line1}</div>
                                                                    <div className="text-[11px] text-slate-500">{addr.commune_name}, {addr.region_name}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </CardContent>
                                            </Card>
                                        )}

                                        <Card className="border-slate-200 dark:border-slate-800">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-brand-primary">
                                                    <MapPin className="size-5" />
                                                    Información de Envío
                                                </CardTitle>
                                                <CardDescription>Dinos a dónde debemos enviar tu compra.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="first_name" className="text-xs font-bold uppercase text-slate-500">Nombre</Label>
                                                        <Input name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="Ej. Juan" required className="border-slate-200 focus:ring-brand-primary" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="last_name" className="text-xs font-bold uppercase text-slate-500">Apellido</Label>
                                                        <Input name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Ej. Pérez" required className="border-slate-200 focus:ring-brand-primary" />
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500">Email</Label>
                                                        <Input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="juan@ejemplo.com" required className="border-slate-200 focus:ring-brand-primary" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="phone" className="text-xs font-bold uppercase text-slate-500">Teléfono</Label>
                                                        <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+56 9 1234 5678" required className="border-slate-200 focus:ring-brand-primary" />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="address_line1" className="text-xs font-bold uppercase text-slate-500">Dirección (Calle y Número)</Label>
                                                    <Input name="address_line1" value={formData.address_line1} onChange={handleInputChange} placeholder="Av. Siempre Viva 123" required className="border-slate-200 focus:ring-brand-primary" />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="address_line2" className="text-xs font-bold uppercase text-slate-500">Depto / Casa / Oficina (Opcional)</Label>
                                                    <Input name="address_line2" value={formData.address_line2} onChange={handleInputChange} placeholder="Depto 42" className="border-slate-200 focus:ring-brand-primary" />
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase text-slate-500">Región</Label>
                                                        <Select value={formData.region_id} onValueChange={(val) => handleSelectChange('region_id', val)}>
                                                            <SelectTrigger className="border-slate-200 focus:ring-brand-primary">
                                                                <SelectValue placeholder="Selecciona Región" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {regions.map(r => (
                                                                    <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase text-slate-500">Comuna</Label>
                                                        <Select value={formData.commune_id} onValueChange={(val) => handleSelectChange('commune_id', val)} disabled={!formData.region_id}>
                                                            <SelectTrigger className="border-slate-200 focus:ring-brand-primary">
                                                                <SelectValue placeholder="Selecciona Comuna" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {communes.map(c => (
                                                                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {step === 'payment' && (
                                    <Card className="border-slate-200 dark:border-slate-800">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-brand-primary">
                                                <CreditCard className="size-5" />
                                                Método de Pago
                                            </CardTitle>
                                            <CardDescription>Selecciona cómo deseas pagar tu pedido.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div 
                                                className="flex items-center gap-4 p-4 border-2 rounded-xl border-brand-primary bg-brand-primary/5 shadow-md"
                                            >
                                                <div className="p-3 rounded-full bg-brand-primary text-white">
                                                    <CreditCard className="size-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="font-black text-slate-900 dark:text-white">Webpay Plus</div>
                                                        <img 
                                                            src="/images/logowebpay-plus.png" 
                                                            alt="Webpay Plus" 
                                                            className="h-6 w-auto dark:brightness-0 dark:invert"
                                                        />
                                                    </div>
                                                    <div className="text-sm text-slate-500">Tarjetas de Débito y Crédito (Transbank)</div>
                                                </div>
                                                <div className="size-6 rounded-full border-2 flex items-center justify-center border-brand-primary bg-brand-primary">
                                                    <div className="size-2 bg-white rounded-full" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Right Column: Summary */}
                            <div className="space-y-6">
                                <Card className="sticky top-[180px] border-slate-200 dark:border-slate-800 shadow-xl">
                                    <CardHeader className="bg-slate-50 dark:bg-slate-900/50 rounded-t-xl border-b dark:border-slate-800">
                                        <CardTitle className="text-lg font-black uppercase tracking-tight">Resumen de Pago</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-6">
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500 font-medium">Subtotal</span>
                                                <span className="text-slate-900 dark:text-white font-bold">${total.toLocaleString('es-CL')}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500 font-medium">Envío</span>
                                                <span className="text-brand-primary font-black uppercase text-[10px]">Por calcular</span>
                                            </div>
                                            <div className="border-t dark:border-slate-800 pt-4 flex justify-between items-baseline font-black">
                                                <span className="text-slate-900 dark:text-white uppercase text-sm">Total a pagar</span>
                                                <span className="text-2xl text-brand-primary dark:text-brand-secondary">${total.toLocaleString('es-CL')}</span>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            {step === 'payment' ? (
                                                <Button 
                                                    className="w-full text-sm font-black uppercase tracking-widest h-14 bg-action-buy hover:bg-brand-secondary text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                    disabled={processing}
                                                    onClick={handleCheckout}
                                                >
                                                    {processing ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                            Procesando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Confirmar Compra <ChevronRight className="ml-2 h-5 w-5" />
                                                        </>
                                                    )}
                                                </Button>
                                            ) : (
                                                <Button 
                                                    className="w-full text-sm font-black uppercase tracking-widest h-14 bg-brand-primary hover:bg-brand-secondary text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                    disabled={!isStepValid()}
                                                    onClick={() => setStep(step === 'cart' ? 'shipping' : 'payment')}
                                                >
                                                    Continuar <ChevronRight className="ml-2 h-5 w-5" />
                                                </Button>
                                            )}

                                            {step !== 'cart' && (
                                                <Button 
                                                    variant="ghost" 
                                                    className="w-full mt-4 text-xs font-bold uppercase text-slate-400 hover:text-slate-800"
                                                    onClick={() => setStep(step === 'payment' ? 'shipping' : 'cart')}
                                                >
                                                    <ChevronLeft className="mr-2 h-4 w-4" /> Volver al paso anterior
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex-col gap-4 border-t dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-b-xl">
                                        {restrictedItemsPresent && !isVerified && (
                                            <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900">
                                                <ShieldAlert className="size-4 text-red-600" />
                                                <AlertTitle className="text-xs font-black uppercase text-red-600 leading-none mb-1">Verificación Requerida</AlertTitle>
                                                <AlertDescription className="text-[11px] text-red-500 leading-tight">
                                                    Contienes productos restringidos (armas/munición). <Link href="/customer/verifications" className="underline font-black hover:text-red-700 transition-colors">Debes verificar tu identidad aquí.</Link>
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                                            <ShieldAlert className="size-3" /> Transacción Segura
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
                <WhatsAppFloating />
            </div>
        </>
    );
}
