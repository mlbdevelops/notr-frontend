import styles2 from '../styles/addNote.module.scss';

export default function AddNote(){
  return(
    <div className={styles.blur}>
      <div className={styles.msgBox}>
        <strong>Add a note</strong>
        <input className={styles.input} type="text" placeholder="Enter a name"/>
        <button className={styles.btn} type='submit'>
          Submit
        </button>
      </div>
    </div>
  );
}