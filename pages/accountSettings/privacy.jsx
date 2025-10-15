import Header from '../../components/header.jsx';
import { ChevronLeft, Lock, Planet, Earth } from 'lucide-react';
import { useRouter } from 'next/router';
import styles from '../../styles/privacy.module.scss';
import { useState, useEffect } from 'react';
import Loader from '../../components/loading_spinner.jsx';
import { useTranslation } from 'react-i18next';
import { useCache } from '../../hooks/notrCachingHook.js';

export default function privacy(){
  const { t } = useTranslation();
  const { remove, getProvider } = useCache();
  const router = useRouter();
  const [isPrivate, setIsPrivate] = useState(false);
  const [load, setLoad] = useState(false);
  const [token, setToken] = useState('');
  
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token')) || '';
    token? setToken(token) : null;
  }, []);
  
  useEffect(() => {
    const getPrivate = async (token) => {
      const userData = getProvider('user')
      if (userData != undefined) {
        return setIsPrivate(userData.user.isPrivate)
      }
      
      setLoad(true)
      const res = await fetch('https://notrbackend.vercel.app/api/user/isPrivate', {
        method: 'GET',
        headers:{
          'token' : token
        }
      })
      const data = await res.json();
    
      if (res.ok) {
        setIsPrivate(data.isPrivate)
        setLoad(false)
      }
    }
    getPrivate(token)
  }, [token]);
  
  const editPrivacy = async (tkn) => {
    setLoad(true);
    const data = {
      isPrivate : isPrivate? false : true
    }
    const res = await fetch('https://notrbackend.vercel.app/api/user/editIsPrivate', {
      method: 'POST',
      headers:{
        'Content-Type' : 'application/json',
        'token' : tkn,
      },
      body: JSON.stringify(data)
    })
    const response = await res.json()
    console.log(response)
    if (res.ok) {
      remove('user')
      setIsPrivate(response.isPrivate)
      setLoad(false)
    }
  }
  
  return(
    <div style={{marginTop: '100px'}}  className={styles.body}>
      <Header 
        text={t('header.privacy')}
        leftIcon={
          <ChevronLeft
            style={{padding: '10px 15px'}}
            onClick={() => router.back()}/>
        }
      />
      
      {load?
        <Loader loaderColor='white'/>
      : ''}
      
      <div 
        onClick={() => {
          isPrivate? setIsPrivate(false) : setIsPrivate(true)
          editPrivacy(token)
        }}
        className={styles.option}
      >
        <span style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
        <Lock size={20}/> {t('header.privacy')}
        </span>
        <div style={{
          placeContent: isPrivate? 'end' : 'start',
          transition: '1s'
        }} className={styles.switch}>
        	<div style={{
        	  backgroundColor: isPrivate? 'white' : '#181818',
        	}} className={styles.swch}></div>
        </div>
      </div>
      <span style={{
        margin: '10px',
        color: 'darkgray',
        fontSize: '12px',
        marginTop: '13.5px',
        marginBottom: 0,
        width: '95%',
      }}>
        {t('accSettings.privacyPage.privacy_option.description')}
        <ul>
        	<li>{t('accSettings.privacyPage.privacy_option.list.item1')}</li>
        	<li>{t('accSettings.privacyPage.privacy_option.list.item2')}</li>
        	<li>{t('accSettings.privacyPage.privacy_option.list.item3')}</li>
        </ul>
        {t('accSettings.privacyPage.privacy_option.note_title')}
        <ul>
        	<li>{t('accSettings.privacyPage.privacy_option.note.item1')}</li>
        	<li>{t('accSettings.privacyPage.privacy_option.note.item2')}</li>
        </ul>
      </span>
    </div>
  );
}