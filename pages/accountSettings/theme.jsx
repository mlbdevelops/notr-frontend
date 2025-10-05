import Header from '../../components/header.jsx';
import { ChevronLeft, Moon, Sun, Earth } from 'lucide-react';
import { useRouter } from 'next/router';
import styles from '../../styles/privacy.module.scss';
import { useState, useEffect } from 'react';
import Loader from '../../components/loading_spinner.jsx';

export default function privacy(){
  const router = useRouter();
  const [load, setLoad] = useState(false);
  const [theme, setTheme] = useState('');
  
  useEffect(() => {
    const theme = localStorage.getItem('theme') || '';
    theme? setTheme(theme) : '';
  }, []);
  
  
  const change = (theme) => {
    localStorage.setItem('theme', theme)
  }
  
  return(
    <div style={{marginTop: '100px'}}  className={styles.body}>
      <Header 
        text='Dark mode'
        leftIcon={
          <ChevronLeft
            style={{padding: '10px'}}
            onClick={() => router.back()}/>
        }
      />
      
      {load?
        <Loader loaderColor='white'/>
      : ''}
      
      <div 
        onClick={() => {
          const changeTheme = theme == 'dark'? 'light' : 'dark'
          setTheme(changeTheme)
          change(changeTheme)
        }}
        className={styles.option}
      >
        <span 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
          {theme == 'dark'? <Moon/>  : <Sun size={20}/>}{theme == 'dark'? 'dark' : 'light'} mode
        </span>
        <div style={{
          placeContent: theme == 'dark'? 'end' : 'start',
          transition: '1s'
        }} className={styles.switch}>
        	<div style={{
        	  backgroundColor: theme == 'dark'? 'white' : '#181818',
        	}} className={styles.swch}></div>
        </div>
      </div>
    </div>
  );
}