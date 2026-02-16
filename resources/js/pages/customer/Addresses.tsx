import { Head, Link } from '@inertiajs/react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Plus, Home, Briefcase, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
}

export default function Addresses({ addresses = [] }: Props) {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col">
            <Head title="Mis Direcciones | Facchile Outdoor" />
            <Header />

            <div className="pt-32 lg:pt-44 pb-16 flex-1">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <Link href="/dashboard" className="text-sm text-slate-500 hover:text-brand-primary flex items-center gap-1 mb-2">
                                Dashboard
                            </Link>
                            <h1 className="text-3xl font-black uppercase">Direcciones</h1>
                            <p className="text-slate-500">Gestiona tus puntos de entrega</p>
                        </div>
                        <Button className="bg-brand-primary hover:bg-action-hover rounded-full px-6">
                            <Plus className="w-4 h-4 mr-2" />
                            NUEVA DIRECCIÓN
                        </Button>
                    </div>

                    {addresses.length === 0 ? (
                        <Card className="p-12 text-center bg-slate-50 dark:bg-slate-900 border-dashed">
                            <MapPin className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                            <h2 className="text-xl font-bold mb-2">No tienes direcciones guardadas</h2>
                            <p className="text-slate-500 mb-6">Agrega una dirección para agilizar tus compras.</p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {addresses.map((address) => (
                                <Card key={address.id} className={`relative overflow-hidden ${address.is_default ? 'ring-2 ring-brand-primary border-transparent' : ''}`}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <Home className="w-5 h-5 text-brand-primary" />
                                                <CardTitle className="text-sm font-bold uppercase">{address.name}</CardTitle>
                                            </div>
                                            {address.is_default && (
                                                <span className="text-[10px] bg-brand-primary text-white px-2 py-0.5 rounded font-bold uppercase">Predeterminada</span>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{address.address_line1}</p>
                                        {address.address_line2 && <p className="text-sm text-slate-500">{address.address_line2}</p>}
                                        <p className="text-sm text-slate-500 mt-1">{address.commune_name}, {address.region_name}</p>
                                        
                                        <div className="flex gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <button className="text-xs font-bold uppercase text-slate-400 hover:text-brand-primary flex items-center gap-1">
                                                <Edit2 className="w-3 h-3" /> Editar
                                            </button>
                                            <button className="text-xs font-bold uppercase text-slate-400 hover:text-red-500 flex items-center gap-1">
                                                <Trash2 className="w-3 h-3" /> Eliminar
                                            </button>
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
