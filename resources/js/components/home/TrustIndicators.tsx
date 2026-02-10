import { ShieldCheck, Truck, Headphones } from 'lucide-react';

const features = [
    {
        name: 'Productos Certificados',
        description: 'Cumplimos con toda la normativa chilena para venta de armas de aire y artículos regulados.',
        icon: ShieldCheck,
    },
    {
        name: 'Envío a Todo Chile',
        description: 'Despachos seguros a todas las regiones, incluyendo zonas extremas via Starken y Chilexpress.',
        icon: Truck,
    },
    {
        name: 'Asesoría Experta',
        description: 'Nuestro equipo está formado por cazadores y pescadores experimentados listos para ayudarte.',
        icon: Headphones,
    },
];

export default function TrustIndicators() {
    return (
        <section className="bg-bg-body py-12 dark:bg-[#161615]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
                    {features.map((feature) => (
                        <div key={feature.name} className="tex-center flex flex-col items-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f9f9] text-highlight dark:bg-slate-800">
                                <feature.icon className="h-8 w-8" aria-hidden="true" />
                            </div>
                            <h3 className="mt-6 text-lg font-medium text-text-main dark:text-white">{feature.name}</h3>
                            <p className="mt-2 text-center text-base text-text-muted dark:text-slate-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
