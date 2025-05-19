import { Link } from 'react-router'

const ManagementIndex = () => {
	return (
		<div>
			<h2>Adminisztrator oldal</h2>
			<ul>
				<li>
					<Link to="users">felhasznalok</Link>
				</li>
			</ul>
		</div>
	)
}

export default ManagementIndex
