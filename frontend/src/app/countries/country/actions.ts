"use server"
import { revalidatePath } from "next/cache"

export async function updateCountry(countryCode: string | null, formData: FormData) {

    if (!countryCode) {
        throw new Error("Country code is required");
    }

    const rawFormData = Object.fromEntries(formData)

    if (rawFormData.population === "") {
        delete rawFormData.population
    }
    if (rawFormData.lifeExpectancy === "") {
        delete rawFormData.lifeExpectancy
    }
    if (rawFormData.headOfState === "") {
        delete rawFormData.headOfState
    }

    if (Object.keys(rawFormData).length === 0) {
        return
    }

    const formattedFormData = {
        life_expectancy: rawFormData.lifeExpectancy,
        head_of_state: rawFormData.headOfState,
        population: rawFormData.population,
    }

    const response = await fetch(`http://127.0.0.1:5000/countries/${countryCode}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedFormData),
    });
    /* if (!response.ok) {
        throw new Error("Failed to update country");
    } */
   // TODO: give response on failure
    revalidatePath("/countries/country");
    revalidatePath("/countries");
}