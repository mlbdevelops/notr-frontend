import { ChevronLeft, Lock, Info, LogOut, Bug, Save, User, Trash, ChevronRight } from 'lucide-react';
import Header from '../../components/header.jsx'
import { useRouter } from 'next/router'
import styles from '../../styles/settings.module.scss'
import Question from '../../components/confirm.jsx'
import { useEffect, useState } from 'react'

export default function settings(){
  const router = useRouter()
  
  return(
    <div>
      <Header
        text={'Settings'} 
        isTransparent={true}
        blur={'10px'}
        leftIcon={<ChevronLeft style={{padding:'10px'}} onClick={() => router.back()} />}
      />
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        margin: '65px 0',
        marginTop: '95px',
        width: '100%',
        gap: '5px',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
      
        { /*Auto save
        <div onClick={() => setAutoSave(autoSave == 'On'? 'Off' : 'On')} style={{justifyContent: 'space-between'}} className={styles.component}>
          <span className={styles.span}>
            <Save size={20}/>
            Enable auto save
          </span>
          <span style={{color: 'lightgray'}}>
            {autoSave}
          </span>
        </div>
        */}
        
        { /*Account info*/ }
        <div onClick={() => {
          router.push('/account')
        }} className={styles.component}>
          <span className={styles.span}>
            <User size={20}/>
            Account info
          </span>
          <ChevronRight/>
        </div>
        { /*Private notes*/ }
        <div onClick={() => {
          router.push('/settings/private')
        }} className={styles.component}>
          <span className={styles.span}>
            <Lock size={20}/>
            Secret notes
          </span>
          <ChevronRight/>
        </div>
      </div>
      <p style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '12px',
        bottom: '10px',
        color: '#5f5f5f',
        position: 'fixed',
        placeSelf: 'center',
      }}><Bug size={13.5}/> Report any bugs to the <a style={{textDecoration: 'none', fontWeight: 'bold', color: 'white'}} href='https://www.facebook.com/mlbdev'>developer</a></p>
    </div>
  );
}