import React from 'react'

export const Button = ({
	children,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
	return (
		<button
			{...props}
			className="active:bg-amber-500 bg-neutral-300 px-3 py-1 rounded-sm hover:bg-neutral-400">
			{children}
		</button>
	)
}
