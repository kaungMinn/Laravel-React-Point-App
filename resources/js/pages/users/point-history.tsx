import { BreadcrumbItem } from '@/types';
import React from 'react';
import { PageProps } from '@inertiajs/core';
import { UserDataType } from '../leaderboard/columns';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { pointHistoryColumns, PointHistoryType } from './point-history-columns';
import { PointHistoryDataTable } from './point-history-data-table';


interface PointHistoryProps extends PageProps {
    targetUser: UserDataType,
    pointHistory: {
        data: PointHistoryType[],
    },
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

const PointHistory = ({ targetUser, pointHistory }: PointHistoryProps) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Point History' />

            <div className="bg-white p-6">
                <h2 className="text-xl font-semibold mb-4">Point History of User - {targetUser.name}</h2>
                <div>
                    <PointHistoryDataTable columns={pointHistoryColumns} data={pointHistory.data} filters={{ search: '' }} />

                </div>

            </div>
        </AppLayout>
    )
}

export default PointHistory