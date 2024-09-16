import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"


import Link from "next/link"
import { redirect } from "next/navigation"

import { Country } from "../columns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"


const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 15

// TODO: extract this to a shared file
export type XPagination = {
    page?: number
    total: number
    totalPages: number
    nextPage?: number
    prevPage?: number
    lastPage?: number
    pageSize: number
}

type CountryResponse = {
    countries: Country[]
    pagination: XPagination
}


async function getCountries(page?: number, pageSize = DEFAULT_PAGE_SIZE): Promise<CountryResponse> {
    // TODO: use URL search params
    const res = await fetch(`http://127.0.0.1:5000/countries/?page=${page ?? DEFAULT_PAGE}&page_size=${pageSize}`)

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    const paginationRespone = JSON.parse(res.headers.get('x-pagination') ?? '{}')
    const resJSON = await res.json()

    const countries: Country[] = resJSON.map((country: { code: string; name: string; continent: string; population: number; surface_area: number; life_expectancy: number }) => {
        return {
            code: country.code,
            name: country.name,
            continent: country.continent,
            population: country.population,
            surfaceArea: country.surface_area,
            lifeExpectancy: country.life_expectancy
        }
    })
    return {
        countries,
        pagination: {
            total: paginationRespone.total,
            totalPages: paginationRespone.total_pages,
            page: paginationRespone?.page,
            nextPage: paginationRespone?.next_page,
            prevPage: paginationRespone?.prev_page,
            lastPage: paginationRespone?.last_page,
            pageSize: pageSize,
        }
    }
}

function TextPair({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col">
            <span className="font-bold">{label}</span>
            <span>{value}</span>
        </div>
    )
}

// TODO: make the table a fixed size (or at least all the column widths)
// TODO if the field value is empty, show a dash
export default async function CountryDetailed({ searchParams }: { searchParams?: { page?: number } }) {
    const countriesPagination = await getCountries(searchParams?.page)

    return (
        <main>
            <nav>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href="/countries" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Countries</NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="#" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Cities</NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </nav>

            <Separator />

            <div className="flex flex-col justify-between m-4 gap-4">
                <h1 className="text-3xl font-semibold">Country Name (Local Name)</h1>
                <div className="grid grid-cols-2 gap-8 self-center">
                    <Button
                        variant="outline"
                        className="size-fit"
                    >
                        Go Back
                    </Button>
                    {/*TODO: extract these cards into their own component*/}
                    <Card className="flex flex-col border-2 border-red-500 w-96 h-72 row-start-2">
                        <CardHeader className="">
                            <CardTitle className="font-extrabold text-xl self-center" >Geography</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2 justify-items-center grow p-2">
                            <TextPair label="Continent" value="Card Content" />
                            <TextPair label="Region" value="Card Content" />
                            <TextPair label="Surface Area" value="Card Content" />
                            <TextPair label="Capital" value="Card Content" />
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col border-2 border-red-500 w-96 h-72 row-start-2">
                        <CardHeader className="">
                            <CardTitle className="font-extrabold text-xl self-center" >Demographics</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-rows-2 justify-items-center grow">
                            <TextPair label="Population" value="Card Content" />
                            <TextPair label="Life Expectancy" value="Card Content" />
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col border-2 border-red-500 w-96 h-72 row-start-3">
                        <CardHeader className="">
                            <CardTitle className="font-extrabold text-xl self-center" >Politics</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-rows-2 gap-2 justify-items-center">
                            <TextPair label="Independence Year" value="Card Content" />
                            <TextPair label="Government Form" value="Card Content" />
                            <TextPair label="Head of State" value="Card Content" />
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col border-2 border-red-500 w-96 h-72 row-start-3">
                        <CardHeader className="">
                            <CardTitle className="font-extrabold text-xl self-center" >Languages</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-rows-2 gap-2 justify-items-center">
                            <TextPair label="Lang List" value="Card Content" />
                        </CardContent>
                    </Card>
                    <Button
                        variant="outline"
                        className="size-fit row-start-4 col-start-2 justify-self-end"
                    >
                        Edit
                    </Button>
                </div>
            </div>
        </main>
    );
}
