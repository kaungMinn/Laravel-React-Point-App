import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import PointForm from '@/forms/point-form';

export interface UserOption {
    id: number;
    name: string;
}

interface PointsCreateProps extends PageProps {
    users: UserOption[];
    defaultActionType: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Points', href: route('points.index') },
    { title: 'Create', href: route('points.create') },
];

export default function PointsCreate({ users, defaultActionType }: PointsCreateProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className='flex items-center justify-center w-full h-full bg-gray-200'>
                <Head title="Create Point Record" />
                <PointForm users={users} defaultActionType={defaultActionType} />
            </div>
        </AppLayout>
    );
}