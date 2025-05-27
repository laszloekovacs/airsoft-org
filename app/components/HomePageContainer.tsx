export const HomePageContainer = ({
	children,
}: { children: React.ReactNode }) => {
	return (
		<div className="p-4 min-h-dvh grid grid-rows-[auto_1fr_auto]">
			{children}
		</div>
	)
}
