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
    const errors = page.props.errors;

    // Assuming 'flash' and 'errors' are pulled directly from Inertia's usePage() hook
    useEffect(() => {
        // 1. Handle SUCCESS Flash Message
        if (flash?.success) {
            toast.success(flash.success);

            // Clear the flash message from state
            router.reload({ only: ['flash'] });
        }

        // 2. Handle CUSTOM ERROR Flash Message (from Redirect::route()->with('error', '...'))
        if (flash?.error) {
            toast.error(flash.error);

            // Clear the flash message from state
            router.reload({ only: ['flash'] });
        }
        if (Object.keys(errors).length > 0) {
            console.log(errors)
            toast.error(errors[0], {
            });


        }

    }, [flash, errors]);
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    );
}
