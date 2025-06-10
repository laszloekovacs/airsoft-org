import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const config = {
	plugins: [react(), tailwindcss()],
}

export default config
