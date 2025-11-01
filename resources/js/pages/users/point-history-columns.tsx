import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export interface PointHistoryType {
    id: string;
    points: number;
    action_type: string;
    created_at: string;
}

export const pointHistoryColumns: ColumnDef<PointHistoryType>[] = [
    {
        accessorKey: 'action_type',
        header: 'Action Type'
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
]