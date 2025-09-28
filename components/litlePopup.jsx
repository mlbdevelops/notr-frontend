import styles from '../styles/litlePopup.module.scss';

export default function Options({options}){
  return(
    <div className={styles.blur}>
      <div className={styles.listBox}>
        {options}
      </div>
    </div>
  );
}