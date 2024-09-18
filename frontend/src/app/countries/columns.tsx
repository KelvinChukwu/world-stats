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
        cell: ({ row }) => {
            const name = String(row.getValue("name"))
            const countryCode = row.id
            console.log(countryCode)
            if (countryCode === "AFG"){
                console.log("hello AFG")
            }
            return <p>{name}</p>
        }
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
        cell: ({ row }) => {
            const surfaceArea = parseInt(row.getValue("surfaceArea"))
            const formatted = `${surfaceArea.toLocaleString()} km²` // TODO: consider extracting these formatting fcts to shared utils file
            return <p>{formatted}</p>
        },
    },
    {
        accessorKey: "lifeExpectancy",
        header: "Life Expectancy",
        cell: ({ row }) => {
            const lifeExpectancy = parseInt(row.getValue("lifeExpectancy"))
            const formatted = lifeExpectancy ? `${lifeExpectancy} years` : '-' 
            return <p className="text-center">{formatted}</p>
        }
    },
]
