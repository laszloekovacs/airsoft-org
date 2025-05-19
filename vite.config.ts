import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { reactRouterHonoServer } from 'react-router-hono-server/dev'
import tailwindcss from "@tailwindcss/vite"


export default defineConfig({
	plugins: [
		reactRouter(),
		tsconfigPaths(),
		reactRouterHonoServer({ runtime: 'bun' }),
		tailwindcss()
	],
	server: {
		port: 3000
	}
})
