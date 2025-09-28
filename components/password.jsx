import styles from '../styles/password.module.scss'

export default function PasswordDiv({msg, title, input, buttons}){
  return(
    <div className={styles.blur}>
      <div className={styles.passwordBox}>
        <p className={styles.title}>
          {title}
        </p>
        {input}
        <p style={{
          display: msg? 'block' : 'none',
          margin: 0,
          marginTop: '10px',
          color: '#f74646',
          transition: '0.2s'
        }}>{msg}</p>
        <div className={styles.buttonsDiv}>
          {buttons}
        </div>
      </div>
    </div>
  );
}