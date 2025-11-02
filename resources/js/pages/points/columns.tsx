import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { Link, router } from "@inertiajs/react";

export interface PointData {
    id: number;
    user_id: number;
    points: number;
    action_type: string;
    created_at: string;
    user: { // Eager loaded user data
        id: number;
        name: string;
    };
}

const handleDelete = (id: number) => {
    // 1. Ask for confirmation
    const isConfirmed = confirm('Are you sure you want to delete this point record? This action cannot be undone and will reverse the points from the user.');

    if (isConfirmed) {
        // 2. Send a DELETE request to the points.destroy route
        router.delete(route('points.destroy', id), {
            // Optional: Provide feedback upon success
            onSuccess: () => {
                // If successful, Inertia automatically updates the table data (Index page)
                console.log('Record deleted successfully.');
            },
            // Optional: Handle errors
            onError: (errors) => {
                console.error('Failed to delete record:', errors);
            },
            invalidateCacheTags: ['/leaderboard', '/points', '/users']
        });
    }
};

export const columns: ColumnDef<PointData>[] = [
    {
        accessorKey: "user",
        header: 'User',
        size: 150,
        cell: ({ row }) => {
            const user = row.original.user;
            return user.name || "Unknown"
        }

    },
    {
        accessorKey: "points",
        header: 'Points',
        size: 70,

        cell: ({ row }) => {
            const points = row.original.points;
            return <Badge className="bg-green-600 ">{points ? `+${points}` : 0}</Badge>
        }
    },
    {
        accessorKey: "action_type",
        header: "Action Type",
        size: 400,
    },
    {
        accessorKey: "created_at",
        header: "Created at",
        size: 150,
        cell: ({ row }) => {
            const dateString = row.original.created_at;

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

    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const id = row.original.id
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={route('points.edit', id)}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(id)}>
                            Delete
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },

]