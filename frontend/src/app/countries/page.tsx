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


const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10


async function getCountries(page?: number, pageSize?: number) {
  console.log("Page num: ", page)
  const res = await fetch(`http://127.0.0.1:5000/countries/?page=${page ?? DEFAULT_PAGE}&page_size=${pageSize ?? DEFAULT_PAGE_SIZE}`)
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  console.log(res.headers.get('x-pagination'))

  return res.json()
}

export default async function Home({ searchParams }: { searchParams?: { page?: number } }) {
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
        Foobar
      </div>
    </main>
  );
}
