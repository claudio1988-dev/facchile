import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { UserPlus, Mail, Lock, User as UserIcon, ArrowRight, Gift, Star, TrendingUp } from 'lucide-react';

export default function Register() {
    return (
        <>
            <Head title="Crear Cuenta | Facchile Outdoor" />

            <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
                <Header />

                {/* Main Content - Two Column Layout */}
                <main className="pt-20">
                    <div className="min-h-[calc(100vh-80px)] lg:grid lg:grid-cols-2">
                        {/* Left Column - Hero Image/Content */}
                        <div className="relative hidden lg:flex lg:flex-col lg:justify-center bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            
                            {/* Hero Image */}
                            <div className="absolute inset-0">
                                <img 
                                    src="https://images.unsplash.com/photo-1445308394109-4ec2920981b1?q=80&w=2073&auto=format&fit=crop"
                                    alt="Camping Adventure"
                                    className="h-full w-full object-cover opacity-30"
                                />
                            </div>

                            {/* Content Overlay */}
                            <div className="relative z-10 px-12 py-16">
                                <div className="mb-8">
                                    <img 
                                        src="/logo.png" 
                                        alt="Facchile Logo" 
                                        className="h-16 w-auto brightness-0 invert drop-shadow-lg"
                                    />
                                </div>
                                
                                <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                                    Únete a la<br />comunidad outdoor
                                </h1>
                                
                                <p className="text-xl text-white/90 mb-12 max-w-md">
                                    Crea tu cuenta y accede a beneficios exclusivos, 
                                    ofertas especiales y el mejor equipamiento.
                                </p>

                                {/* Benefits */}
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                            <Gift className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Descuentos Exclusivos</h3>
                                            <p className="text-white/80">Ofertas especiales solo para miembros</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                            <Star className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Programa de Puntos</h3>
                                            <p className="text-white/80">Acumula puntos en cada compra</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                            <TrendingUp className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Acceso Prioritario</h3>
                                            <p className="text-white/80">Sé el primero en conocer nuevos productos</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="mt-12 grid grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-white">15K+</div>
                                        <div className="text-sm text-white/80">Clientes</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-white">500+</div>
                                        <div className="text-sm text-white/80">Productos</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-white">98%</div>
                                        <div className="text-sm text-white/80">Satisfacción</div>
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                                <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"></div>
                            </div>
                        </div>

                        {/* Right Column - Register Form */}
                        <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
                            <div className="w-full max-w-md space-y-8">
                                {/* Mobile Logo */}
                                <div className="lg:hidden text-center mb-8">
                                    <img 
                                        src="/logo.png" 
                                        alt="Facchile Logo" 
                                        className="h-12 w-auto mx-auto mb-4"
                                    />
                                </div>

                                {/* Header */}
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold tracking-tight text-brand-primary dark:text-white">
                                        Crea tu cuenta
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                        Únete a nosotros en menos de 2 minutos
                                    </p>
                                </div>

                                {/* Register Form */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                                    <Form
                                        {...store.form()}
                                        resetOnSuccess={['password', 'password_confirmation']}
                                        disableWhileProcessing
                                        className="space-y-5"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                {/* Name Field */}
                                                <div className="space-y-2">
                                                    <Label 
                                                        htmlFor="name" 
                                                        className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                                                    >
                                                        Nombre Completo
                                                    </Label>
                                                    <div className="relative">
                                                        <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                                        <Input
                                                            id="name"
                                                            type="text"
                                                            name="name"
                                                            required
                                                            autoFocus
                                                            tabIndex={1}
                                                            autoComplete="name"
                                                            placeholder="Juan Pérez"
                                                            className="pl-10 h-11 border-slate-300 focus:border-action-buy focus:ring-action-buy dark:border-slate-700 transition-all"
                                                        />
                                                    </div>
                                                    <InputError message={errors.name} />
                                                </div>

                                                {/* Email Field */}
                                                <div className="space-y-2">
                                                    <Label 
                                                        htmlFor="email" 
                                                        className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                                                    >
                                                        Correo Electrónico
                                                    </Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            name="email"
                                                            required
                                                            tabIndex={2}
                                                            autoComplete="email"
                                                            placeholder="tu@email.com"
                                                            className="pl-10 h-11 border-slate-300 focus:border-action-buy focus:ring-action-buy dark:border-slate-700 transition-all"
                                                        />
                                                    </div>
                                                    <InputError message={errors.email} />
                                                </div>

                                                {/* Password Field */}
                                                <div className="space-y-2">
                                                    <Label 
                                                        htmlFor="password"
                                                        className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                                                    >
                                                        Contraseña
                                                    </Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                                        <Input
                                                            id="password"
                                                            type="password"
                                                            name="password"
                                                            required
                                                            tabIndex={3}
                                                            autoComplete="new-password"
                                                            placeholder="Mínimo 8 caracteres"
                                                            className="pl-10 h-11 border-slate-300 focus:border-action-buy focus:ring-action-buy dark:border-slate-700 transition-all"
                                                        />
                                                    </div>
                                                    <InputError message={errors.password} />
                                                </div>

                                                {/* Confirm Password Field */}
                                                <div className="space-y-2">
                                                    <Label 
                                                        htmlFor="password_confirmation"
                                                        className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                                                    >
                                                        Confirmar Contraseña
                                                    </Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                                        <Input
                                                            id="password_confirmation"
                                                            type="password"
                                                            name="password_confirmation"
                                                            required
                                                            tabIndex={4}
                                                            autoComplete="new-password"
                                                            placeholder="Repite tu contraseña"
                                                            className="pl-10 h-11 border-slate-300 focus:border-action-buy focus:ring-action-buy dark:border-slate-700 transition-all"
                                                        />
                                                    </div>
                                                    <InputError message={errors.password_confirmation} />
                                                </div>

                                                {/* Submit Button */}
                                                <Button
                                                    type="submit"
                                                    className="h-12 w-full bg-action-buy hover:bg-action-hover text-white font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] mt-6"
                                                    tabIndex={5}
                                                    data-test="register-user-button"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <Spinner />
                                                            <span className="ml-2">Creando cuenta...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Crear Cuenta Gratis</span>
                                                            <ArrowRight className="ml-2 h-5 w-5" />
                                                        </>
                                                    )}
                                                </Button>
                                            </>
                                        )}
                                    </Form>

                                    {/* Login Link */}
                                    <div className="mt-6 text-center">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            ¿Ya tienes una cuenta?{' '}
                                            <Link
                                                href={login()}
                                                className="font-semibold text-action-buy hover:text-action-hover transition-colors"
                                                tabIndex={6}
                                            >
                                                Inicia sesión
                                            </Link>
                                        </p>
                                    </div>
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-3 gap-4 pt-8">
                                    <div className="text-center">
                                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                                            <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">100% Gratis</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                                            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Datos Seguros</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950">
                                            <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Activación Instantánea</p>
                                    </div>
                                </div>

                                {/* Terms */}
                                <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                                    Al crear una cuenta, aceptas nuestros{' '}
                                    <Link href="/info/legal" className="text-action-buy hover:underline">
                                        Términos y Condiciones
                                    </Link>
                                    {' '}y{' '}
                                    <Link href="/info/privacidad" className="text-action-buy hover:underline">
                                        Política de Privacidad
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
                <WhatsAppFloating />
            </div>
        </>
    );
}
