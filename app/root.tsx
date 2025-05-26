import type { Route } from "./+types/root";
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";
import "./tailwind.css";
import "./styles.css";

export function meta() {
	return [
		{
			title: "Airsoft Naptár",
		},
		{
			property: "description",
			content: "Magyarorszag elso szamu airsoft esemeny szervezo oldala",
		},
		{
			property: "og:title",
			content: "Airsoft Naptár",
		},
	];
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<script
					defer
					src="https://umami.am4.duckdns.org/script.js"
					data-website-id="b1eb4441-ba11-4fd4-b873-408554f22640"
				></script>
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main>
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre>
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
