import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { UserDataType } from "../leaderboard/columns";
import { Badge } from "@/components/ui/badge";


const handleDelete = (id: number) => {
    const isConfirmed = confirm("Are you sure you want to delete this user? This action cannot be undone.");

    if (isConfirmed) {
        // 2. Send a DELETE request to the points.destroy route
        router.delete(route('users.destroy', id), {
            // Optional: Provide feedback upon success
            onSuccess: () => {
                // If successful, Inertia automatically updates the table data (Index page)
                console.log('User deleted successfully.');
            },
            // Optional: Handle errors
            onError: (errors) => {
                console.error('Failed to delete user:', errors);
            },
            invalidateCacheTags: ['/leaderboard', '/points', '/users']
        });
    }
}

export const columns: ColumnDef<UserDataType>[] = [
    {
        accessorKey: 'name',
        header: 'Name'
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'total_points',
        header: 'Total Points',
        cell: ({ row }) => {
            const total_points = row.original.total_points;
            return <Badge className="bg-green-600">{total_points ? `+${total_points}` : 0}</Badge>
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
                            <Link href={route('users.edit', id)}>Edit</Link>
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