import { defineConfig } from "drizzle-kit"

const { DATABASE_URL } = process.env
if (typeof DATABASE_URL != "string") {
	throw new Error("DATABASE_URL not defined")
}

export default defineConfig({
	out: "./drizzle",
	schema: ["./app/schema/index.ts", "app/schema/auth-schema.ts"],
	dialect: "postgresql",
	dbCredentials: {
		url: DATABASE_URL,
	},
	extensionsFilters: ["postgis"],
	schemaFilter: ["public"],
	tablesFilter: ["*"],
})
