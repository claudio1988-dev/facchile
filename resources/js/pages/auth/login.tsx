import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Lock, Mail, ArrowRight, Shield, Zap, Award } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Iniciar Sesión | Facchile Outdoor" />

            <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
                <Header />

                {/* Main Content - Two Column Layout */}
                <main className="pt-[142px] md:pt-[152px] lg:pt-[162px]">
                    <div className="min-h-[calc(100vh-142px)] md:min-h-[calc(100vh-152px)] lg:min-h-[calc(100vh-162px)] lg:grid lg:grid-cols-2">
                        {/* Left Column - Hero Image/Content */}
                        <div className="relative hidden lg:flex lg:flex-col lg:justify-center bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            
                            {/* Hero Image */}
                            <div className="absolute inset-0">
                                <img 
                                    src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070&auto=format&fit=crop"
                                    alt="Outdoor Adventure"
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
                                    Tu aventura<br />comienza aquí
                                </h1>
                                
                                <p className="text-xl text-white/90 mb-12 max-w-md">
                                    Accede a equipamiento premium para caza, pesca y outdoor. 
                                    Calidad profesional, servicio excepcional.
                                </p>

                                {/* Features */}
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                            <Shield className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Compra Segura</h3>
                                            <p className="text-white/80">Protección total en cada transacción</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                            <Zap className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Envío Express</h3>
                                            <p className="text-white/80">Despacho rápido a todo Chile</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                            <Award className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Calidad Premium</h3>
                                            <p className="text-white/80">Productos certificados y garantizados</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                                <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-action-buy/20 rounded-full blur-2xl"></div>
                            </div>
                        </div>

                        {/* Right Column - Login Form */}
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
                                        Bienvenido de vuelta
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                        Ingresa a tu cuenta para continuar
                                    </p>
                                </div>

                                {/* Status Message */}
                                {status && (
                                    <div className="rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-600 dark:bg-green-950/30 dark:text-green-400">
                                        {status}
                                    </div>
                                )}

                                {/* Login Form */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                                    <Form
                                        {...store.form()}
                                        resetOnSuccess={['password']}
                                        className="space-y-6"
                                    >
                                        {({ processing, errors }) => (
                                            <>
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
                                                            autoFocus
                                                            tabIndex={1}
                                                            autoComplete="email"
                                                            placeholder="tu@email.com"
                                                            className="pl-10 h-12 border-slate-300 focus:border-action-buy focus:ring-action-buy dark:border-slate-700 transition-all"
                                                        />
                                                    </div>
                                                    <InputError message={errors.email} />
                                                </div>

                                                {/* Password Field */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label 
                                                            htmlFor="password"
                                                            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                                                        >
                                                            Contraseña
                                                        </Label>
                                                        {canResetPassword && (
                                                            <Link
                                                                href={request()}
                                                                className="text-sm font-medium text-action-buy hover:text-action-hover transition-colors"
                                                                tabIndex={5}
                                                            >
                                                                ¿Olvidaste tu contraseña?
                                                            </Link>
                                                        )}
                                                    </div>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                                        <Input
                                                            id="password"
                                                            type="password"
                                                            name="password"
                                                            required
                                                            tabIndex={2}
                                                            autoComplete="current-password"
                                                            placeholder="••••••••"
                                                            className="pl-10 h-12 border-slate-300 focus:border-action-buy focus:ring-action-buy dark:border-slate-700 transition-all"
                                                        />
                                                    </div>
                                                    <InputError message={errors.password} />
                                                </div>

                                                {/* Remember Me */}
                                                <div className="flex items-center space-x-3">
                                                    <Checkbox
                                                        id="remember"
                                                        name="remember"
                                                        tabIndex={3}
                                                        className="border-slate-300 data-[state=checked]:bg-action-buy data-[state=checked]:border-action-buy"
                                                    />
                                                    <Label 
                                                        htmlFor="remember"
                                                        className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
                                                    >
                                                        Mantener sesión iniciada
                                                    </Label>
                                                </div>

                                                {/* Submit Button */}
                                                <Button
                                                    type="submit"
                                                    className="h-12 w-full bg-action-buy hover:bg-action-hover text-white font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
                                                    tabIndex={4}
                                                    disabled={processing}
                                                >
                                                    {processing ? (
                                                        <>
                                                            <Spinner />
                                                            <span className="ml-2">Iniciando sesión...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Iniciar Sesión</span>
                                                            <ArrowRight className="ml-2 h-5 w-5" />
                                                        </>
                                                    )}
                                                </Button>
                                            </>
                                        )}
                                    </Form>

                                    {/* Register Link */}
                                    {canRegister && (
                                        <div className="mt-6 text-center">
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                ¿No tienes una cuenta?{' '}
                                                <Link
                                                    href={register()}
                                                    className="font-semibold text-action-buy hover:text-action-hover transition-colors"
                                                    tabIndex={5}
                                                >
                                                    Regístrate gratis
                                                </Link>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-3 gap-4 pt-8">
                                    <div className="text-center">
                                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                                            <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Seguro</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                                            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Rápido</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950">
                                            <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                            </svg>
                                        </div>
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Confiable</p>
                                    </div>
                                </div>

                                {/* Terms */}
                                <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                                    Al iniciar sesión, aceptas nuestros{' '}
                                    <Link href="/info/legal" className="text-action-buy hover:underline">
                                        Términos y Condiciones
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
