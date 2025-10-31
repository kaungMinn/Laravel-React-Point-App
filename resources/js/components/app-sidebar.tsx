import { NavFooter } from '@/components/nav-footer';
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
import { dashboard, } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Award, BookOpen, Folder, LayoutGrid, ShieldCheck, User } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        // ✅ Works because Ziggy often exports individual functions for convenience
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Leaderboard',
        // 🛠️ FIX: Use the standard route helper with the named route
        href: '/leaderboard',
        icon: Award
    },
    {
        title: 'Users',
        // 🛠️ FIX: Use the standard route helper
        href: '/users',
        icon: User
    },
    {
        title: 'Points',
        // 🛠️ FIX: Use the standard route helper
        href: '/points',
        icon: ShieldCheck
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },

];

export function AppSidebar() {
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
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
