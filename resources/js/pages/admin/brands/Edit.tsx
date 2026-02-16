import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Trash2 } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Brand {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    brand: Brand;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Panel Administrativo', href: '/adminfacchile' },
    { title: 'Marcas', href: '/adminfacchile/brands' },
    { title: 'Editar Marca', href: '#' },
];

export default function Edit({ brand }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: brand.name,
        slug: brand.slug,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/adminfacchile/brands/${brand.id}`);
    };

    const handleDelete = () => {
        if (confirm('¿Estás seguro de que deseas eliminar esta marca?')) {
            router.delete(`/adminfacchile/brands/${brand.id}`);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
        
        setData((previousData) => ({
            ...previousData,
            name: name,
            slug: slug
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${brand.name} - Panel Administrativo`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/adminfacchile/brands">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Editar Marca</h1>
                            <p className="text-muted-foreground">
                                Modificando: {brand.name}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles de la Marca</CardTitle>
                            <CardDescription>
                                Actualiza los detalles de la marca.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={handleNameChange}
                                        placeholder="Ej. Nike"
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (URL)</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="Ej. nike"
                                        required
                                    />
                                    {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                                </div>

                                <div className="flex justify-between items-center pt-4">
                                    <Button type="button" variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
                                        <Trash2 className="size-4" />
                                        Eliminar Marca
                                    </Button>
                                    <div className="flex gap-2">
                                        <Link href="/adminfacchile/brands">
                                            <Button type="button" variant="outline">Cancelar</Button>
                                        </Link>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Actualizando...' : 'Actualizar Marca'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
