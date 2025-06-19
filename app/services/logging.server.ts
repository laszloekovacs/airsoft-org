import { default as pino } from "pino"

export const logger = pino({
	name: "airsoft",
	level: "debug",
})

logger.info("logger registered")
