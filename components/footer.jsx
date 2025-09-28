import styles from '../styles/footer.module.scss'

export default function Footer({icons}) {
  return (
    <footer className={styles.footer}>
      {icons}
    </footer>
  )
}
