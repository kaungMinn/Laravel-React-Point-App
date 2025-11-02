import React from 'react'
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import UserForm from '@/forms/user-form';


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Users', href: route('users.index') },
    { title: 'Create', href: route('users.create') },
];

const UserCreate = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className=' h-full w-full flex items-center justify-center bg-gray-200'>
                <Head title='Create User' />
                <UserForm />
            </div>
        </AppLayout>
    )
}

export default UserCreate