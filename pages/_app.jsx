import '../styles/global.css';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { App } from '@capacitor/app';
import { useRouter } from 'next/router';
import { StatusBar } from '@capacitor/status-bar';
import Header from '../components/header.jsx';
import '../i18n';
import { Preferences } from '@capacitor/preferences';
import UpdatePopUp from '../components/updatePopUp.jsx';
import { Device } from '@capacitor/device';
import { Capacitor } from '@capacitor/core';
import { useCache } from '../hooks/notrCachingHook.js';
import { LocalNotifications } from '@capacitor/local-notifications';
import { scheduleDailyNotifications } from '../notification/notifs.jsx';

export default function AppWrapper({ Component, pageProps }) {
  const [size, setSize] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [currentV, setCurrentV] = useState();
  const [newV, setNewV] = useState();
  const [versionCheckedNum, setVersionCheckedNum] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isUpdateCheckDone, setIsUpdateCheckDone] = useState(false);
  const router = useRouter();
  const { setCache } = useCache('update')
  
  useEffect(() => {
    setSize(localStorage.getItem('size') || 0);
    setTheme(localStorage.getItem('theme') || 'dark');
    setVersionCheckedNum(localStorage.getItem('versionCheckedNum') || 0);

    const loadLang = async () => {
      const { value } = await Preferences.get({ key: 'language' });
      if (value) import('i18next').then(i18n => i18n.default.changeLanguage(value));
    };
    loadLang();
  }, []);
  
  useEffect(() => {
    scheduleDailyNotifications()
    
    const listener = LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notification) => {
        const target = notification.notification.extra?.targetPage || '/';
        router.push(target)
      }
    );
    
    return () => listener.remove()
  }, [router])
  
  useEffect(() => {
    document.body.style.overflow = isUpdate ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [isUpdate]);
  
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: 'transparent' });
  }, []);
  
  useEffect(() => {
    const handler = App.addListener('backButton', () => {
      if (window.location.pathname === '/') App.exitApp();
      else window.history.back();
    });
    return () => handler.remove();
  }, []);
  
  useEffect(() => {
    const checkForUpdate = async () => {
      if (!Capacitor.isNativePlatform()) {
        return;
      }
      try {
        const response = await fetch('https://notrbackend.vercel.app/notr/app/version');
        const data = await response.json();
        const info = await App.getInfo();
        const currentVersion = info.version;
        setCurrentV(currentVersion)
        setNewV(data.latestVersion)
        if (currentVersion !== data.latestVersion && data.apkUrl) {
          sessionStorage.setItem('update', JSON.stringify(data))
          setIsUpdate(true);
          if (versionCheckedNum === 3) {
            return router.push('/accountSettings/app_update')
          }
          if (versionCheckedNum >= 1) {
            if (versionCheckedNum === 3) {
              return;
            }else{
              localStorage.setItem('versionCheckedNum', versionCheckedNum + 1)
              
            }
          }
        } else {
          setIsUpdate(false);
        }
        setIsUpdateCheckDone(true);
      } catch (err) {
        console.error('Update check failed:', err);
      }
    };

    if (!isUpdateCheckDone) checkForUpdate();
  }, [versionCheckedNum, isUpdateCheckDone]);

  useEffect(() => {
    if (isUpdate) sessionStorage.setItem('isNewUpdate', isUpdate);
  }, [isUpdate]);

  return (
    <div style={{ fontSize: ['16px', '17px', '18px', '20px', '22px'][size] || '18px' }}>
      <Component {...pageProps} />

      <Head>
        <link rel="icon" type="image/png" href="/notr.png" />
        <link rel="apple-touch-icon" type="image/png" href="/notr.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>Notr</title>
      </Head>

      {isUpdate && router.pathname !== '/accountSettings/app_update' && (
        <UpdatePopUp
          currentV={`Your version: ${currentV || 0}`}
          newV={`The latest version: ${newV || 0}`}
          actions={[
            <span onClick={() => setIsUpdate(false)}>Later</span>,
            <span
              onClick={() => {
                setIsUpdate(false);
                router.push('/accountSettings/app_update');
              }}
            >
              Check
            </span>,
          ]}
        />
      )}
    </div>
  );
}