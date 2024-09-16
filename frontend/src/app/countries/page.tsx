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
import { redirect } from "next/navigation"


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

// TODO: make the table a fixed size (or at least all the column widths)
// TODO if the field value is empty, show a dash
export default async function Countries({ searchParams }: { searchParams?: { page?: number } }) {
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

      <div className="flex flex-col items-center justify-between m-20">
        <DataTable columns={columns} data={countriesPagination.countries} paginationProps={countriesPagination.pagination} />
      </div>
    </main>
  );
}
