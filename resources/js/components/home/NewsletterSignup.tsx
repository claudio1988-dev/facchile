import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NewsletterSignup() {
    return (
        <section className="relative overflow-hidden bg-brand-primary py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Únete a la Aventura
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-200">
                        Suscríbete para recibir ofertas exclusivas, consejos de expertos y novedades sobre nuevos productos de caza y pesca.
                    </p>
                    <div className="mt-10 flex max-w-md gap-x-4 mx-auto">
                        <label htmlFor="email-address" className="sr-only">
                            Correo electrónico
                        </label>
                        <Input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="min-w-0 flex-auto rounded-md border-0 bg-white/10 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-slate-300 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                            placeholder="tucorreo@ejemplo.com"
                        />
                        <Button
                            type="submit"
                            className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-brand-primary shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Suscribirse
                        </Button>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-300">
                        Nos preocupamos por tus datos. Lee nuestra{' '}
                        <a href="#" className="font-semibold text-white hover:text-slate-100">
                            política de privacidad
                        </a>
                        .
                    </p>
                </div>
            </div>
        </section>
    );
}
