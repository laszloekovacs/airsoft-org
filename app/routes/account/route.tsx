import { Link, Outlet } from 'react-router'
import styles from './account.module.css'
import Sitemap from '~/components/sitemap'

export default function AccountLayout() {
	return (
		<div className={styles.container}>
			<h1>Felhasználó fiók</h1>

			<Link to='/'>vissza a főoldalra</Link>

			<Outlet />

			<Sitemap />
		</div>
	)
}
