const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10


async function getCountries(page?: number , pageSize?: number) {
  console.log("Page num: ",page)
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

export default async function Home({searchParams} : {searchParams?: {page?: number}}) {
  const countries = await getCountries(searchParams?.page)
  //console.log(countries)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    </main>
  );
}
