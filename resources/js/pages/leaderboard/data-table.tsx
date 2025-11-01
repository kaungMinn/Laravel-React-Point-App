
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";


import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RotateCcw } from "lucide-react";
import { format } from "date-fns";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    filters: { search: string }
}


export function DataTable<TData, TValue>({
    columns,
    data,
    filters = { search: '' }
}: DataTableProps<TData, TValue>) {
    const [dateState, setDateState] = useState<Date | undefined>(undefined);
    const [dateOpen, setDateOpen] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        columnResizeMode: 'onChange',
        // 2. Enable resizing features (necessary for size to take effect)
        enableColumnResizing: true,
        defaultColumn: {
            minSize: 50,
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility: {
                id: false,
                ...columnVisibility
            }
        }
    })

    useEffect(() => {
        let formattedDate: string | null = null;

        // 1. Check if a date is selected and format it
        if (dateState) {
            // Format to YYYY-MM-DD (e.g., "2025-11-01")
            formattedDate = format(dateState, 'yyyy-MM-dd');
        }

        // 2. Call Inertia router
        router.get(
            route('leaderboard.index'),
            // Send the formatted date under the 'date' key (matching your Laravel query)
            // If dateState is undefined, send null to clear the filter
            { search: formattedDate },
            {
                preserveState: true,
                replace: true
            }
        );
        // CRITICAL: Ensure the dependency array triggers only when the date state changes
    }, [dateState])



    return (
        <div>
            <div className="flex items-center justify-between py-4 ">

                <div className='mb-5 flex justify-between'>
                    <div className="flex gap-3">
                        <Popover open={dateOpen} onOpenChange={setDateOpen}>
                            <PopoverTrigger asChild>
                                <Button variant={'outline'} id="date" className="w-48 justify-between font-normal">
                                    {dateState ? dateState.toLocaleDateString() : "Select date"}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        setDateState(date);
                                        setDateOpen(false)
                                    }}
                                    selected={dateState}
                                />
                            </PopoverContent>
                        </Popover>

                        <Button variant={'outline'} size={'icon'} onClick={() => {
                            setDateState(undefined)
                        }}><RotateCcw /></Button>

                    </div>

                </div>

                <div className="space-x-2">
                    <Button asChild><Link href={'/users'}>Users</Link></Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) => column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="overflow-hidden rounded-md border">

                <Table>
                    <TableHeader className="bg-gray-100">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}  >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}