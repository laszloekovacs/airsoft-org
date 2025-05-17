import styles from './PageLatout.module.css'

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
	return <div className={styles.container}>{children}</div>
}
