
import { cn } from '@/lib/utils';

export default function AppLogo({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center justify-start w-full overflow-hidden", className)}>
            <img 
                src="/logo.png" 
                alt="Facchile Logo" 
                className="h-10 w-auto object-contain object-left dark:brightness-0 dark:invert"
            />
        </div>
    );
}
