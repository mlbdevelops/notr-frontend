import styles from '../styles/updatePopUp.module.scss'

export default function updatePopUp({actions}){
  return(
    <div className={styles.blur}>
      <div className={styles.box}>
        <strong className={styles.title}>
          New update
        </strong>
        <span className={styles.descr}>
          A new update is available, check now to discover what's new in Notr.
        </span>
        <small className={styles.small}>
          This version will be obsolete in 3 days.
        </small>
        <div className={styles.actions}>
          {actions}
        </div>
      </div>
    </div>
  );
}