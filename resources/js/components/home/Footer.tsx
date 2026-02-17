import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative bg-brand-primary text-white overflow-hidden" aria-labelledby="footer-heading">
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
            
            <h2 id="footer-heading" className="sr-only">
                Footer
            </h2>
            
            <div className="relative z-10 mx-auto max-w-7xl px-6 pb-12 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
                <div className="xl:grid xl:grid-cols-4 xl:gap-12">
                    {/* Brand Section */}
                    <div className="space-y-8 col-span-1">
                        <Link href="/" className="inline-block group">
                            <img 
                                src="/logo.png" 
                                alt="Facchile Logo" 
                                className="h-12 w-auto brightness-0 invert transition-all duration-300 group-hover:scale-105" 
                            />
                        </Link>
                        <p className="text-sm leading-7 text-slate-300 max-w-xs font-medium">
                            Especialistas en equipamiento premium para caza, pesca y outdoor en Chile. Tradición y tecnología para tu próxima aventura.
                        </p>
                        <div className="flex space-x-5">
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all">
                                <span className="sr-only">Facebook</span>
                                <Facebook className="h-5 w-5" aria-hidden="true" />
                            </a>
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="h-5 w-5" aria-hidden="true" />
                            </a>
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-5 w-5" aria-hidden="true" />
                            </a>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-3 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-2 inline-block">Categorías</h3>
                                <ul role="list" className="space-y-4">
                                    <li>
                                        <Link href="/catalogo?category=rifles-aire-comprimido" className="text-sm text-slate-300 hover:text-action-buy transition-colors">
                                            Rifles y Aire
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/catalogo?category=pesca-deportiva" className="text-sm text-slate-300 hover:text-action-buy transition-colors">
                                            Pesca Deportiva
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/catalogo?category=camping-outdoor" className="text-sm text-slate-300 hover:text-action-buy transition-colors">
                                            Camping & Outdoor
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/catalogo?category=caza-supervivencia" className="text-sm text-slate-300 hover:text-action-buy transition-colors">
                                            Caza y Supervivencia
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-2 inline-block">Soporte</h3>
                                <ul role="list" className="space-y-4">
                                    <li><Link href="/contacto" className="text-sm text-slate-300 hover:text-action-buy transition-colors">Contacto</Link></li>
                                    <li><Link href="/info/envios" className="text-sm text-slate-300 hover:text-action-buy transition-colors">Información de Envíos</Link></li>
                                    <li><Link href="/info/devoluciones" className="text-sm text-slate-300 hover:text-action-buy transition-colors">Cambios y Devoluciones</Link></li>
                                    <li><Link href="/info/legal" className="text-sm text-slate-300 hover:text-action-buy transition-colors">Términos Legales</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-1 md:gap-8">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-2 inline-block">Atención al Cliente</h3>
                                <ul role="list" className="space-y-6">
                                    <li className="flex items-start gap-3 text-sm text-slate-300">
                                        <MapPin className="h-5 w-5 shrink-0 text-action-buy" />
                                        <span>San Carlos, Chile</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-300">
                                        <Phone className="h-5 w-5 shrink-0 text-action-buy" />
                                        <span>+56 9 7815 5169</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-300">
                                        <Mail className="h-5 w-5 shrink-0 text-action-buy" />
                                        <span>facchilespa@gmail.com</span>
                                    </li>
                                </ul>
                                
                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Medios de Pago</p>
                                    <img 
                                        src="/images/logowebpay-plus.png" 
                                        alt="Webpay Plus" 
                                        className="h-10 w-auto opacity-70 grayscale brightness-0 invert"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs leading-5 text-slate-400">
                        &copy; 2026 Facchile SpA. Todos los derechos reservados.
                    </p>
                    <p className="text-xs leading-5 text-slate-500 italic relative z-50 group">
                        Plataforma ecommerce desarrollada por <a href="https://www.claudioaguilera.cl" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-brand-primary transition-all duration-300 font-bold underline decoration-slate-600 hover:decoration-brand-primary pointer-events-auto cursor-pointer inline-block">Claudio Aguilera</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
