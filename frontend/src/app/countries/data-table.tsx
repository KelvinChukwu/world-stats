"use client"

import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    PaginationState,
    RowData,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { XPagination } from "./page"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    paginationProps?: XPagination
}

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant: string
    }
}

export function DataTable<TData extends { id: string }, TValue>({
    columns,
    data,
    paginationProps,
}: DataTableProps<TData, TValue>) {

    // TODO: refactor this to remove the ??
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: (paginationProps?.page ?? 1) - 1, // TODO get this from URL search params
        pageSize: paginationProps?.pageSize ?? 15, // TODO perhaps refactor this to get constant from shared file
    })

    const curSearchParams = useSearchParams()
    const nameFilter = { id: 'name', value:'' }
    if (curSearchParams.get('name_contains')) {
        nameFilter.value = curSearchParams.get('name_contains') ?? ''
    }

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        [nameFilter]
    )

    const table = useReactTable({
        data: data,
        columns: columns,
        getRowId: originalRow => originalRow.id,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        rowCount: paginationProps?.total,
        state: {
            pagination,
            columnFilters,
        },
        onPaginationChange: setPagination,
        manualFiltering: true,
        onColumnFiltersChange: setColumnFilters,
    })

    const pathName = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            {header.column.getCanFilter() ? (
                                                <div>
                                                    <Filter column={header.column} />
                                                </div>
                                            ) : null}
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
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        table.previousPage()
                        const newSearchParams = new URLSearchParams(searchParams.toString())
                        newSearchParams.set('page', (pagination.pageIndex).toString())
                        router.push(`${pathName}?${newSearchParams.toString()}`)
                    }
                    }
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        table.nextPage()
                        const newSearchParams = new URLSearchParams(searchParams.toString())
                        newSearchParams.set('page', (pagination.pageIndex + 2).toString())
                        router.push(`${pathName}?${newSearchParams.toString()}`)
                    }
                    }
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

function Filter({ column }: { column: Column<any, unknown> }) {
    const columnFilterValue = column.getFilterValue()
    const { filterVariant } = column.columnDef.meta ?? {}

    const pathName = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    return filterVariant === 'range' ? (
        <div>
            <div className="flex space-x-2">
                {/* See faceted column filters example for min max values functionality */}
                <DebouncedInput
                    type="number"
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [value, old?.[1]])
                    }
                    placeholder={`Min`}
                    className="w-24 border shadow rounded"
                />
                <DebouncedInput
                    type="number"
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [old?.[0], value])
                    }
                    placeholder={`Max`}
                    className="w-24 border shadow rounded"
                />
            </div>
            <div className="h-1" />
        </div>
    ) : filterVariant === 'select' ? (
        <select
            onChange={e => {
                column.setFilterValue(e.target.value)
            }
            }
            value={columnFilterValue?.toString()}
        >
            {/* See faceted column filters example for dynamic select options */}
            <option value="">All</option>
            <option value="complicated">complicated</option>
            <option value="relationship">relationship</option>
            <option value="single">single</option>
        </select>
    ) : (
        <DebouncedInput
            className="w-36 border shadow rounded"
            onChange={value => {
                column.setFilterValue(value)
                const newSearchParams = new URLSearchParams(searchParams.toString())
                if (value === '') {
                    newSearchParams.delete('name_contains')
                } else {
                    newSearchParams.set('name_contains', value.toString())
                }
                router.push(`${pathName}?${newSearchParams.toString()}`)
            }
            }
            placeholder={`Search...`}
            type="text"
            value={(columnFilterValue ?? '') as string}
        />
    )
}

// A typical debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}
