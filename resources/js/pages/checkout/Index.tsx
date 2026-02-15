import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
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
        <AppLayout>
            <Head title="Finalizar Compra" />

            <div className="container py-8 max-w-5xl mx-auto px-4">
                {/* Stepper Header */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center w-full max-w-2xl">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center flex-1 relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                step === 'cart' ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-muted text-muted-foreground'
                            } ${['shipping', 'payment'].includes(step) ? 'bg-green-500 border-green-500 text-white' : ''}`}>
                                {['shipping', 'payment'].includes(step) ? <CheckCircle2 className="size-6" /> : <ShoppingCart className="size-5" />}
                            </div>
                            <span className="text-xs font-medium mt-2">Carrito</span>
                        </div>
                        
                        <div className={`h-1 flex-1 ${['shipping', 'payment'].includes(step) ? 'bg-green-500' : 'bg-muted'}`} />

                        {/* Step 2 */}
                        <div className="flex flex-col items-center flex-1 relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                step === 'shipping' ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-muted text-muted-foreground'
                            } ${step === 'payment' ? 'bg-green-500 border-green-500 text-white' : ''}`}>
                                {step === 'payment' ? <CheckCircle2 className="size-6" /> : <MapPin className="size-5" />}
                            </div>
                            <span className="text-xs font-medium mt-2">Envío</span>
                        </div>

                        <div className={`h-1 flex-1 ${step === 'payment' ? 'bg-green-500' : 'bg-muted'}`} />

                        {/* Step 3 */}
                        <div className="flex flex-col items-center flex-1 relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                step === 'payment' ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-muted text-muted-foreground'
                            }`}>
                                <CreditCard className="size-5" />
                            </div>
                            <span className="text-xs font-medium mt-2">Pago</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {step === 'cart' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ShoppingCart className="size-5" />
                                        Tu Pedido
                                    </CardTitle>
                                    <CardDescription>Revisa los productos en tu carrito antes de continuar.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {items.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                            <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
                                            <Link href="/catalogo">
                                                <Button className="mt-4">Ir al Catálogo</Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="divide-y">
                                            {items.map((item) => (
                                                <div key={item.id} className="flex gap-4 p-4">
                                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded border">
                                                        <img src={item.image || '/images/no-image.jpg'} alt={item.name} className="h-full w-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between">
                                                            <h4 className="font-medium">{item.name}</h4>
                                                            <p className="font-bold">${(item.price * item.quantity).toLocaleString('es-CL')}</p>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <div className="flex items-center gap-2 border rounded-md h-8 px-1">
                                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                                    <Minus className="h-3 w-3" />
                                                                </Button>
                                                                <span className="text-sm px-2 w-6 text-center">{item.quantity}</span>
                                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                                    <Plus className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                className="text-destructive h-8 px-2 hover:bg-destructive/10"
                                                                onClick={() => removeFromCart(item.id)}
                                                            >
                                                                <Trash2 className="size-4 mr-1" /> Eliminar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                                {items.length > 0 && (
                                    <CardFooter className="justify-between bg-muted/30 py-4">
                                        <div className="text-sm font-medium">Subtotal Carrito</div>
                                        <div className="text-lg font-bold">${total.toLocaleString('es-CL')}</div>
                                    </CardFooter>
                                )}
                            </Card>
                        )}

                        {step === 'shipping' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="size-5" />
                                        Información de Envío
                                    </CardTitle>
                                    <CardDescription>Dinos a dónde debemos enviar tu compra.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="first_name">Nombre</Label>
                                            <Input name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="Ej. Juan" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last_name">Apellido</Label>
                                            <Input name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Ej. Pérez" required />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="juan@ejemplo.com" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Teléfono</Label>
                                            <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+56 9 1234 5678" required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address_line1">Dirección (Calle y Número)</Label>
                                        <Input name="address_line1" value={formData.address_line1} onChange={handleInputChange} placeholder="Av. Siempre Viva 123" required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address_line2">Depto / Casa / Oficina (Opcional)</Label>
                                        <Input name="address_line2" value={formData.address_line2} onChange={handleInputChange} placeholder="Depto 42" />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Región</Label>
                                            <Select value={formData.region_id} onValueChange={(val) => handleSelectChange('region_id', val)}>
                                                <SelectTrigger>
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
                                            <Label>Comuna</Label>
                                            <Select value={formData.commune_id} onValueChange={(val) => handleSelectChange('commune_id', val)} disabled={!formData.region_id}>
                                                <SelectTrigger>
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
                        )}

                        {step === 'payment' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="size-5" />
                                        Método de Pago
                                    </CardTitle>
                                    <CardDescription>Selecciona cómo deseas pagar tu pedido.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div 
                                        className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                            formData.payment_method === 'webpay' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                                        }`}
                                        onClick={() => setFormData(prev => ({ ...prev, payment_method: 'webpay' }))}
                                    >
                                        <div className="bg-primary/10 p-3 rounded-full">
                                            <CreditCard className="size-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold">Webpay Plus</div>
                                            <div className="text-sm text-muted-foreground">Tarjetas de Débito y Crédito (Transbank)</div>
                                        </div>
                                        <div className={`size-5 rounded-full border-2 ${formData.payment_method === 'webpay' ? 'border-primary bg-primary' : 'border-muted'}`} />
                                    </div>

                                    <div 
                                        className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                            formData.payment_method === 'transfer' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                                        }`}
                                        onClick={() => setFormData(prev => ({ ...prev, payment_method: 'transfer' }))}
                                    >
                                        <div className="bg-primary/10 p-3 rounded-full">
                                            <Wallet className="size-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold">Transferencia Bancaria</div>
                                            <div className="text-sm text-muted-foreground">Sin comisión. El pedido se procesará al confirmar el depósito.</div>
                                        </div>
                                        <div className={`size-5 rounded-full border-2 ${formData.payment_method === 'transfer' ? 'border-primary bg-primary' : 'border-muted'}`} />
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Summary */}
                    <div className="space-y-6">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Resumen de Pago</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${total.toLocaleString('es-CL')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Envío</span>
                                        <span className="text-green-600 font-medium">Por calcular</span>
                                    </div>
                                    <div className="border-t pt-4 flex justify-between font-bold text-xl">
                                        <span>Total</span>
                                        <span>${total.toLocaleString('es-CL')}</span>
                                    </div>
                                </div>

                                {step === 'payment' ? (
                                    <Button 
                                        className="w-full text-lg h-12 bg-action-buy hover:bg-action-hover animate-in fade-in slide-in-from-bottom-2"
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
                                                Confirmar y Pagar <ChevronRight className="ml-2 h-5 w-5" />
                                            </>
                                        )}
                                    </Button>
                                ) : (
                                    <Button 
                                        className="w-full text-lg h-12"
                                        disabled={!isStepValid()}
                                        onClick={() => setStep(step === 'cart' ? 'shipping' : 'payment')}
                                    >
                                        Siguiente <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                )}

                                {step !== 'cart' && (
                                    <Button 
                                        variant="outline" 
                                        className="w-full"
                                        onClick={() => setStep(step === 'payment' ? 'shipping' : 'cart')}
                                    >
                                        <ChevronLeft className="mr-2 h-4 w-4" /> Volver
                                    </Button>
                                )}
                            </CardContent>
                            <CardFooter className="flex-col gap-4 border-t bg-muted/20">
                                {restrictedItemsPresent && !isVerified && (
                                    <Alert variant="destructive" className="bg-destructive/10 border-none shadow-none">
                                        <ShieldAlert className="size-4" />
                                        <AlertTitle className="text-xs font-bold">Verificación Requerida</AlertTitle>
                                        <AlertDescription className="text-xs">
                                            Contienes productos restringidos. <Link href="/customer/verifications" className="underline font-bold">Verificar aquí</Link>
                                        </AlertDescription>
                                    </Alert>
                                )}
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                                    <ShieldAlert className="size-3" /> Pago Seguro SSL 256-bit
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
