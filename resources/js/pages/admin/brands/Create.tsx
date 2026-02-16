import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Panel Administrativo', href: '/adminfacchile' },
    { title: 'Marcas', href: '/adminfacchile/brands' },
    { title: 'Nueva Marca', href: '#' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/adminfacchile/brands');
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
            <Head title="Nueva Marca - Panel Administrativo" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href="/adminfacchile/brands">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Nueva Marca</h1>
                        <p className="text-muted-foreground">
                            Registra una nueva marca en el sistema
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles de la Marca</CardTitle>
                            <CardDescription>
                                Ingresa el nombre y el identificador URL para la nueva marca.
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

                                <div className="flex justify-end gap-2 pt-4">
                                    <Link href="/adminfacchile/brands">
                                        <Button type="button" variant="outline">Cancelar</Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Guardando...' : 'Guardar Marca'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
