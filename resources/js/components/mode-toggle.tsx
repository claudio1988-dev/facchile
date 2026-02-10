import { Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ModeToggle({ className }: { className?: string }) {
    const { resolvedAppearance, updateAppearance } = useAppearance();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
            className={cn("h-9 w-9 rounded-md border border-slate-200 dark:border-slate-800", className)}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Cambiar tema</span>
        </Button>
    );
}
