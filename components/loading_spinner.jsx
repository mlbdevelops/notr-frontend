import styles from '../styles/loader.module.scss'

export default function Loader({loaderColor, loaderDirection}){
  return(
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '83%',
      width: '100%',
      top: '60px',
      position: 'fixed',
      borderRadius: '10px',
      backgroundColor: 'transparend',
      zIndex: 99988888888,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
        width: '100px',
        borderRadius: '20px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        backDropFilter: 'blur(5px)'
      }}>
        <div className={styles.loader} style={{
          height: '45px',
          width: '45px',
          border: `1px solid ${loaderColor? loaderColor : 'black'}`,
          borderTopColor: 'transparent',
          borderRadius: '100px',
        }}></div> 
      </div>
    </div>
  );
}