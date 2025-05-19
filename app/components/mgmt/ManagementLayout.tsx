export const ManagementLayout = ({
	children,
}: {
	children: React.ReactNode
}) => {
	return (
		<div className="p-4 min-h-dvh grid grid-rows=[auto_1fr-auto]">
			{children}
		</div>
	)
}
