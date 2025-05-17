export const PageLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateRows: 'auto 1fr auto'
			}}>
			{children}
		</div>
	)
}
