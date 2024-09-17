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
import { WorldStatsBarChart } from "./WorldStatsBarChart"
import { ChartConfig } from "@/components/ui/chart"

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-2))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
    label: {
      color: "hsl(var(--background))",
    },
  } satisfies ChartConfig



const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 15

// TODO: extract this to a shared file
type CountryLanguage = {
    countryCode: string
    language: string
    isOfficial: boolean
    percentage: number
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
    languages: CountryLanguage[]
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
        languages: country.languages.map((language: { country_code: string; language: string; is_official: string; percentage: number }) => ({
            countryCode: language.country_code,
            language: language.language,
            isOfficial: language.is_official === 'T' ? true : false,
            percentage: language.percentage,
        })),
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
export default async function CountryDetailedPage({ searchParams }: { searchParams: { countryCode: string } }) {
    const countryCode = searchParams?.countryCode
    const country = await getCountry(countryCode) 

    const countryLanguageData = country.languages.map((language: { countryCode: string; language: string; isOfficial: boolean; percentage: number }) => ({
        countryCode: language.countryCode,
        language: language.language,
        isOfficial: language.isOfficial,
        percentage: language.percentage,
    }))

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
                <h1 className="text-3xl font-semibold">{`${country.name} (${country.localName})`}</h1>
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
                            <CardTitle className="font-extrabold text-xl" >Geography</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2 justify-self-center grow">
                            <TextPair label="Continent" value={country.continent} />
                            <TextPair label="Region" value={country.region} />
                            <TextPair label="Surface Area" value={`${country.surfaceArea.toLocaleString()} km²`} />
                            <TextPair label="Capital" value={country.capital} />
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col  w-96 h-72 row-start-2">
                        <CardHeader className="">
                            <CardTitle className="font-extrabold text-xl" >Demographics</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-rows-2 grow">
                            <TextPair label="Population" value={country.population.toLocaleString()} />
                            <TextPair label="Life Expectancy" value={`${country.lifeExpectancy} years`} />
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col  w-96 h-72 row-start-3">
                        <CardHeader className="">
                            <CardTitle className="font-extrabold text-xl" >Politics</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-rows-2 gap-2 grow">
                            <TextPair label="Independence Year" value={country.independenceYear.toString()} />
                            <TextPair label="Government Form" value={country.governmentForm} />
                            <TextPair label="Head of State" value={country.headOfState} />
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col w-96 h-72 row-start-3">
                        <CardHeader className="">
                            <CardTitle className="font-extrabold text-xl" >Languages</CardTitle> {/* TODO: make official languages bold and make a note of this with a question mark tooltip*/}
                        </CardHeader>
                        <CardContent>
                            <WorldStatsBarChart chartConfig={chartConfig} chartData={chartData} xAxisDataKey="desktop" yAxisDataKey="month"/>
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
