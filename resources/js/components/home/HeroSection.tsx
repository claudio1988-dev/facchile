import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
    return (
        <section className="relative h-[calc(100vh-142px)] md:h-[calc(100vh-152px)] lg:h-[calc(100vh-162px)] min-h-[600px] w-full overflow-hidden bg-slate-900">
            {/* Background Video */}
            <div className="absolute inset-0">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="h-full w-full object-cover opacity-100"
                >
                    <source src="/videofondo2.mp4" type="video/mp4" />
                    Tu navegador no soporta videos HTML5.
                </video>
            </div>



            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/30 to-transparent" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-24 text-center text-white sm:px-6 lg:px-8 mx-auto max-w-7xl">
                <h1 className="animate-fade-in-up mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-center">
                    <span className="block text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">Expertos en</span>
                    <span className="block text-action-buy drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Caza y Pesca Deportiva</span>
                </h1>
                <p className="animate-fade-in-up delay-100 mb-8 max-w-2xl text-xl text-slate-200 text-center">
                    Equipamiento especializado en caza, pesca y camping. 
                    Cumplimiento normativo garantizado y envíos a todo el país.
                </p>
                <div className="animate-fade-in-up delay-200 flex flex-col gap-4 sm:flex-row justify-center">
                    <Button asChild size="lg" className="bg-action-buy text-white hover:bg-action-hover">
                        <Link href="/catalogo">Explorar Catálogo</Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg" className="bg-white text-slate-900 hover:bg-gray-100">
                        <Link href="/ofertas">Ver Ofertas</Link>
                    </Button>
                </div>
                
                {/* Trust Badges */}
                <div className="animate-fade-in-up delay-300 mt-12 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-300">
                    <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Empresa Chilena</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Compra Segura</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span>Verificación de Edad</span>
                    </div>
                    <div className="flex items-center gap-2 border-l border-white/20 pl-6 ml-2">
                        <img 
                            src="/images/logowebpay-plus.png" 
                            alt="Webpay Plus" 
                            className="h-10 w-auto brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                        />
                    </div>
                </div>

                {/* Brand Logos (Clean version) */}
                <div className="animate-fade-in-up delay-400 mt-20 w-full text-center">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-8 font-medium">Trabajamos con las mejores marcas</p>
                    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-30 grayscale brightness-200">
                        {['Gamo', 'Shimano', 'Doite', 'Lippi', 'Victorinox', 'Rapala'].map((brand) => (
                            <div key={brand} className="h-6 flex items-center transition-all hover:opacity-100 hover:grayscale-0 cursor-default">
                                <span className="text-lg font-bold italic tracking-tighter text-white/70">{brand}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// Add Tailwind Custom Animation if not present in tailwind.config.js
// @keyframes fade-in-up {
//   0% { opacity: 0; transform: translateY(20px); }
//   100% { opacity: 1; transform: translateY(0); }
// }
// .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
