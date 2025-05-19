import { Outlet } from 'react-router'
import { ManagementLayout } from '~/components/mgmt/ManagementLayout'

export default function ManagementPage() {
	return (
		<ManagementLayout>
			<Outlet />
		</ManagementLayout>
	)
}
