"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"
import { updateCountry } from "./actions"

// TODO: MAKE SURE DIALOG CANNOT BE CLOSED WHILE REQUEST IS PENDING
// TODO: cache revalidation after form submission
// TODO: success/error messages

export function WorldStatsUpdateCountryDialogContent() {
  const countryCode = useSearchParams().get("countryCode")
  const updateCountryWithCountryCode = updateCountry.bind(null, countryCode)

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Edit Country</DialogTitle>
        <DialogDescription>
          Make changes to a country's attributes here. Click "Save changes" to submit.
        </DialogDescription>
      </DialogHeader>
      <form action={updateCountryWithCountryCode}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="population" className="text-right">
              Population
            </Label>
            <Input name="population" className="col-span-3" type="number" min="0" step="1" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lifeExpectancy" className="text-right">
              Life Expectancy
            </Label>
            <Input name="lifeExpectancy" className="col-span-3" type="number" min="0" step="0.1" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="headOfState" className="text-right">
              Head of State
            </Label>
            <Input name="headOfState" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
