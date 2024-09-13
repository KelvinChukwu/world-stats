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
