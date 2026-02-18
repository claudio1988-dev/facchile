import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Truck, Save, Loader2, MapPin, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface ShippingZone {
    id: number;
    carrier_id: number;
    base_rate: string;
    per_kg_rate: string;
    extreme_zone_surcharge: string;
    estimated_days_min: number;
    estimated_days_max: number;
}

interface Commune {
    id: number;
    name: string;
    shipping_zones: ShippingZone[];
}

interface Region {
    id: number;
    name: string;
    communes: Commune[];
}

interface Carrier {
    id: number;
    name: string;
}

interface Props {
    regions: Region[];
    carriers: Carrier[];
}

export default function ShippingIndex({ regions, carriers }: Props) {
    const [selectedCarrier, setSelectedCarrier] = useState<string>(carriers[0]?.id.toString() || '');
    const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});

    // Función para guardar una zona específica
    const handleSave = (communeId: number, data: any) => {
        setLoadingMap(prev => ({ ...prev, [communeId]: true }));
        
        router.patch('/adminfacchile/shipping-zones', {
            commune_id: communeId,
            carrier_id: selectedCarrier,
            ...data
        }, {
            onSuccess: () => {
                toast.success("Zona actualizada correctamente");
            },
            onError: () => {
                toast.error("No se pudieron guardar los cambios");
            },
            onFinish: () => setLoadingMap(prev => ({ ...prev, [communeId]: false }))
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración de Envíos', href: '/adminfacchile/shipping-zones' }]}>
            <Head title="Configuración de Envíos" />

            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Configuración de Costos de Envío</h1>
                    <p className="text-slate-500 text-lg">Administra las tarifas de envío por región y comuna.</p>
                </div>

                {/* Carrier Selector */}
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                    <Truck className="h-6 w-6 text-brand-primary" />
                    <div className="flex-1">
                        <Label htmlFor="carrier-select" className="mb-1 block font-bold text-sm">Transportista a Configurar</Label>
                        <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                            <SelectTrigger id="carrier-select" className="w-[300px] h-10 bg-white dark:bg-black">
                                <SelectValue placeholder="Selecciona Transportista" />
                            </SelectTrigger>
                            <SelectContent>
                                {carriers.map(carrier => (
                                    <SelectItem key={carrier.id} value={carrier.id.toString()}>{carrier.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Tarifas Regionales</CardTitle>
                        <CardDescription>
                            Despliega las regiones para ver y editar las tarifas por comuna.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {regions.map((region) => (
                            <RegionCollapsible 
                                key={region.id} 
                                region={region} 
                                selectedCarrier={selectedCarrier}
                                onSave={handleSave}
                                loadingMap={loadingMap}
                            />
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function RegionCollapsible({ region, selectedCarrier, onSave, loadingMap }: { region: Region, selectedCarrier: string, onSave: any, loadingMap: any }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg overflow-hidden">
            <CollapsibleTrigger className="flex w-full items-center justify-between bg-slate-50 dark:bg-slate-900 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-2 text-left">
                    <MapPin className="h-4 w-4 text-brand-primary" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{region.name}</span>
                    <span className="text-xs text-slate-400 font-normal ml-2">({region.communes.length} comunas)</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-4 space-y-4 bg-white dark:bg-slate-950">
                <div className="grid grid-cols-12 gap-4 mb-2 px-2 text-xs font-bold uppercase text-slate-500 border-b pb-2">
                    <div className="col-span-3">Comuna</div>
                    <div className="col-span-2">Costo Base ($)</div>
                    <div className="col-span-2">Costo por Kg Extra ($)</div>
                    <div className="col-span-2">Días Min/Max</div>
                    <div className="col-span-2">Recargo Zona Ext. ($)</div>
                    <div className="col-span-1">Acción</div>
                </div>
                
                {region.communes.map((commune) => (
                    <ShippingRow 
                        key={commune.id} 
                        commune={commune} 
                        carrierId={parseInt(selectedCarrier)} 
                        onSave={onSave}
                        loading={loadingMap[commune.id]}
                    />
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}

// Componente para manejar el estado local de cada fila
function ShippingRow({ commune, carrierId, onSave, loading }: { commune: Commune, carrierId: number, onSave: (id: number, data: any) => void, loading?: boolean }) {
    // Buscar la zona correspondiente al carrier seleccionado
    const zone = commune.shipping_zones.find(z => z.carrier_id === carrierId);

    const [formData, setFormData] = useState({
        base_rate: zone?.base_rate ? Math.round(parseFloat(zone.base_rate)).toString() : '0',
        per_kg_rate: zone?.per_kg_rate ? Math.round(parseFloat(zone.per_kg_rate)).toString() : '0',
        extreme_zone_surcharge: zone?.extreme_zone_surcharge ? Math.round(parseFloat(zone.extreme_zone_surcharge)).toString() : '0',
        estimated_days_min: zone?.estimated_days_min || 2,
        estimated_days_max: zone?.estimated_days_max || 5,
    });
    
    // Update local state when carrier changes or zone data changes should be handled if props update
    // But since key is unique per row render, it's fine.
    
    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="grid grid-cols-12 gap-4 items-center px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
            <div className="col-span-3 font-medium text-sm text-slate-700 dark:text-slate-300">
                {commune.name}
            </div>
            <div className="col-span-2">
                <Input 
                    type="number" 
                    value={formData.base_rate} 
                    onChange={e => handleChange('base_rate', e.target.value)}
                    className="h-8 text-right"
                />
            </div>
            <div className="col-span-2">
                <Input 
                    type="number" 
                    value={formData.per_kg_rate} 
                    onChange={e => handleChange('per_kg_rate', e.target.value)}
                    className="h-8 text-right bg-slate-50"
                />
            </div>
            <div className="col-span-2 flex gap-1">
                <Input 
                    type="number" 
                    value={formData.estimated_days_min} 
                    onChange={e => handleChange('estimated_days_min', parseInt(e.target.value))}
                    className="h-8 text-center text-xs px-1"
                    placeholder="Min"
                />
                <span className="self-center">-</span>
                <Input 
                    type="number" 
                    value={formData.estimated_days_max} 
                    onChange={e => handleChange('estimated_days_max', parseInt(e.target.value))}
                    className="h-8 text-center text-xs px-1"
                    placeholder="Max"
                />
            </div>
            <div className="col-span-2">
                <Input 
                    type="number" 
                    value={formData.extreme_zone_surcharge} 
                    onChange={e => handleChange('extreme_zone_surcharge', e.target.value)}
                    className="h-8 text-right text-red-600 bg-red-50/50"
                />
            </div>
            <div className="col-span-1 flex justify-end">
                <Button 
                    size="sm" 
                    onClick={() => onSave(commune.id, formData)}
                    disabled={loading}
                    className={loading ? "opacity-50" : "bg-brand-primary hover:bg-brand-secondary text-white"}
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
}
