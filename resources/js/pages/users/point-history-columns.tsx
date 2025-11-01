import { ColumnDef } from "@tanstack/react-table";

export interface PointHistoryType {
    id: string;
    points: number;
    action_type: string;
}

export const pointHistoryColumns: ColumnDef<PointHistoryType>[] = [
    {
        accessorKey: 'action_type',
        header: 'Action Type'
    },
    {
        accessorKey: 'points',
        header: 'Points'
    }
]