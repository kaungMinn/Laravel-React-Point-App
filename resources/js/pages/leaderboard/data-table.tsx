
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


import { useState } from "react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RotateCcw, Search } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    filters: { search: string, date: string }
}


export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [rangeDate, setRangeDate] = useState<DateRange | undefined>(undefined);
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


    const handleDateRange = (dateRange: DateRange | undefined) => {

        // Initialize the query object
        const queryParams: { from?: string | null; to?: string | null } = { from: null, to: null };

        console.log(dateRange);

        // 1. Check and format the 'from' date
        if (dateRange?.from) {
            // Example: 2025-11-12T00:00:00.000Z
            queryParams.from = format(dateRange.from, "yyyy-MM-dd'T'00:00:00.000'Z'");
        }

        // 2. Check and format the 'to' date
        if (dateRange?.to) {
            // Format the 'to' date to the end of the day in UTC for inclusive filtering
            // Example: 2025-11-26T23:59:59.000Z
            queryParams.to = format(dateRange.to, "yyyy-MM-dd'T'23:59:59.000'Z'");
        }

        // 3. Call Inertia router with the new parameters
        router.get(
            route('leaderboard.index'),
            // Send the from/to properties
            queryParams,
            {
                preserveState: true,
                replace: true
            }
        );
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row items-center justify-between py-4 ">

                <div className='mb-5 flex  justify-between'>
                    <div className="flex gap-3 flex-col lg:flex-row">
                        <Popover open={dateOpen} onOpenChange={setDateOpen}>
                            <PopoverTrigger asChild>
                                <Button variant={'outline'} id="date" className="w-48 justify-between font-normal">
                                    {/* Check if BOTH from and to exist to display the full range */}
                                    {rangeDate?.from && rangeDate?.to ?
                                        // Display the range: e.g., "11/1/2025 - 11/30/2025"
                                        `${rangeDate.from.toLocaleDateString()} - ${rangeDate.to.toLocaleDateString()}`
                                        : "Choose date range"
                                    }
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar mode="range" onSelect={(dateRange) => {
                                    setRangeDate(dateRange);
                                }} selected={rangeDate} />
                            </PopoverContent>
                        </Popover>

                        <Button variant={rangeDate ? 'default' : 'outline'} onClick={() => { handleDateRange(rangeDate) }}>{'Filter'} <Search /></Button>
                        <Button variant={rangeDate ? 'default' : 'outline'} onClick={() => {
                            handleDateRange(undefined);
                            setRangeDate(undefined);
                        }}>Reset<RotateCcw /></Button>

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