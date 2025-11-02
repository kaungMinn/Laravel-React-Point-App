import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@inertiajs/core';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { DataTable } from './data-table';
import { createRankedColumns, UserDataType } from './columns';
import { PaginationLink } from '../points';
import Pagination from '@/components/pagination';


interface UserIndexProps extends PageProps {
    rankedUsers: {
        data: UserDataType[];
        links: PaginationLink[],
        current_page: number,
        per_page: number
    },
    filters: { search: string, date: string }
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Leaderboard',
        href: '/leaderboard',
    },
];

export default function Leaderboard({ rankedUsers, filters = { search: '', date: '' } }: UserIndexProps) {
    const columns = createRankedColumns(
        rankedUsers.current_page,
        rankedUsers.per_page
    );

    console.log('rankedUsers', rankedUsers);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="bg-white p-6 ">
                <h2 className="text-xl font-semibold mb-4">Leaderboard </h2>

                <div>
                    <DataTable columns={columns} data={rankedUsers?.data} filters={filters} />
                    <Pagination links={rankedUsers.links} />
                </div>
            </div>
        </AppLayout>
    );
}
