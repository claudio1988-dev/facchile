import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-brand-secondary text-white" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">
                Footer
            </h2>
            <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8">
                        <Link href="/" className="inline-block group">
                            <img 
                                src="/logo.png" 
                                alt="Facchile Logo" 
                                className="h-10 w-auto brightness-0 invert transition-transform group-hover:scale-105" 
                            />
                        </Link>
                        <p className="text-sm leading-6 text-slate-300">
                            Tu destino premium para equipamiento de caza, pesca y outdoor en Chile. Comprometidos con la calidad y la normativa vigente.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-slate-400 hover:text-white">
                                <span className="sr-only">Facebook</span>
                                <Facebook className="h-6 w-6" aria-hidden="true" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-white">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="h-6 w-6" aria-hidden="true" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-white">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-6 w-6" aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-white">Categorías</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li>
                                        <Link href="/categoria/rifles-aire-comprimido" className="text-sm leading-6 text-slate-300 hover:text-white">
                                            Rifles y Aire
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/categoria/pesca-deportiva" className="text-sm leading-6 text-slate-300 hover:text-white">
                                            Pesca Deportiva
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/categoria/camping-outdoor" className="text-sm leading-6 text-slate-300 hover:text-white">
                                            Camping & Outdoor
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/categoria/caza-supervivencia" className="text-sm leading-6 text-slate-300 hover:text-white">
                                            Caza y Supervivencia
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-white">Soporte</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li>
                                        <Link href="/contacto" className="text-sm leading-6 text-slate-300 hover:text-white">
                                            Contacto
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/info/envios" className="text-sm leading-6 text-slate-300 hover:text-white">
                                            Información de Envíos
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/info/devoluciones" className="text-sm leading-6 text-slate-300 hover:text-white">
                                            Cambios y Devoluciones
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/info/legal" className="text-sm leading-6 text-slate-300 hover:text-white">
                                            Términos Legales
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-white">Contacto</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li className="flex gap-2 text-sm leading-6 text-slate-300">
                                        <MapPin className="h-5 w-5 shrink-0" />
                                        <span>Av. Providencia 1234, Santiago, Chile</span>
                                    </li>
                                    <li className="flex gap-2 text-sm leading-6 text-slate-300">
                                        <Phone className="h-5 w-5 shrink-0" />
                                        <span>+56 2 2345 6789</span>
                                    </li>
                                    <li className="flex gap-2 text-sm leading-6 text-slate-300">
                                        <Mail className="h-5 w-5 shrink-0" />
                                        <span>contacto@facchile.cl</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
                    <p className="text-xs leading-5 text-slate-400">
                        &copy; 2026 Facchile SpA. Todos los derechos reservados. Venta de armas de aire comprimido regulada por la DGMN.
                    </p>
                </div>
            </div>
        </footer>
    );
}
