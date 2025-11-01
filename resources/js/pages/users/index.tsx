import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react';
import React from 'react'
import { columns } from './columns';
import { DataTable } from './data-table';
import { BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import { UserDataType } from '../leaderboard/columns';
import { PaginationLink } from '../points';
import Pagination from '@/components/pagination';

interface UserIndexProps extends PageProps {
    users: {
        data: UserDataType[],
        links: PaginationLink[]
    },
    filters: { search: string }
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Leaderboard',
        href: '/leaderboard',
    },
    {
        title: 'Users',
        href: '/users',
    },
];

const Users = ({ users, filters }: UserIndexProps) => {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Points" />

            <div className="bg-white p-6">
                <h2 className="text-xl font-semibold mb-4">Users</h2>
                <div>
                    <DataTable columns={columns} data={users.data} filters={filters} />
                    <Pagination links={users.links} />
                </div>

            </div>
        </AppLayout>
    )
}

export default Users