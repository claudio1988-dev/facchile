import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Package, Layers, Tag, ShoppingCart, Users, Truck } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem, SharedData } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Panel Admin',
        href: '/adminfacchile',
        icon: LayoutGrid,
    },
    {
        title: 'Productos',
        href: '/adminfacchile/products',
        icon: Package,
    },
    {
        title: 'Categorías',
        href: '/adminfacchile/categories',
        icon: Layers,
    },
    {
        title: 'Marcas',
        href: '/adminfacchile/brands',
        icon: Tag,
    },
    {
        title: 'Pedidos',
        href: '/adminfacchile/orders',
        icon: ShoppingCart,
    },
    {
        title: 'Clientes',
        href: '/adminfacchile/customers',
        icon: Users,
    },
    {
        title: 'Costos de Envío',
        href: '/adminfacchile/shipping-zones',
        icon: Truck,
    },
];



export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {auth.user.role === 'admin' && (
                    <NavMain items={adminNavItems} />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
