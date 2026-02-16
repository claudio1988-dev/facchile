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

            <div className="pt-[142px] md:pt-[152px] lg:pt-[162px] flex-1">
                <div className="bg-[#f4f4f4] py-8 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 mb-8">
                     <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                         <Heading
                             title="Configuración"
                             description="Administra tu perfil y configuración de cuenta"
                         />
                     </div>
                 </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="flex flex-col lg:flex-row lg:space-x-12">
                        <aside className="w-full max-w-xl lg:w-64 mb-8 lg:mb-0">
                            <nav
                                className="flex flex-col space-y-1"
                                aria-label="Settings"
                            >
                                {sidebarNavItems.map((item, index) => (
                                    <Button
                                        key={`${toUrl(item.href)}-${index}`}
                                        variant="ghost"
                                        asChild
                                        className={cn('w-full justify-start text-left', {
                                            'bg-slate-100 dark:bg-slate-800 font-bold': isCurrentUrl(item.href),
                                            'hover:bg-slate-50 dark:hover:bg-slate-900': !isCurrentUrl(item.href),
                                        })}
                                    >
                                        <Link href={item.href}>
                                            {item.icon && (
                                                <item.icon className="h-4 w-4 mr-2" />
                                            )}
                                            {item.title}
                                        </Link>
                                    </Button>
                                ))}
                            </nav>
                        </aside>

                        <div className="flex-1 md:max-w-2xl">
                            <section className="max-w-xl space-y-12 bg-white dark:bg-black p-6 rounded-lg border border-slate-200 dark:border-slate-800">
                                {children}
                            </section>
                        </div>
                    </div>
                </div>
             </div>

            <Footer />
            <WhatsAppFloating />
        </div>
    );
}
