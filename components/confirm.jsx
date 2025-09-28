import styles from '../styles/approval.module.scss';

export default function Question({title, msg, actions}){
  return(
    <div className={styles.blur}>
      <div className={styles.msgBox}>
        <strong style={{
          fontSize: '20px',
          margin: '25px 0 0 0',
        }}>{title}</strong> 
        
        <span style={{
          marginTop: '30px',
          padding: '0 10px',
        }}>{msg}</span>
        
        <div className={styles.buttonsDiv} style={{
          display: 'flex',
        }}>
          { actions }
        </div>
      </div>
    </div>
  );
}