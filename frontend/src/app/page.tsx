
async function getCountries() {
  const res = await fetch(`http://127.0.0.1:5000/countries/?page=${1}&page_size=${10}`)
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
 
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}

export default async function Home() {
  const countries = await getCountries()
  console.log(countries)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    </main>
  );
}
