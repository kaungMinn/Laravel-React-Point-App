import { ColumnDef } from "@tanstack/react-table";
import { Link } from "@inertiajs/react";
// Assuming UserDataType has name, email, and total_points

export interface UserDataType {
    id: number;
    name: string;
    email: string;
    total_points: number;
    // You might also pass pagination metadata (current_page)
}

export const createRankedColumns = (currentPage: number = 1, perPage: number = 10): ColumnDef<UserDataType>[] => [
    {
        // New Rank Column
        id: 'rank', // Give it a unique ID since it's not a direct accessorKey
        header: "Rank",
        size: 50,
        cell: ({ row }) => {
            // Calculate the rank: (Current Page - 1) * Items Per Page + Row Index + 1
            const rank = (currentPage - 1) * perPage + row.index + 1;

            // Optional: You can style top ranks differently
            let rankClass = 'font-semibold text-gray-700';
            if (rank === 1) rankClass = 'font-bold text-yellow-600 text-lg';
            else if (rank === 2) rankClass = 'font-bold text-gray-500';
            else if (rank === 3) rankClass = 'font-bold text-amber-600';

            return <span className={`${rankClass}`}>{rank}</span>;
        }
    },
    {
        accessorKey: 'name',
        header: "Name"
    },
    {
        accessorKey: 'email',
        header: "Email"
    },
    {
        accessorKey: 'total_points',
        header: 'Total Points',
        cell: ({ row }) => {
            const total_points = row.original.total_points;
            // The Link suggests this is clickable, perhaps to the user's history page
            return (
                <Link
                    // href={route('users.history', row.original.id)}
                    className="underline text-blue-500 hover:text-blue-700"
                >
                    {total_points ? `+${total_points}` : 0}
                </Link>
            );
        }
    },
];