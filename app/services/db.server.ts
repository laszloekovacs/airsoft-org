import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema1 from '~/db/schema'
import * as schema2 from '~/db/auth-schema'

if (typeof process.env.DATABASE_URL != 'string') {
	console.log(process.env.DATABASE_URL)
	throw new Error('DATABASE_URL is not defined')
}

const db = drizzle(process.env.DATABASE_URL!)

export default db
