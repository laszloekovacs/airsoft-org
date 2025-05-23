import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	out: './drizzle',
	schema: ['./app/schema/schema.ts', 'app/schema/auth-schema.ts'],
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!
	}
})
