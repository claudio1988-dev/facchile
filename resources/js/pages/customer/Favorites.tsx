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

            <div className="pt-32 lg:pt-44 pb-16 flex-1">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-brand-primary flex items-center gap-1 mb-2">
                             Dashboard
                        </Link>
                        <h1 className="text-3xl font-black uppercase">Favoritos</h1>
                        <p className="text-slate-500">Productos que has guardado para después</p>
                    </div>

                    {favorites.length === 0 ? (
                        <Card className="p-12 text-center bg-slate-50 dark:bg-slate-900 border-dashed">
                            <Heart className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                            <h2 className="text-xl font-bold mb-2">No tienes productos favoritos</h2>
                            <p className="text-slate-500 mb-6">Explora nuestro catálogo y guarda lo que más te guste.</p>
                            <Link href="/catalogo">
                                <Button className="bg-brand-primary hover:bg-action-hover rounded-full px-8">
                                    IR AL CATÁLOGO
                                </Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {favorites.map((product) => (
                                <Card key={product.id} className="group overflow-hidden border-slate-200 dark:border-slate-800">
                                    <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-6">
                                        <img 
                                            src={product.main_image_url} 
                                            alt={product.name}
                                            className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <button className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-900 rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-sm line-clamp-2 mb-2 min-h-[40px]">{product.name}</h3>
                                        <div className="text-lg font-black text-brand-primary mb-4">
                                            ${product.base_price.toLocaleString('es-CL')}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/producto/${product.slug}`}>Ver</Link>
                                            </Button>
                                            <Button size="sm" className="bg-action-buy hover:bg-action-hover gap-1">
                                                <ShoppingCart className="w-3 h-3" /> Carro
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
