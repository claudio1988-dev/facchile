export default function Heading({
    title,
    description,
    variant = 'default',
}: {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
}) {
    return (
        <header className={variant === 'small' ? 'mb-4' : 'mb-8 space-y-1'}>
            <h2
                className={
                    variant === 'small'
                        ? 'text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-white'
                        : 'text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white'
                }
            >
                {title}
            </h2>
            {description && (
                <p className={variant === 'small' ? 'text-xs text-slate-500 mt-0.5' : 'text-sm text-slate-500'}>
                    {description}
                </p>
            )}
        </header>
    );
}
