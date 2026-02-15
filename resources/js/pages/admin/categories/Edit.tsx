
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { BreadcrumbItem } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ParentCategory {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    parent_id: number | null;
}

interface Props {
    category: Category;
    parents: ParentCategory[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Panel Administrativo', href: '/adminfacchile' },
    { title: 'Categorías', href: '/adminfacchile/categories' },
    { title: 'Editar', href: '#' },
];

export default function Edit({ category, parents }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        parent_id: category.parent_id?.toString() || '',
    });

    const handleNameChange = (value: string) => {
        const slug = value
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
        setData((prev) => ({ ...prev, name: value, slug }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/adminfacchile/categories/${category.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Categoría - Panel Administrativo" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Editar Categoría</h1>
                        <p className="text-muted-foreground">Modifica los detalles de la categoría</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información General</CardTitle>
                            <CardDescription>Detalles básicos de la categoría</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="parent_id">Categoría Padre (Opcional)</Label>
                                    <Select 
                                        onValueChange={(value) => setData('parent_id', value === "none" ? "" : value)}
                                        value={data.parent_id || "none"}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar categoría padre" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Ninguna (Categoría Principal)</SelectItem>
                                            {parents.map((parent) => (
                                                <SelectItem key={parent.id} value={parent.id.toString()}>
                                                    {parent.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.parent_id && <p className="text-sm text-destructive">{errors.parent_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="Ej: Rifles PCP"
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="ej: rifles-pcp"
                                    />
                                    {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Descripción</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Descripción breve de la categoría..."
                                    />
                                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Link href="/adminfacchile/categories">
                                        <Button variant="outline" type="button">Cancelar</Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>Actualizar Categoría</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
