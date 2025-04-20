"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

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
        /* filterFn: 'includesString', */
        cell: ({ row }) => {
            const name = String(row.getValue("name"))
            const countryCode = row.id
            //TODO: wrap this in a tooltip to share that it will navigate you to a new page
            return <Link href={`/countries/country?countryCode=${countryCode}`} className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">{name}</Link>
        }
    },
    {
        accessorKey: "continent",
        header: "Continent",
        meta: {
            filterVariant: 'select',
        },

    },
    {
        accessorKey: "population",
        header: "Population",
        meta: {
            filterVariant: 'range',
        },
        cell: ({ row }) => {
            const population = parseInt(row.getValue("population"))
            const formatted = population.toLocaleString("en-US")
            return <p>{formatted}</p>
        },
    },
    {
        accessorKey: "surfaceArea",
        header: "Surface Area",
        meta: {
            filterVariant: 'range',
        },
        cell: ({ row }) => {
            const surfaceArea = parseInt(row.getValue("surfaceArea"))
            const formatted = `${surfaceArea.toLocaleString()} km²` // TODO: consider extracting these formatting fcts to shared utils file
            return <p>{formatted}</p>
        },
    },
    {
        accessorKey: "lifeExpectancy",
        header: "Life Expectancy",
        meta: {
            filterVariant: 'range',
        },
        cell: ({ row }) => {
            const lifeExpectancy = parseFloat(row.getValue("lifeExpectancy"))
            const formatted = lifeExpectancy ? `${lifeExpectancy} years` : '-'
            return <p className="text-center">{formatted}</p>
        }
    },
]
