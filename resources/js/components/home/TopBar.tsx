import { Truck, ShieldCheck, Clock, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopBarProps {
    isTransparent?: boolean;
}

export default function TopBar({ isTransparent }: TopBarProps) {
    return (
        <div className={cn(
            "w-full transition-all duration-300 border-b",
            isTransparent 
                ? "bg-gradient-to-r from-white/20 via-white/10 to-white/20 backdrop-blur-md border-white/20 text-white" 
                : "bg-gradient-to-r from-slate-50 via-white to-slate-50 border-slate-200 text-slate-600 shadow-sm"
        )}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-8 items-center justify-between text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
                    <div className="flex items-center gap-1 sm:gap-6 h-full">
                        <div className="flex items-center gap-2 group cursor-default">
                            <Truck className="h-3.5 w-3.5 text-brand-primary animate-pulse" />
                            <span className="group-hover:text-brand-primary transition-colors">Despacho Nacional</span>
                        </div>
                        <div className={cn("hidden md:flex h-4 w-[1px]", isTransparent ? "bg-white/20" : "bg-slate-300")} />
                        <div className="hidden md:flex items-center gap-2 group cursor-default">
                            <ShieldCheck className="h-3.5 w-3.5 text-brand-primary" />
                            <span className="group-hover:text-brand-primary transition-colors">Garantía Facchile</span>
                        </div>
                        <div className={cn("hidden lg:flex h-4 w-[1px]", isTransparent ? "bg-white/20" : "bg-slate-300")} />
                        <div className="hidden lg:flex items-center gap-2 group cursor-default">
                            <ShieldCheck className="h-3.5 w-3.5 text-brand-primary" />
                            <span className="group-hover:text-brand-primary transition-colors">Compra 100% Segura</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 sm:gap-6 h-full">
                        <div className={cn(
                            "hidden sm:flex items-center gap-2 group cursor-default px-3 py-1 rounded-full border",
                            isTransparent ? "bg-white/10 border-white/20" : "bg-slate-100 border-slate-200"
                        )}>
                            <Clock className="h-3 w-3 text-brand-primary" />
                            <span className="text-[10px]">L-V 09:00 - 18:30</span>
                        </div>
                        <div className={cn("h-4 w-[1px] hidden sm:block", isTransparent ? "bg-white/20" : "bg-slate-300")} />
                        <a href="tel:+56912345678" className={cn(
                            "flex items-center gap-2 group transition-all duration-300",
                            isTransparent ? "hover:text-white" : "hover:text-brand-primary"
                        )}>
                            <div className="flex items-center justify-center p-1.5 rounded-full bg-brand-primary/10 group-hover:bg-brand-primary/20 transition-colors">
                                <Phone className="h-3.5 w-3.5 text-brand-primary" />
                            </div>
                            <span className={cn(
                                "hidden sm:inline font-black tracking-normal text-xs",
                                isTransparent ? "text-white" : "text-slate-800"
                            )}>+56 9 1234 5678</span>
                            <span className="inline sm:hidden">Llamar</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
