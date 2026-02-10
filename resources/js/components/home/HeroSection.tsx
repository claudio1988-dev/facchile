import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
    return (
        <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-slate-900">
            {/* Background Image */}
            <div className="absolute inset-0">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="h-full w-full object-cover opacity-40 grayscale-[0.2]"
                >
                    <source src="/videofondo1.mp4" type="video/mp4" />
                    Tu navegador no soporta videos HTML5.
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white sm:px-6 lg:px-8">
                <h1 className="animate-fade-in-up mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                    <span className="block text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">Tu Destino para</span>
                    <span className="block text-action-buy drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Aventuras Outdoor en Chile</span>
                </h1>
                <p className="animate-fade-in-up delay-100 mb-8 max-w-2xl text-xl text-slate-200">
                    Equipamiento especializado en caza, pesca y camping. 
                    Cumplimiento normativo garantizado y envíos a todo el país.
                </p>
                <div className="animate-fade-in-up delay-200 flex flex-col gap-4 sm:flex-row">
                    <Button asChild size="lg" className="bg-action-buy text-white hover:bg-action-hover">
                        <Link href="/catalogo">Explorar Catálogo</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900">
                        <Link href="/ofertas">Ver Ofertas</Link>
                    </Button>
                </div>
                
                {/* Trust Badges */}
                <div className="animate-fade-in-up delay-300 mt-12 flex items-center justify-center gap-6 text-sm font-medium text-slate-300">
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
