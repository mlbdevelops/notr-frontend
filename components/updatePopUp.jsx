import styles from '../styles/updatePopUp.module.scss'

export default function updatePopUp({actions, currentV, newV}){
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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          textAlign: 'center',
          fontSize: 12,
          color: 'darkgray',
        }}>
        	<span>{currentV}</span>
        	<span>{newV}</span>
        </div>
        <div className={styles.actions}>
          {actions}
        </div>
      </div>
    </div>
  );
}