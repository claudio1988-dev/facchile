import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';
import Header from '@/components/home/Header';
import HeroSection from '@/components/home/HeroSection';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import TrustIndicators from '@/components/home/TrustIndicators';
import BrandShowcase from '@/components/home/BrandShowcase';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import Footer from '@/components/home/Footer';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import ModeToggle from '@/components/mode-toggle';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Home | Facchile Outdoor" />
            
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
                <Header />

                <main>
                    <HeroSection />
                    <div className="bg-bg-light">
                        <TrustIndicators />
                    </div>
                    <CategoryShowcase />
                    <FeaturedProducts />
                    <BrandShowcase />
                    <NewsletterSignup />
                </main>

                <Footer />
                <WhatsAppFloating />
            </div>
        </>
    );
}
