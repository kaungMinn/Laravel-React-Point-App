// resources/js/Pages/Points/Index.tsx (or .jsx)

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react'; // <-- Ensure Link is imported
import { PageProps } from '@inertiajs/core';
import Pagination from '@/components/pagination';
import { DataTable } from './data-table';
import { columns, PointData } from './columns';

// ... (Your PointData, PaginationLink, and PointsIndexProps interfaces) ...

// 2. Define the shape of the pagination link objects
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}


// 3. Define the props for this page component, using the defined types

interface PointsIndexProps extends PageProps {
    points: {
        data: PointData[];
        links: PaginationLink[]; // <-- Added the links property here
        // ... other pagination properties
    };
    filters: { search: string }
}


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Points',
        href: 'points',
    },
];

export default function Points({ points, filters = { search: '' } }: PointsIndexProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Points" />

            <div className="bg-white p-6 ">
                <h2 className="text-xl font-semibold mb-4">Point Transaction History</h2>


                <div>
                    <DataTable columns={columns} data={points.data} filters={filters} />
                    <Pagination links={points.links} />
                </div>


            </div>
        </AppLayout>
    );
}