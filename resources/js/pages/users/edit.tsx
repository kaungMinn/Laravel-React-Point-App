import React from 'react'
import { PageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import UserForm from '@/forms/user-form';


type UserEditDataType = {
    id: string; // Keep this as string for now to match your prop definition
    name: string;
    email: string;
}

interface UserEditProps extends PageProps {
    user: UserEditDataType;
}

// 🛑 IMPORTANT: The breadcrumbs definition MUST be inside the component
// or a function that receives the 'user' prop to access 'user.id'.

const UserEdit = ({ user }: UserEditProps) => {

    // Define breadcrumbs INSIDE the component where 'user' is accessible
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Users', href: route('users.index') },
        // 🛠️ FIX: Pass the user ID to the users.edit route
        // We use the ID to generate the correct URL: /users/5/edit
        {
            title: 'Edit',
            href: route('users.edit', { user: user.id })
            // OR simply: href: route('users.edit', user.id) 
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div>
                <Head title={`Edit User: ${user.name}`} />
                <UserForm user={user} />
            </div>
        </AppLayout>
    )
}

export default UserEdit