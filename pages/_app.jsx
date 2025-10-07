import '../styles/global.css';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { App } from '@capacitor/app';
import { useRouter } from 'next/router';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import Header from '../components/header.jsx'
import '../i18n';
import { Preferences } from '@capacitor/preferences';
import UpdatePopUp from '../components/updatePopUp.jsx'
import { Device } from '@capacitor/device';

export default function app({Component, pageProps}){
  const [size, setSize] = useState();
  const [theme, setTheme] = useState('');
  const [versionCheckedNum, setVersionCheckedNum] = useState();
  const [isUpdate, setIsUpdate] = useState(true);
  const router = useRouter()
  
  useEffect(() => {
    setSize(localStorage.getItem('size') || 0)
  }, [!size]);
  
  useEffect(() => {
    setVersionCheckedNum(localStorage.getItem('versionCheckedNum') || 0)
  }, [versionCheckedNum, isUpdate]);
  
  useEffect(() => {
    const loadLang = async () => {
      const { value } = await Preferences.get({ key: 'language' });
      if (value) {
        import('i18next').then(i18n => i18n.default.changeLanguage(value));
      }
    };
    loadLang();
  }, []);
  
  useEffect(() => {
    if (isUpdate && router.pathname != '/accountSettings/app_update') {
      document.body.style.overflow = 'hidden'
    }else{
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isUpdate])
  
  async function checkForUpdate() {
    try {
      const response = await fetch('https://notrbackend.vercel.app/notr/app/version');
      const data = await response.json();
      const info = await Device.getInfo();
      const currentVersion = info.appVersion;
      
      if (Number(currentVersion) !== Number(data.latestVersion) && data.apkUrl !== null) {
        setIsUpdate(true);
        if (versionCheckedNum == 0) {
          return;
        }
        localStorage.setItem('versionCheckedNum', 1)
      }
    } catch (err) {
      console.error('Update check failed:', err);
    }
  }
  
  
  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'dark')
  }, [theme]);
  
  
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: 'transparent' });
  }, [])
  
  useEffect(() => {
    const handler = App.addListener('backButton', () => {
      if (window.location.pathname === '/') {
        App.exitApp();
      } else {
        window.history.back();
      }
    });
    return () => {
      handler.remove();
    };
  }, []);

  return (
    <div style={{
      fontSize: size == 0 ? '16px' 
        : size == 1 ? '17px' 
        : size == 2 ? '18px' 
        : size == 3 ? '20px' 
        : size == 4 ? '22px' 
        : '18px',
    }}>
      
      <Component {...pageProps}/> 
      <Head>
        <link rel="icon" type="image/png" href="/notr.png"/>
        <link rel="apple-touch-icon" type="image/png" href="/notr.png"/>
        <link rel="manifest" href="/manifest.webmanifest"/>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>Notr</title>
      </Head>
      {isUpdate && router.pathname != '/accountSettings/app_update'? <UpdatePopUp
        actions={[
          <span onClick={() => setIsUpdate(false)}>Later</span>,
          <span onClick={() => {
            setIsUpdate(false)
            router.push('/accountSettings/app_update')
          }}>Check</span>
        ]}
      /> : ''}
    </div>
  )
}
