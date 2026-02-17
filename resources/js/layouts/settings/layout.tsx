import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit } from '@/routes/profile';
import { edit as editPassword } from '@/routes/user-password';
import type { NavItem } from '@/types';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import { Head } from '@inertiajs/react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Perfil',
        href: edit(),
        icon: null,
    },
    {
        title: 'Contraseña',
        href: editPassword(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentUrl } = useCurrentUrl();

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col">
            <Head title="Configuración | Facchile Outdoor" />
            <Header />

            <div className="pt-[142px] md:pt-[152px] lg:pt-[162px] flex-1 bg-slate-50/50 dark:bg-[#0a0a0a]">
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-brand-primary rounded-full" />
                            Configuración
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Administra tu perfil y seguridad de la cuenta
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:space-x-8">
                        <aside className="w-full lg:w-48 mb-6 lg:mb-0">
                            <nav
                                className="flex flex-col space-y-0.5"
                                aria-label="Settings"
                            >
                                {sidebarNavItems.map((item, index) => (
                                    <Button
                                        key={`${toUrl(item.href)}-${index}`}
                                        variant="ghost"
                                        asChild
                                        className={cn('w-full justify-start text-xs h-9 px-3', {
                                            'bg-brand-primary/10 text-brand-primary font-bold': isCurrentUrl(item.href),
                                            'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800': !isCurrentUrl(item.href),
                                        })}
                                    >
                                        <Link href={item.href}>
                                            {item.icon && (
                                                <item.icon className="h-3.5 w-3.5 mr-2" />
                                            )}
                                            {item.title}
                                        </Link>
                                    </Button>
                                ))}
                            </nav>
                        </aside>

                        <div className="flex-1 max-w-4xl">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                                <div className="p-6 md:p-8">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>

            <Footer />
            <WhatsAppFloating />
        </div>
    );
}
