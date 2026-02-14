
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck, Clock, FileText, Upload } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Props {
    birth_date: string | null;
    isVerified: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Mi Cuenta', href: '/dashboard' },
    { title: 'Verificación de Identidad', href: '#' },
];

export default function Verifications({ birth_date, isVerified }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        birth_date: birth_date || '',
        rut: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/customer/verifications', {
            // onSuccess: () => reset(), // Don't reset to keep the entered data visible
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Verificación de Identidad" />

            <div className="container py-8 max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Verificación de Identidad</h1>
                    <p className="text-muted-foreground mt-2">
                        Para adquirir productos regulados (como rifles de aire o municiones), necesitamos verificar que eres mayor de edad según la ley chilena.
                    </p>
                </div>

                {isVerified ? (
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                        <ShieldCheck className="size-5" />
                        <AlertTitle className="ml-2 font-bold">¡Cuenta Verificada!</AlertTitle>
                        <AlertDescription className="ml-2">
                            Tu identidad ha sido confirmada. Tienes acceso completo para comprar productos restringidos.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
                        <Clock className="size-5" />
                        <AlertTitle className="ml-2 font-bold">Verificación Pendiente o Incompleta</AlertTitle>
                        <AlertDescription className="ml-2">
                            Sube tu Cédula de Identidad para desbloquear compras restringidas.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Verification Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Verificación Automática</CardTitle>
                            <CardDescription>Ingresa tu fecha de nacimiento y RUT para validar tu edad.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="rut">RUT</Label>
                                    <Input 
                                        id="rut"
                                        placeholder="12.345.678-9"
                                        value={data.rut}
                                        onChange={(e) => setData('rut', e.target.value)}
                                        readOnly={isVerified}
                                    />
                                    {errors.rut && <p className="text-sm text-destructive">{errors.rut}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
                                    <Input 
                                        id="birth_date"
                                        type="date"
                                        value={data.birth_date}
                                        onChange={(e) => setData('birth_date', e.target.value)}
                                        readOnly={isVerified}
                                    />
                                    {errors.birth_date && <p className="text-sm text-destructive">{errors.birth_date}</p>}
                                </div>

                                {!isVerified && (
                                    <Button type="submit" className="w-full" disabled={processing}>
                                        {processing ? 'Verificando...' : 'Verificar Edad'}
                                    </Button>
                                )}
                            </form>
                        </CardContent>
                    </Card>

                    {/* Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>¿Por qué necesitamos esto?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground">
                            <p>
                                De acuerdo con la legislación vigente, la venta de ciertos artículos deportivos y de caza requiere verificar la mayoría de edad del comprador.
                            </p>
                            <p>
                                Tus datos son utilizados únicamente para este proceso de validación y se almacenan de forma segura.
                            </p>
                            <div className="flex items-center gap-2 pt-4 text-primary">
                                <ShieldCheck className="size-5" />
                                <span className="font-medium">Validación Inmediata</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
