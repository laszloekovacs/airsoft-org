import { drizzle } from "drizzle-orm/node-postgres"

if (typeof process.env.DATABASE_URL != "string") {
	console.log(process.env.DATABASE_URL)
	throw new Error("DATABASE_URL is not defined")
}

const database = drizzle(process.env.DATABASE_URL!)

export default database
