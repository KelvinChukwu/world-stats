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

type CountryDetailed = {
    code: string
    name: string
    localName: string
    continent: string // TODO: add enum
    population: number
    surfaceArea: number
    lifeExpectancy: number
    capital: string
    region: string
    independenceYear: number
    governmentForm: string
    headOfState: string
    //languages: string[] make this COUNTRYLANGUAGE type
}


async function getCountry(code: string): Promise<CountryDetailed> {
    // TODO: use URL search params
    const res = await fetch(`http://127.0.0.1:5000/countries/${code}`)

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    const country = await res.json()

    return {
        code: country.code,
        name: country.name,
        localName: country.local_name,
        continent: country.continent,
        population: country.population,
        surfaceArea: country.surface_area,
        lifeExpectancy: country.life_expectancy,
        capital: country.capital.name,
        region: country.region,
        independenceYear: country.indep_year,
        governmentForm: country.government_form,
        headOfState: country.head_of_state,
        //languages: country.languages,
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
export default async function CountryDetailedPage({ searchParams }: { searchParams?: { countryCode?: string } }) {
    const countryCode = searchParams?.countryCode
    const country = await getCountry(countryCode ?? "USA") // TODO: make this code non-nullable
    console.log(country)
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
                    <Card className="flex flex-col w-96 h-72 row-start-2">
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
                    <Card className="flex flex-col  w-96 h-72 row-start-2">
                        <CardHeader className="">
                            <CardTitle className="font-extrabold text-xl self-center" >Demographics</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-rows-2 justify-items-center grow">
                            <TextPair label="Population" value="Card Content" />
                            <TextPair label="Life Expectancy" value="Card Content" />
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col  w-96 h-72 row-start-3">
                        <CardHeader className="">
                            <CardTitle className="font-extrabold text-xl self-center" >Politics</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-rows-2 gap-2 justify-items-center">
                            <TextPair label="Independence Year" value="Card Content" />
                            <TextPair label="Government Form" value="Card Content" />
                            <TextPair label="Head of State" value="Card Content" />
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col  w-96 h-72 row-start-3">
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
