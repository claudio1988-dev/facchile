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
    CheckCircle2,
    Info,
    Truck
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
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
    carriers: { id: number; name: string; code: string }[];
}

type CheckoutStep = 'cart' | 'shipping' | 'payment';

// Chilean carriers — shown even if DB is empty
const DEFAULT_CARRIERS = [
    { id: -1, name: 'Chilexpress', code: 'CHILEXPRESS', icon: '📦' },
    { id: -2, name: 'Correos Chile', code: 'CORREOS_CHILE', icon: '✉️' },
    { id: -3, name: 'Starken', code: 'STARKEN', icon: '⭐' },
    { id: -4, name: 'Blue Express', code: 'BLUE_EXPRESS', icon: '🔵' },
    { id: -5, name: 'Retiro en Tienda', code: 'PICKUP', icon: '🏪' },
];

const CARRIER_ICONS: Record<string, string> = {
    CHILEXPRESS: '📦',
    CORREOS_CHILE: '✉️',
    STARKEN: '⭐',
    BLUE_EXPRESS: '🔵',
    PICKUP: '🏪',
};

export default function Index({ isVerified, customer, regions, carriers: dbCarriers }: Props) {
    const { items, getTotal, hasRestrictedItems, removeFromCart, updateQuantity, clearCart } = useCartStore();
    const [step, setStep] = useState<CheckoutStep>('cart');
    const [processing, setProcessing] = useState(false);

    // Use DB carriers if available, otherwise show Chilean defaults
    const carriers = dbCarriers && dbCarriers.length > 0 ? dbCarriers : DEFAULT_CARRIERS;

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
        carrier_id: '' as string,
        payment_method: 'webpay' as 'webpay' | 'transfer'
    });

    const communes = useMemo(() => {
        if (!formData.region_id) return [];
        const region = regions.find(r => r.id.toString() === formData.region_id);
        return region?.communes || [];
    }, [formData.region_id, regions]);

    // Calculate Shipping Effect — removed: shipping is paid on delivery

    // Check if cart has restricted items
    const restrictedItemsPresent = hasRestrictedItems();
    // Logic to determine if user can checkout
    const canContinue = items.length > 0 && (!restrictedItemsPresent || (restrictedItemsPresent && isVerified));

    const isStepValid = () => {
        if (step === 'cart') {
            return canContinue;
        }
        if (step === 'shipping') {
            return (
                formData.first_name?.trim() !== '' &&
                formData.last_name?.trim() !== '' &&
                formData.email?.trim() !== '' &&
                formData.phone?.trim() !== '' &&
                formData.address_line1?.trim() !== '' &&
                formData.region_id !== '' &&
                formData.commune_id !== '' &&
                formData.carrier_id !== ''
            );
        }
        return true;
    };

    // ... (existing handlers)

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
            payment_method: formData.payment_method,
            carrier_id: formData.carrier_id || null,
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

                <main className="pt-[110px] md:pt-[145px] lg:pt-[155px] pb-16">
                    <div className="container py-8 max-w-5xl mx-auto px-4">
                        {/* Stepper Header */}
                        <div className="flex items-center justify-center mb-8 md:mb-12">
                            <div className="flex items-center w-full max-w-2xl px-2">
                                {/* Step 1 */}
                                <div className="flex flex-col items-center flex-1 relative">
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                        step === 'cart' ? 'bg-brand-primary border-brand-primary text-white' : 'bg-muted border-muted text-muted-foreground'
                                    } ${['shipping', 'payment'].includes(step) ? 'bg-green-600 border-green-600 text-white' : ''}`}>
                                        {['shipping', 'payment'].includes(step) ? <CheckCircle2 className="size-5 md:size-6" /> : <ShoppingCart className="size-4 md:size-5" />}
                                    </div>
                                    <span className={cn("text-[9px] md:text-xs font-bold mt-2 uppercase tracking-tighter", step === 'cart' ? 'text-brand-primary' : 'text-slate-400')}>Carrito</span>
                                </div>
                                
                                <div className={`h-0.5 md:h-1 flex-1 ${['shipping', 'payment'].includes(step) ? 'bg-green-600' : 'bg-muted'}`} />

                                {/* Step 2 */}
                                <div className="flex flex-col items-center flex-1 relative">
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                        step === 'shipping' ? 'bg-brand-primary border-brand-primary text-white' : 'bg-muted border-muted text-muted-foreground'
                                    } ${step === 'payment' ? 'bg-green-600 border-green-600 text-white' : ''}`}>
                                        {step === 'payment' ? <CheckCircle2 className="size-5 md:size-6" /> : <MapPin className="size-4 md:size-5" />}
                                    </div>
                                    <span className={cn("text-[9px] md:text-xs font-bold mt-2 uppercase tracking-tighter", step === 'shipping' ? 'text-brand-primary' : (step === 'payment' ? 'text-green-600' : 'text-slate-400'))}>Envío</span>
                                </div>

                                <div className={`h-0.5 md:h-1 flex-1 ${step === 'payment' ? 'bg-green-600' : 'bg-muted'}`} />

                                {/* Step 3 */}
                                <div className="flex flex-col items-center flex-1 relative">
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                        step === 'payment' ? 'bg-brand-primary border-brand-primary text-white' : 'bg-muted border-muted text-muted-foreground'
                                    }`}>
                                        <CreditCard className="size-4 md:size-5" />
                                    </div>
                                    <span className={cn("text-[9px] md:text-xs font-bold mt-2 uppercase tracking-tighter", step === 'payment' ? 'text-brand-primary' : 'text-slate-400')}>Pago</span>
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
                                                                    <p className="font-black text-brand-primary dark:text-white">{formatPrice(item.price * item.quantity)}</p>
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
                                                <div className="text-lg font-black text-brand-primary dark:text-white">{formatPrice(total)}</div>
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
                                                        <Input name="first_name" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} placeholder="Ej. Juan" required className="border-slate-200 focus:ring-brand-primary" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="last_name" className="text-xs font-bold uppercase text-slate-500">Apellido</Label>
                                                        <Input name="last_name" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} placeholder="Ej. Pérez" required className="border-slate-200 focus:ring-brand-primary" />
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500">Email</Label>
                                                        <Input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="juan@ejemplo.com" required className="border-slate-200 focus:ring-brand-primary" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="phone" className="text-xs font-bold uppercase text-slate-500">Teléfono</Label>
                                                        <Input name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+56 9 1234 5678" required className="border-slate-200 focus:ring-brand-primary" />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="address_line1" className="text-xs font-bold uppercase text-slate-500">Dirección (Calle y Número)</Label>
                                                    <Input name="address_line1" value={formData.address_line1} onChange={(e) => setFormData({...formData, address_line1: e.target.value})} placeholder="Av. Siempre Viva 123" required className="border-slate-200 focus:ring-brand-primary" />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="address_line2" className="text-xs font-bold uppercase text-slate-500">Depto / Casa / Oficina (Opcional)</Label>
                                                    <Input name="address_line2" value={formData.address_line2} onChange={(e) => setFormData({...formData, address_line2: e.target.value})} placeholder="Depto 42" className="border-slate-200 focus:ring-brand-primary" />
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-bold uppercase text-slate-500">Región</Label>
                                                        <Select value={formData.region_id} onValueChange={(val) => setFormData(prev => ({ ...prev, region_id: val, commune_id: '' }))}>
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
                                                        <Select value={formData.commune_id} onValueChange={(val) => setFormData(prev => ({ ...prev, commune_id: val }))} disabled={!formData.region_id}>
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
                                        {/* Carrier preference selector */}
                                        <Card className="border-slate-200 dark:border-slate-800">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-brand-primary">
                                                    <Truck className="size-5" />
                                                    Empresa de Despacho Preferida
                                                </CardTitle>
                                                <CardDescription>
                                                    Indica tu preferencia. El costo del envío lo pagas al recibir el pedido.
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                {carriers.map((carrier) => {
                                                    const icon = CARRIER_ICONS[carrier.code] ?? '🚚';
                                                    const isSelected = formData.carrier_id === carrier.code;
                                                    return (
                                                        <div
                                                            key={carrier.id}
                                                            className={cn(
                                                                "flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all select-none",
                                                                isSelected
                                                                    ? "border-brand-primary bg-brand-primary/5 shadow-md ring-1 ring-brand-primary"
                                                                    : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900"
                                                            )}
                                                            onClick={() => setFormData(prev => ({ ...prev, carrier_id: carrier.code }))}
                                                        >
                                                            <span className="text-2xl shrink-0" role="img">{icon}</span>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={cn(
                                                                    "text-sm font-bold leading-tight",
                                                                    isSelected ? "text-brand-primary" : "text-slate-800 dark:text-white"
                                                                )}>
                                                                    {carrier.name}
                                                                </p>
                                                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                                                                    Flete a pagar al recibir
                                                                </p>
                                                            </div>
                                                            <div className={cn(
                                                                "size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                                                                isSelected ? "border-brand-primary bg-brand-primary" : "border-slate-300"
                                                            )}>
                                                                {isSelected && <div className="size-2 bg-white rounded-full" />}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
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
                                            {/* Webpay Option */}
                                            <div 
                                                className={cn(
                                                    "flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all",
                                                    formData.payment_method === 'webpay' 
                                                        ? "border-brand-primary bg-brand-primary/5 shadow-md" 
                                                        : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
                                                )}
                                                onClick={() => setFormData(prev => ({ ...prev, payment_method: 'webpay' }))}
                                            >
                                                <div className={cn(
                                                    "p-3 rounded-full transition-colors",
                                                    formData.payment_method === 'webpay' ? "bg-brand-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                                )}>
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
                                                    <div className="text-sm text-slate-500 font-medium">Tarjetas de Débito y Crédito (Transbank)</div>
                                                </div>
                                                <div className={cn(
                                                    "size-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                    formData.payment_method === 'webpay' ? "border-brand-primary bg-brand-primary" : "border-slate-300 dark:border-slate-600"
                                                )}>
                                                    {formData.payment_method === 'webpay' && <div className="size-2 bg-white rounded-full" />}
                                                </div>
                                            </div>

                                            {/* Bank Transfer Option */}
                                            <div 
                                                className={cn(
                                                    "flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all",
                                                    formData.payment_method === 'transfer' 
                                                        ? "border-brand-primary bg-brand-primary/5 shadow-md" 
                                                        : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
                                                )}
                                                onClick={() => setFormData(prev => ({ ...prev, payment_method: 'transfer' }))}
                                            >
                                                <div className={cn(
                                                    "p-3 rounded-full transition-colors",
                                                    formData.payment_method === 'transfer' ? "bg-brand-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                                )}>
                                                    <Wallet className="size-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-black text-slate-900 dark:text-white">Transferencia Bancaria</div>
                                                    <div className="text-sm text-slate-500 font-medium">Paga directamente desde tu banco</div>
                                                </div>
                                                <div className={cn(
                                                    "size-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                    formData.payment_method === 'transfer' ? "border-brand-primary bg-brand-primary" : "border-slate-300 dark:border-slate-600"
                                                )}>
                                                    {formData.payment_method === 'transfer' && <div className="size-2 bg-white rounded-full" />}
                                                </div>
                                            </div>

                                            {/* Bank Transfer Details (Visual Highlight) */}
                                            {formData.payment_method === 'transfer' && (
                                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900 border-dashed">
                                                        <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                                            <CheckCircle2 className="h-4 w-4 text-blue-600" /> Confirmación de Transferencia
                                                        </h4>
                                                        <div className="space-y-4 text-sm">
                                                            <p className="text-blue-800 dark:text-blue-300 bg-white/50 dark:bg-blue-950/40 p-3 rounded-md border border-blue-100 dark:border-blue-900 flex items-start gap-2 text-xs">
                                                                <Info className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
                                                                Para procesar tu pedido, debes transferir el total a la siguiente cuenta y luego confirmar tu compra.
                                                            </p>
                                                            
                                                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-blue-100 dark:border-blue-900 pt-4">
                                                                <div className="text-blue-700/60 dark:text-blue-400 font-medium uppercase text-[10px] tracking-wider">Titular</div>
                                                                <div className="text-blue-900 dark:text-blue-100 font-bold text-xs">Fabián Esteban Acuña Campos</div>
                                                                
                                                                <div className="text-blue-700/60 dark:text-blue-400 font-medium uppercase text-[10px] tracking-wider">RUT</div>
                                                                <div className="text-blue-900 dark:text-blue-100 font-bold text-xs">17.196.505-5</div>
                                                                
                                                                <div className="text-blue-700/60 dark:text-blue-400 font-medium uppercase text-[10px] tracking-wider">Banco</div>
                                                                <div className="text-blue-900 dark:text-blue-100 font-bold text-xs">Mercado Pago</div>
                                                                
                                                                <div className="text-blue-700/60 dark:text-blue-400 font-medium uppercase text-[10px] tracking-wider">Tipo de Cuenta</div>
                                                                <div className="text-blue-900 dark:text-blue-100 font-bold text-xs">Cuenta Vista</div>
                                                                
                                                                <div className="text-blue-700/60 dark:text-blue-400 font-medium uppercase text-[10px] tracking-wider">Nº de Cuenta</div>
                                                                <div className="text-blue-900 dark:text-blue-100 font-bold text-xs">1004087752</div>
                                                                
                                                                <div className="text-blue-700/60 dark:text-blue-400 font-medium uppercase text-[10px] tracking-wider">Email para comprobante</div>
                                                                <div className="text-blue-900 dark:text-blue-100 font-bold text-xs">facpesca@gmail.com</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
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
                                                <span className="text-slate-500 font-medium">Subtotal productos</span>
                                                <span className="text-slate-900 dark:text-white font-bold">{formatPrice(total)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm items-center">
                                                <span className="text-slate-500 font-medium">Envío</span>
                                                <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                                    <Truck className="size-3.5" /> A pagar al recibir
                                                </span>
                                            </div>
                                            <div className="border-t dark:border-slate-800 pt-4 flex justify-between items-baseline font-black">
                                                <span className="text-slate-900 dark:text-white uppercase text-sm">Total a pagar</span>
                                                <span className="text-2xl text-brand-primary dark:text-brand-secondary">
                                                    {formatPrice(total)}
                                                </span>
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
