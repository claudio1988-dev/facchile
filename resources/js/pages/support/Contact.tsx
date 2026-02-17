import { Head } from '@inertiajs/react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function Contact() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a]">
            <Head title="Contacto | Facchile SPA" />
            <Header />

            <main className="pt-[160px] md:pt-[180px] lg:pt-[200px] pb-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl font-extrabold tracking-tight text-text-main dark:text-white sm:text-5xl">
                            Estamos aquí para ayudarte
                        </h1>
                        <p className="mt-4 text-lg text-text-muted dark:text-slate-400">
                            ¿Tienes dudas sobre algún equipo o necesitas asesoría técnica? Contáctanos y nuestro equipo de expertos te responderá a la brevedad.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white dark:bg-[#1C1C1A] p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
                            <h2 className="text-2xl font-bold text-text-main dark:text-white mb-6">Envíanos un mensaje</h2>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-main dark:text-white">Nombre Completo</label>
                                        <Input placeholder="Tu nombre" className="bg-slate-50 dark:bg-slate-900" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-main dark:text-white">Correo Electrónico</label>
                                        <Input type="email" placeholder="ejemplo@correo.com" className="bg-slate-50 dark:bg-slate-900" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-main dark:text-white">Asunto</label>
                                    <Input placeholder="¿En qué podemos ayudarte?" className="bg-slate-50 dark:bg-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-main dark:text-white">Mensaje</label>
                                    <textarea 
                                        rows={4} 
                                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary dark:border-slate-800 dark:bg-slate-900"
                                        placeholder="Escribe aquí tu consulta..."
                                    ></textarea>
                                </div>
                                <Button className="w-full bg-brand-primary h-12 text-lg font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all">
                                    <Send className="mr-2 h-5 w-5" /> Enviar Mensaje
                                </Button>
                            </form>
                        </div>

                        {/* Contact Info & Map */}
                        <div className="space-y-8 flex flex-col">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-brand-secondary/5 dark:bg-white/5 p-6 rounded-2xl border border-brand-secondary/10">
                                    <div className="h-10 w-10 bg-brand-primary rounded-xl flex items-center justify-center text-white mb-4">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-text-main dark:text-white">Teléfono</h3>
                                    <p className="text-sm text-text-muted dark:text-slate-400 mt-1">+56 9 7815 5169</p>
                                </div>
                                <div className="bg-brand-secondary/5 dark:bg-white/5 p-6 rounded-2xl border border-brand-secondary/10">
                                    <div className="h-10 w-10 bg-brand-primary rounded-xl flex items-center justify-center text-white mb-4">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-text-main dark:text-white">Email</h3>
                                    <p className="text-sm text-text-muted dark:text-slate-400 mt-1">facchilespa@gmail.com</p>
                                </div>
                            </div>

                            <div className="bg-brand-secondary/5 dark:bg-white/5 p-6 rounded-2xl border border-brand-secondary/10">
                                <div className="h-10 w-10 bg-brand-primary rounded-xl flex items-center justify-center text-white mb-4">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-text-main dark:text-white">Ubicación</h3>
                                <p className="text-sm text-text-muted dark:text-slate-400 mt-1">San Carlos, Región del Ñuble</p>
                                <p className="text-sm text-text-muted dark:text-slate-400">Chile</p>
                            </div>

                            {/* Simple "Map" Placeholder */}
                            <div className="flex-1 min-h-[250px] bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden relative group">
                                <img 
                                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800" 
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-700 opacity-60"
                                    alt="Ubicación"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white dark:bg-[#1C1C1A] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
                                        <MapPin className="text-brand-primary h-5 w-5" />
                                        <span className="font-bold text-sm text-text-main dark:text-white">Ver en Google Maps</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <WhatsAppFloating />
        </div>
    );
}
