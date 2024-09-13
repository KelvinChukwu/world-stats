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

import { Country, columns } from "./columns"
import { DataTable } from "./data-table"

import Link from "next/link"


const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10


async function getCountries(page?: number, pageSize?: number): Promise<Country[]> {
  console.log("Page num: ", page)
  const res = await fetch(`http://127.0.0.1:5000/countries/?page=${page ?? DEFAULT_PAGE}&page_size=${pageSize ?? DEFAULT_PAGE_SIZE}`)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  console.log(res.headers.get('x-pagination'))

  const resJSON = await res.json()

  const countries = resJSON.map((country: { code: string; name: string; continent: string; population: number; surface_area: number; life_expectancy: number }) => {
    return {
      code: country.code,
      name: country.name,
      continent: country.continent,
      population: country.population,
      surfaceArea: country.surface_area,
      lifeExpectancy: country.life_expectancy
    }
  })
  console.log(countries)
  return countries
}

export default async function Countries({ searchParams }: { searchParams?: { page?: number } }) {
  const countries = await getCountries(searchParams?.page)
  //console.log(countries)

  return (
    <main>
      <nav>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="#" legacyBehavior passHref>
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

      <div className="flex flex-col items-center justify-between p-24 border-2 border-red-500 m-20">
        <DataTable columns={columns} data={countries} />
      </div>
    </main>
  );
}
