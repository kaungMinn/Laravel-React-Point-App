import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';
import toast from 'react-hot-toast';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

type FlashMessages = {
    success?: string;
    error?: string;
    warning?: string;
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const page = usePage();
    const flash = page.props.flash as FlashMessages;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);

            // 🛑 CRITICAL FIX: Clear the flash message 🛑
            // Reloads the current page, but only requests the 'flash' data.
            // This prevents the message from persisting in the browser history state.
            router.reload({
                only: ['flash'],
            });
        }

        if (flash?.error) {
            toast.error(flash.error);
            // Also clear errors
            router.reload({
                only: ['flash'],
            });
        }
    }, [flash])
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    );
}
