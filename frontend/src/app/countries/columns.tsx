"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Country = {
    id: string
    name: string
    continent: string // TODO: add enum
    population: number
    surfaceArea: number
    lifeExpectancy: number
}

//TODO: add formatting for different columns
export const columns: ColumnDef<Country>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "continent",
        header: "Continent",
    },
    {
        accessorKey: "population",
        header: "Population",
        cell: ({ row }) => {
            const population = parseInt(row.getValue("population"))
            const formatted = population.toLocaleString("en-US")

            return <p>{formatted}</p>
        },
    },
    {
        accessorKey: "surfaceArea",
        header: "Surface Area",
    },
    {
        accessorKey: "lifeExpectancy",
        header: "Life Expectancy",
    },
]
