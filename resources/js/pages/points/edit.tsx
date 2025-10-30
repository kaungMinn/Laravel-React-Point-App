
// resources/js/Pages/Points/Create.tsx

import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import PointForm, { PointType } from '@/forms/point-form';


// Define types for the users list passed from the controller
interface UserOption {
    id: number;
    name: string;
}

interface PointsEditProps extends PageProps {
    users: UserOption[];
    defaultActionType: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Points', href: route('points.index') },
    { title: 'Edit', href: route('points.edit', 0) },
];

export default function PointsUpdate({ point, users, defaultActionType }: PointsEditProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className='flex items-center justify-center w-full h-full bg-gray-200'>
                <Head title="Edit Point Record" />

                <PointForm point={point as PointType} users={users} defaultActionType={defaultActionType} />
            </div>
        </AppLayout>
    );
}