import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function WhatsAppFloating() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    const phoneNumber = '+56978155169'; // WhatsApp real de Facchile Outdoor
    const businessName = 'Facchile Outdoor';

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const encodedMessage = encodeURIComponent(message || 'Hola, me gustaría recibir más información.');
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        setIsOpen(false);
        setMessage('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end pointer-events-none">
            {/* Chat Modal */}
            <div
                className={cn(
                    "mb-4 w-[350px] overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-in-out dark:bg-[#1C1C1A] pointer-events-auto",
                    isOpen 
                        ? "translate-y-0 opacity-100 scale-100" 
                        : "translate-y-10 opacity-0 scale-95 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="bg-brand-primary p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="h-10 w-10 flex-none rounded-full bg-white/20 p-1">
                                    <img 
                                        src="/logo.png" 
                                        alt="Logo" 
                                        className="h-full w-full object-contain brightness-0 invert" 
                                    />
                                </div>
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-brand-primary bg-green-500"></span>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold">{businessName}</h3>
                                <p className="text-xs text-white/80">En línea</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="rounded-full p-1 hover:bg-white/10 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="relative h-48 bg-slate-50 p-4 dark:bg-[#161615]">
                    <div className="inline-block rounded-2xl rounded-tl-none bg-white p-3 text-sm text-slate-700 shadow-sm dark:bg-[#2C2C2A] dark:text-slate-300">
                        <p className="font-medium mb-1">¡Hola! 👋</p>
                        <p>¿En qué podemos ayudarte hoy? Estamos listos para asesorarte en tu próxima aventura.</p>
                        <span className="mt-1 block text-[10px] text-slate-400">9:00 AM</span>
                    </div>
                    
                    {/* Decorative background pattern could go here */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                </div>

                {/* Footer / Input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-[#1C1C1A]">
                    <div className="relative">
                        <Input
                            placeholder="Escribe tu mensaje..."
                            className="pr-10 bg-slate-100 focus:bg-white dark:bg-slate-900"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button 
                            type="submit"
                            className="absolute right-2 top-1.5 p-1 text-brand-primary hover:text-action-buy transition-colors"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                    <p className="mt-2 text-center text-[10px] text-slate-400">
                        Al hacer clic, serás redirigido a WhatsApp.
                    </p>
                </form>
            </div>

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 relative pointer-events-auto",
                    isOpen 
                        ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200" 
                        : "bg-[#25D366] text-white"
                )}
            >
                {isOpen ? (
                    <X className="h-8 w-8" />
                ) : (
                    <svg 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="h-10 w-10"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                )}
                
                {/* Notification Badge - Repositioned and Styled */}
                {!isOpen && (
                    <span className="absolute top-0 right-0 flex h-6 w-6 transform translate-x-1/4 -translate-y-1/4">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-highlight text-[11px] text-white font-black shadow-lg border-2 border-white dark:border-[#0a0a0a]">
                            1
                        </span>
                    </span>
                )}
            </button>
        </div>
    );
}
