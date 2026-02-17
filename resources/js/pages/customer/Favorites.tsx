import { Head, Link } from '@inertiajs/react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
    id: number;
    name: string;
    slug: string;
    base_price: number;
    main_image_url: string;
}

interface Props {
    favorites: Product[];
}

export default function Favorites({ favorites = [] }: Props) {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col">
            <Head title="Mis Favoritos | Facchile Outdoor" />
            <Header />

            <div className="pt-[142px] md:pt-[152px] lg:pt-[162px] flex-1 bg-slate-50/50 dark:bg-[#0a0a0a]">
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                        <Link href="/dashboard" className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 hover:text-brand-primary transition-colors mb-1.5 block">
                            ← Dashboard
                        </Link>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-brand-primary rounded-full" />
                            Mis Favoritos
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Productos que has guardado para después
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

                    {favorites.length === 0 ? (
                        <Card className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                            <Heart className="mx-auto h-10 w-10 text-slate-200 mb-4" />
                            <h2 className="text-sm font-bold uppercase tracking-tight mb-1">No tienes favoritos</h2>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">Explora nuestro catálogo y guarda lo que más te guste.</p>
                            <Link href="/catalogo">
                                <Button size="sm" className="bg-brand-primary hover:bg-brand-secondary text-white font-bold uppercase tracking-tighter px-8 h-10 rounded-lg">
                                    IR AL CATÁLOGO
                                </Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {favorites.map((product) => (
                                <Card key={product.id} className="group overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-md transition-all duration-300">
                                    <div className="relative aspect-square bg-white dark:bg-slate-800 flex items-center justify-center p-4">
                                        <img 
                                            src={product.main_image_url} 
                                            alt={product.name}
                                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <button className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-slate-900/90 rounded-full shadow-sm text-slate-400 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-bold text-[11px] uppercase tracking-tight text-slate-900 dark:text-white line-clamp-2 mb-1 min-h-[32px]">{product.name}</h3>
                                        <div className="text-sm font-black text-brand-primary mb-3">
                                            ${product.base_price.toLocaleString('es-CL')}
                                        </div>
                                        <div className="grid grid-cols-1 gap-1.5">
                                            <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase tracking-tighter" asChild>
                                                <Link href={`/producto/${product.slug}`}>Ver Producto</Link>
                                            </Button>
                                            <Button size="sm" className="h-8 bg-brand-primary hover:bg-brand-secondary text-[10px] font-bold uppercase tracking-tighter gap-1 text-white">
                                                <ShoppingCart className="w-3 h-3" /> Agregar
                                            </Button>
                                        </div>
                                    </div>
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
