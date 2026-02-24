import { useMemo, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Search, Check } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    parent_id: number | null;
}

interface CategoryNode extends Category {
    children: CategoryNode[];
    depth: number;
}

interface Props {
    categories: Category[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
}

function buildTree(categories: Category[]): CategoryNode[] {
    const map = new Map<number, CategoryNode>();
    const roots: CategoryNode[] = [];

    categories.forEach(cat => {
        map.set(cat.id, { ...cat, children: [], depth: 0 });
    });

    map.forEach(node => {
        if (node.parent_id && map.has(node.parent_id)) {
            const parent = map.get(node.parent_id)!;
            node.depth = parent.depth + 1;
            parent.children.push(node);
        } else {
            roots.push(node);
        }
    });

    return roots;
}

function flattenTree(nodes: CategoryNode[]): CategoryNode[] {
    const result: CategoryNode[] = [];
    function walk(list: CategoryNode[]) {
        list.forEach(node => {
            result.push(node);
            if (node.children.length > 0) walk(node.children);
        });
    }
    walk(nodes);
    return result;
}

export default function CategoryTreeSelect({ categories, value, onChange, placeholder = 'Selecciona una categoría', error }: Props) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const ref = useRef<HTMLDivElement>(null);

    const tree = useMemo(() => buildTree(categories), [categories]);
    const flat = useMemo(() => flattenTree(tree), [tree]);

    const selected = useMemo(() => categories.find(c => c.id.toString() === value), [categories, value]);

    // Close on outside click
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Filter nodes by search
    const filtered = useMemo(() => {
        if (!search.trim()) return null; // null = show tree
        return flat.filter(n => n.name.toLowerCase().includes(search.toLowerCase()));
    }, [search, flat]);

    const toggleExpand = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpanded(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const selectNode = (node: CategoryNode) => {
        onChange(node.id.toString());
        setOpen(false);
        setSearch('');
    };

    // Build selected path label (e.g. "Pesca > Cañas de Pesca")
    const getPath = (id: number): string => {
        const parts: string[] = [];
        let current: Category | undefined = categories.find(c => c.id === id);
        while (current) {
            parts.unshift(current.name);
            current = current.parent_id ? categories.find(c => c.id === current!.parent_id) : undefined;
        }
        return parts.join(' › ');
    };

    function renderNode(node: CategoryNode) {
        const isExpanded = expanded.has(node.id);
        const hasChildren = node.children.length > 0;
        const isSelected = node.id.toString() === value;

        return (
            <div key={node.id}>
                <div
                    className={cn(
                        'flex items-center gap-1.5 px-3 py-2 cursor-pointer rounded-md text-sm transition-colors',
                        isSelected
                            ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                    style={{ paddingLeft: `${12 + node.depth * 20}px` }}
                    onClick={() => selectNode(node)}
                >
                    {hasChildren ? (
                        <span
                            className="shrink-0 text-slate-400 hover:text-slate-700"
                            onClick={(e) => toggleExpand(node.id, e)}
                        >
                            {isExpanded
                                ? <ChevronDown className="size-3.5" />
                                : <ChevronRight className="size-3.5" />}
                        </span>
                    ) : (
                        <span className="size-3.5 shrink-0" />
                    )}
                    <span className={cn('flex-1', node.depth === 0 && 'font-semibold text-slate-800 dark:text-white')}>
                        {node.name}
                    </span>
                    {isSelected && <Check className="size-3.5 text-brand-primary shrink-0" />}
                </div>
                {hasChildren && isExpanded && (
                    <div>
                        {node.children.map(child => renderNode(child))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button
                type="button"
                onClick={() => { setOpen(o => !o); if (!open) setSearch(''); }}
                className={cn(
                    'w-full flex items-center justify-between px-3 py-2 border rounded-md text-sm bg-white dark:bg-slate-950 transition-colors',
                    open ? 'border-brand-primary ring-1 ring-brand-primary' : 'border-slate-200 dark:border-slate-700',
                    error ? 'border-destructive' : ''
                )}
            >
                <span className={selected ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-400'}>
                    {selected ? getPath(selected.id) : placeholder}
                </span>
                <ChevronDown className={cn('size-4 text-slate-400 transition-transform', open && 'rotate-180')} />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md shadow-xl max-h-72 overflow-hidden flex flex-col">
                    {/* Search */}
                    <div className="p-2 border-b dark:border-slate-800">
                        <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 dark:bg-slate-900 rounded-md">
                            <Search className="size-3.5 text-slate-400 shrink-0" />
                            <input
                                autoFocus
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar categoría..."
                                className="flex-1 text-sm bg-transparent outline-none text-slate-800 dark:text-white placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto flex-1 p-1">
                        {filtered !== null ? (
                            filtered.length === 0 ? (
                                <p className="text-center py-4 text-xs text-slate-400">Sin resultados</p>
                            ) : (
                                filtered.map(node => (
                                    <div
                                        key={node.id}
                                        className={cn(
                                            'px-3 py-2 text-sm cursor-pointer rounded-md transition-colors',
                                            node.id.toString() === value
                                                ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                                                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                        )}
                                        onClick={() => selectNode(node)}
                                    >
                                        <span className="text-slate-400 text-xs mr-1">{getPath(node.parent_id ?? 0).split(' › ').slice(0, -1).join(' › ')}</span>
                                        {node.name}
                                    </div>
                                ))
                            )
                        ) : (
                            tree.map(node => renderNode(node))
                        )}
                    </div>
                </div>
            )}

            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        </div>
    );
}
