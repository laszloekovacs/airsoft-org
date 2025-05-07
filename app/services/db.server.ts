import { drizzle } from 'drizzle-orm/node-postgres'

if (typeof process.env.DATABASE_URL != 'string') {
	throw new Error('DATABASE_URL is not defined')
}

const db = drizzle(process.env.DATABASE_URL!)

export default db
