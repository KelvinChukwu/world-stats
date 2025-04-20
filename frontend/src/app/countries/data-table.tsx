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
import { useCallback, useEffect, useState } from "react"
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
    const nameFilter = { id: 'name', value: '' }
    const continentFilter = { id: 'continent', value: '' }
    const populationFilter = { id: 'population', value: ['', ''] }
    const surfaceAreaFilter = { id: 'surfaceArea', value: ['', ''] }
    const lifeExpectancyFilter = { id: 'lifeExpectancy', value: ['', ''] }

    if (curSearchParams.get('name_contains')) {
        nameFilter.value = curSearchParams.get('name_contains') ?? ''
    }
    if (curSearchParams.get('population_min')) {
        populationFilter.value[0] = curSearchParams.get('population_min') ?? ''
    }
    if (curSearchParams.get('population_max')) {
        populationFilter.value[1] = curSearchParams.get('population_max') ?? ''
    }
    if (curSearchParams.get('surface_area_min')) {
        surfaceAreaFilter.value[0] = curSearchParams.get('surface_area_min') ?? ''
    }
    if (curSearchParams.get('surface_area_max')) {
        surfaceAreaFilter.value[1] = curSearchParams.get('surface_area_max') ?? ''
    }
    if (curSearchParams.get('life_expectancy_min')) {
        lifeExpectancyFilter.value[0] = curSearchParams.get('life_expectancy_min') ?? ''
    }
    if (curSearchParams.get('life_expectancy_max')) {
        lifeExpectancyFilter.value[1] = curSearchParams.get('life_expectancy_max') ?? ''
    }

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        [nameFilter, continentFilter, populationFilter, surfaceAreaFilter, lifeExpectancyFilter]
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
                                                    <Filter column={header.column} resetPageIndex={() => { table.resetPageIndex() }} />
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

function Filter({ column, resetPageIndex }: { column: Column<any, unknown>, resetPageIndex: () => void }) {
    const columnFilterValue = column.getFilterValue()
    const { filterVariant } = column.columnDef.meta ?? {}

    const pathName = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair
    const createSearchParams = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params
        },
        [searchParams]
    )

    return filterVariant === 'range' ? (
        <div>
            <div className="flex space-x-2">
                {/* See faceted column filters example for min max values functionality */}
                <DebouncedInput
                    type="number"
                    min={0}
                    value={(columnFilterValue as [number | string, number | string])?.[0] ?? ''}
                    onChange={value => {
                        column.setFilterValue((old: [number | string, number | string]) => [value, old?.[1]])
                        let filterName = ""
                        if (column.id === 'population') {
                            filterName = 'population_min'
                        } else if (column.id === 'surfaceArea') {
                            filterName = 'surface_area_min'
                        }
                        else {
                            filterName = "life_expectancy_min"
                        }

                        const newSearchParams = createSearchParams(filterName, value.toString())
                        if (value === '') {
                            newSearchParams.delete(filterName)
                        }
                        // TODO: fix behaviour that resets the page index on back navigation
                        resetPageIndex()
                        router.push(`${pathName}?${newSearchParams.toString()}`)
                    }
                    }
                    placeholder={`Min`}
                    className="w-24 border shadow rounded"
                />
                <DebouncedInput
                    type="number"
                    min={0}
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={value => {
                        column.setFilterValue((old: [number, number]) => [old?.[0], value])
                        let filterName = ""
                        if (column.id === 'population') {
                            filterName = 'population_max'
                        } else if (column.id === 'surfaceArea') {
                            filterName = 'surface_area_max'
                        }
                        else {
                            filterName = "life_expectancy_max"
                        }

                        const newSearchParams = createSearchParams(filterName, value.toString())
                        if (value === '') {
                            newSearchParams.delete(filterName)
                        }
                        // TODO: fix behaviour that resets the page index on back navigation
                        resetPageIndex()
                        router.push(`${pathName}?${newSearchParams.toString()}`)
                    }
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
            <option value="ASIA">Asia</option>
            <option value="EUROPE">Europe</option>
            <option value="NORTH AMERICA">North America</option>
            <option value="SOUTH AMERICA">South America</option>
            <option value="OCEANIA">Oceania</option>
            <option value="AFRICA">Africa</option>
            <option value="ANTARCTICA">Antarctica</option>
        </select>
    ) : (
        <DebouncedInput
            className="w-36 border shadow rounded"
            onChange={value => {
                column.setFilterValue(value)
                const newSearchParams = createSearchParams("name_contains", value.toString())
                if (value === '') {
                    newSearchParams.delete('name_contains')
                }
                // TODO: fix behaviour that resets the page index on back navigation
                resetPageIndex()
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
