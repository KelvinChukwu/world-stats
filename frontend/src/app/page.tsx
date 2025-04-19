import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Globe, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WorldStatsNav } from "./world-stats-nav"


const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10

export default async function Home({ searchParams }: { searchParams?: { page?: number } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <WorldStatsNav />
      <main>
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Welcome to World Stats
            </h1>
            <p className="max-w-[36rem] text-muted-foreground md:text-xl">
              Learn more about the world!
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
            <Card className="flex flex-col">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Admin Login</CardTitle>
                <CardDescription>Secure access for administrators and authorized personnel</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <p className="text-muted-foreground">
                  Login to make changes to countries
                </p>
                <ul className="grid gap-3 text-sm">
                  <li className="flex items-start gap-2">
                    • <span>Manage geographic data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    • <span>Update country information</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full" asChild><Link href="#">Admin Login</Link></Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">View Countries</CardTitle>
                <CardDescription>Explore comprehensive data about countries worldwide</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <p className="text-muted-foreground">
                  Browse detailed information about countries, including demographics, geography, economy, and culture.
                </p>
                <ul className="grid gap-3 text-sm">
                  <li className="flex items-start gap-2">
                    • <span>View List of Countries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    • <span>Detailed country profiles</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full" asChild><Link href="countries" >Explore Countries</Link></Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
