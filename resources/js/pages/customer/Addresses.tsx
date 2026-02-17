import { Head, Link, useForm } from '@inertiajs/react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Plus, Home, Trash2, Edit2, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Commune {
    id: number;
    name: string;
}

interface Region {
    id: number;
    name: string;
    communes: Commune[];
}

interface Address {
    id: number;
    name: string;
    address_line1: string;
    address_line2: string | null;
    commune_name: string;
    region_name: string;
    is_default: boolean;
}

interface Props {
    addresses: Address[];
    regions: Region[];
}

export default function Addresses({ addresses = [], regions = [] }: Props) {
    const [open, setOpen] = useState(false);
    
    const { data, setData, post, processing, reset, errors } = useForm({
        address_line1: '',
        address_line2: '',
        region_id: '',
        commune_id: '',
        is_default: false,
    });

    const communes = useMemo(() => {
        if (!data.region_id) return [];
        const region = regions.find(r => r.id.toString() === data.region_id);
        return region?.communes || [];
    }, [data.region_id, regions]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/customer/addresses', {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col font-outfit">
            <Head title="Mis Direcciones | Facchile Outdoor" />
            <Header />

            <div className="pt-[142px] md:pt-[152px] lg:pt-[162px] flex-1 bg-slate-50/50 dark:bg-[#0a0a0a]">
                {/* Banner Header */}
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <Link href="/dashboard" className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 hover:text-brand-primary transition-colors mb-1.5 block">
                                    ← Dashboard
                                </Link>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-brand-primary rounded-full" />
                                    Mis Direcciones
                                </h1>
                                <p className="text-xs text-slate-500 mt-1">
                                    Gestiona tus puntos de entrega y facturación
                                </p>
                            </div>
                            
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="bg-brand-primary hover:bg-brand-secondary text-white font-bold uppercase tracking-tighter px-6 h-10 rounded-lg shadow-sm">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Nueva Dirección
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] font-outfit">
                                    <DialogHeader>
                                        <DialogTitle className="uppercase font-black text-xl tracking-tight">Agregar Dirección</DialogTitle>
                                        <DialogDescription className="font-medium text-slate-500">
                                            Ingresa los datos para tu nuevo punto de despacho.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="address_line1" className="text-xs font-bold uppercase text-slate-500">Calle y Número</Label>
                                                <Input 
                                                    id="address_line1"
                                                    value={data.address_line1}
                                                    onChange={e => setData('address_line1', e.target.value)}
                                                    placeholder="Ej. Av. Providencia 1234"
                                                    className="h-12 border-slate-200 focus:ring-brand-primary"
                                                />
                                                {errors.address_line1 && <p className="text-xs text-red-500 font-bold">{errors.address_line1}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="address_line2" className="text-xs font-bold uppercase text-slate-500">Depto / Casa / Oficina (Opcional)</Label>
                                                <Input 
                                                    id="address_line2"
                                                    value={data.address_line2}
                                                    onChange={e => setData('address_line2', e.target.value)}
                                                    placeholder="Ej. Depto 402"
                                                    className="h-12 border-slate-200"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase text-slate-500">Región</Label>
                                                    <Select value={data.region_id} onValueChange={val => setData(prev => ({ ...prev, region_id: val, commune_id: '' }))}>
                                                        <SelectTrigger className="h-12 border-slate-200">
                                                            <SelectValue placeholder="Seleccionar" />
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
                                                    <Select value={data.commune_id} onValueChange={val => setData('commune_id', val)} disabled={!data.region_id}>
                                                        <SelectTrigger className="h-12 border-slate-200">
                                                            <SelectValue placeholder="Seleccionar" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {communes.map(c => (
                                                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.commune_id && <p className="text-xs text-red-500 font-bold">{errors.commune_id}</p>}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setData('is_default', !data.is_default)}
                                                    className={cn(
                                                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                                        data.is_default ? "bg-brand-primary border-brand-primary text-white" : "border-slate-300"
                                                    )}
                                                >
                                                    {data.is_default && <Check className="w-3.5 h-3.5" />}
                                                </button>
                                                <Label className="text-xs font-black uppercase text-slate-700 cursor-pointer" onClick={() => setData('is_default', !data.is_default)}>
                                                    Establecer como predeterminada
                                                </Label>
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <Button 
                                                type="submit" 
                                                disabled={processing}
                                                className="w-full h-12 bg-action-buy hover:bg-brand-secondary text-white font-black uppercase tracking-widest"
                                            >
                                                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'GUARDAR DIRECCIÓN'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    {addresses.length === 0 ? (
                        <Card className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                            <MapPin className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                            <h2 className="text-sm font-bold uppercase tracking-tight mb-1">Aún no tienes direcciones</h2>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
                                Agrega una dirección para agilizar tus próximas compras.
                            </p>
                            <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="text-xs font-bold uppercase border-slate-200 hover:bg-slate-50 transition-all">
                                <Plus className="w-3.5 h-3.5 mr-2" /> Agregar dirección
                            </Button>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {addresses.map((address) => (
                                <Card key={address.id} className={cn(
                                    "relative overflow-hidden group transition-all duration-300 border shadow-sm",
                                    address.is_default ? "border-brand-primary/30 bg-brand-primary/[0.02]" : "border-slate-200 hover:border-slate-300"
                                )}>
                                    <CardContent className="p-5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                                <Home className="w-4 h-4" />
                                            </div>
                                            {address.is_default && (
                                                <span className="text-[10px] bg-brand-primary text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">
                                                    Predeterminada
                                                </span>
                                            )}
                                        </div>
                                        
                                        <h3 className="font-bold uppercase text-xs tracking-tight text-slate-900 dark:text-white mb-1 truncate">{address.name}</h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">{address.address_line1}</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">{address.commune_name}, {address.region_name}</p>
                                        
                                        <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex gap-3">
                                                <button className="text-[10px] font-bold uppercase text-slate-400 hover:text-brand-primary transition-colors flex items-center gap-1">
                                                    <Edit2 className="w-3 h-3" /> Editar
                                                </button>
                                                <button className="text-[10px] font-bold uppercase text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1">
                                                    <Trash2 className="w-3 h-3" /> Eliminar
                                                </button>
                                            </div>
                                            {!address.is_default && (
                                                <button className="text-[10px] font-bold uppercase text-slate-400 hover:text-brand-primary transition-colors">
                                                    Usar por defecto
                                                </button>
                                            )}
                                        </div>
                                    </CardContent>
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
