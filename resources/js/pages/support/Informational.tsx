import { Head } from '@inertiajs/react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Separator } from '@/components/ui/separator';

interface InformationalProps {
    slug: string;
}

const INFO_CONTENT: Record<string, { title: string; sections: { h: string; p: string }[] }> = {
    'envios': {
        title: 'Información de Envíos',
        sections: [
            { h: 'Tiempos de Entrega', p: 'Enviamos a todo Chile. Los tiempos de entrega oscilan entre 24 a 48 horas en la Región Metropolitana y de 3 a 5 días hábiles para el resto del país.' },
            { h: 'Costos de Envío', p: 'El costo se calcula automáticamente en el checkout dependiendo de tu ubicación y el peso de los productos. Ofrecemos retiro en tienda gratuito.' },
            { h: 'Seguimiento', p: 'Una vez procesado tu pedido, recibirás un número de seguimiento para monitorear tu paquete en tiempo real.' }
        ]
    },
    'despacho': {
        title: 'Zonas de Despacho',
        sections: [
            { h: 'Cobertura Nacional', p: 'Realizamos despachos a todo el territorio continental de Chile a través de nuestros partners logísticos.' },
            { h: 'Plazos de Entrega', p: 'RM: 1-2 días hábiles. Otras regiones: 3-7 días hábiles dependiendo de la localidad.' },
            { h: 'Costos', p: 'El valor del despacho varía según el peso, volumen y destino de la compra. Puedes simular el costo en tu carrito de compras antes de pagar.' }
        ]
    },
    'devoluciones': {
        title: 'Cambios y Devoluciones',
        sections: [
            { h: 'Garantía Legal', p: 'Tienes 6 meses de garantía legal si tu producto presenta fallas de fabricación.' },
            { h: 'Satisfacción Garantizada', p: 'Ofrecemos 10 días para cambios o devoluciones por satisfacción, siempre que el producto esté sellado y en su empaque original.' },
            { h: 'Proceso de Cambio', p: 'Debes presentar tu boleta o factura en nuestra sucursal o enviarnos el producto vía courier previa coordinación.' }
        ]
    },
    'garantias': {
        title: 'Políticas de Garantía',
        sections: [
            { h: 'Garantía Legal (3x3)', p: 'Si el producto falla, tienes 3 meses para exigir el cambio, reparación o devolución del dinero, presentando tu boleta.' },
            { h: 'Garantía del Fabricante', p: 'Muchos de nuestros productos cuentan con garantía extendida directa del fabricante. Consulta el manual de usuario para más detalles.' },
            { h: 'Exclusiones', p: 'La garantía no cubre daños por mal uso, intervención no autorizada o desgaste natural del producto.' }
        ]
    },
    'tracking': {
        title: 'Seguimiento de Pedido',
        sections: [
            { h: 'Rastrea tu Compra', p: 'Ingresa tu número de orden y correo electrónico para ver el estado de tu pedido. (Funcionalidad próximamente disponible)' },
            { h: '¿No tienes tu número?', p: 'Revisa el correo de confirmación que te enviamos al momento de comprar. Si no lo encuentras, contáctanos a soporte@facchile.cl.' }
        ]
    },
    'legal': {
        title: 'Términos Legales',
        sections: [
            { h: 'Términos y Condiciones', p: 'Al utilizar este sitio, aceptas nuestras políticas de uso y privacidad. Los precios y stock están sujetos a cambios sin previo aviso.' },
            { h: 'Venta de Armas de Aire', p: 'La compra de rifles de aire comprimido está permitida solo para mayores de 18 años. Se requiere validación de identidad al momento de la entrega.' },
            { h: 'Privacidad de Datos', p: 'Tus datos están protegidos bajo los más altos estándares de seguridad y solo se utilizan para procesar tu compra.' }
        ]
    }
};

export default function Informational({ slug }: InformationalProps) {
    const content = INFO_CONTENT[slug] || {
        title: 'Información',
        sections: [{ h: 'No encontrado', p: 'La página que buscas no existe o ha sido movida.' }]
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a]">
            <Head title={`${content.title} | Facchile Outdoor`} />
            <Header />

            <main className="pt-36 pb-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-[#1C1C1A] p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
                        <h1 className="text-3xl font-extrabold text-text-main dark:text-white mb-8 border-l-4 border-brand-primary pl-6">
                            {content.title}
                        </h1>

                        <div className="space-y-10">
                            {content.sections.map((section, idx) => (
                                <section key={idx}>
                                    <h2 className="text-xl font-bold text-text-main dark:text-slate-200 mb-4 tracking-tight">
                                        {section.h}
                                    </h2>
                                    <p className="text-text-muted dark:text-slate-400 leading-relaxed text-base">
                                        {section.p}
                                    </p>
                                    {idx !== content.sections.length - 1 && <Separator className="mt-10" />}
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <WhatsAppFloating />
        </div>
    );
}
