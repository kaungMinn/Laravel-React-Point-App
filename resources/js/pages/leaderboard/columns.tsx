import { ColumnDef } from "@tanstack/react-table";
import { Link } from "@inertiajs/react";
// Assuming UserDataType has name, email, and total_points

export interface UserDataType {
    id: number;
    name: string;
    email: string;
    total_points: number;
    updated_at: string;
    // You might also pass pagination metadata (current_page)
}

export const createRankedColumns = (currentPage: number = 1, perPage: number = 10): ColumnDef<UserDataType>[] => [
    {
        // 1. RANK COLUMN (Header and Cell Styling)
        id: 'rank',
        // 🛠️ Header Styling: Apply a background color to the header cell
        header: () => <div className="font-bold text-center text-white bg-yellow-500  p-1 rounded-t-lg">Rank</div>,
        size: 50,
        cell: ({ row }) => {
            const rank = (currentPage - 1) * perPage + row.index + 1;

            let rankClass = 'font-semibold text-gray-700';
            // Conditional styling for top ranks (already implemented)
            if (rank === 1) rankClass = 'font-extrabold text-white bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center mx-auto shadow-md';
            else if (rank === 2) rankClass = 'font-bold text-white bg-gray-400 rounded-full w-8 h-8 flex items-center justify-center mx-auto';
            else if (rank === 3) rankClass = 'font-bold text-white bg-amber-500 rounded-full w-8 h-8 flex items-center justify-center mx-auto';

            // Ensure the parent div matches the Rank header's alignment
            return <div className={`text-center  ${rankClass}`}>{rank}</div>;
        }
    },
    {
        accessorKey: 'name',
        header: "Name",
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
                    href={route('users.point-history', row.original.id)}
                    className="underline text-blue-500 hover:text-blue-700"
                >
                    {total_points ? `+${total_points}` : 0}
                </Link>
            );
        }
    },
    {
        accessorKey: 'updated_at',
        header: 'Updated At',
        cell: ({ row }) => {
            const dateString = row.original.updated_at;

            // 🛑 Convert the ISO string to a Date object and format it 🛑
            const formattedDate = new Date(dateString).toLocaleDateString(
                'en-US', // Locale (e.g., 'en-US' for MM/DD/YYYY, 'en-GB' for DD/MM/YYYY)
                {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                } // Options for display format
            );

            return formattedDate;
        }

    }
];