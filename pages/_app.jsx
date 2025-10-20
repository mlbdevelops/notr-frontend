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
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { useCache } from '../hooks/notrCachingHook.js';
import { LocalNotifications } from '@capacitor/local-notifications';
import { scheduleDailyNotifications } from '../utils/notifs.js';
import Image from 'next/image';

let isCommentOpen = false;
let closeCommentFn = null;

export const setGlobalCommentState = (state, closer) => {
  isCommentOpen = state;
  closeCommentFn = closer || null;
};

export default function AppWrapper({ Component, pageProps }) {
  const [size, setSize] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [currentV, setCurrentV] = useState();
  const [newV, setNewV] = useState();
  const [versionCheckedNum, setVersionCheckedNum] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDApp, setIsDApp] = useState(true);
  const [isUpdateCheckDone, setIsUpdateCheckDone] = useState(false);
  const router = useRouter();
  const { setCache } = useCache('update');
  
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
    if (!Capacitor.isNativePlatform()) return;
    
    scheduleDailyNotifications();
    const listener = LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notification) => {
        const target = notification.notification.extra?.targetPage || '/';
        router.push(target);
      }
    );
    return () => listener.remove();
  }, [router]);
  
  useEffect(() => {
    document.body.style.overflow = isUpdate ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [isUpdate]);
  
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({ color: 'transparent' });
  }, []);
  
  useEffect(() => {
    setInterval(() => {
      if (!isDApp) {
        setIsDApp(true)
      }
    }, 1000 * 30)
  }, [isDApp]);
  
  const openUrl = async () => {
    await Browser.open({url: 'https://download2296.mediafire.com/tpib0vuwcmsgNSK-7x8e7fyk8QwKHWNbmwUfKS_W0TNP32N5ZpBu-UFxNhu9EBnBeXfnlQ6Do4frShF4-J1clJByCrjSSfs4jstLOAVDY7QT9qCz57gH8E0sqKJyzudjW7HBTtwtT_QmNWy7dlzOL2foaHesZWntYHFXvCJgMHLSIXJZ/3f77tn2z8ihyjb0/notr-main-eb1728-release.apk'})
  }
  
  useEffect(() => {
    const handler = App.addListener('backButton', () => {
      if (isCommentOpen && closeCommentFn) {
        closeCommentFn();
      } else if (window.location.pathname === '/') {
        App.exitApp();
      } else {
        window.history.back();
      }
    });
    return () => handler.remove();
  }, []);
  
  useEffect(() => {
    const checkForUpdate = async () => {
      if (!Capacitor.isNativePlatform()) return;
      try {
        const response = await fetch('https://notrbackend.vercel.app/notr/app/version');
        const data = await response.json();
        const info = await App.getInfo();
        const currentVersion = info.version;
        setCurrentV(currentVersion);
        setNewV(data.latestVersion);
        if (currentVersion !== data.latestVersion && data.apkUrl) {
          sessionStorage.setItem('update', JSON.stringify(data));
          setIsUpdate(true);
          if (Number(versionCheckedNum) === 5) {
            setIsUpdateCheckDone(true);
            return router.push('/accountSettings/app_update');
          }
          if (versionCheckedNum >= 1) {
            if (versionCheckedNum === 5) {
              return;
            } else {
              localStorage.setItem('versionCheckedNum', versionCheckedNum + 1);
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
      
      { !Capacitor.isNativePlatform() && isDApp?
        (
          <div draggable={true} class='getAppBar'>
            <div class='bar'>
              <span onClick={() => setIsDApp(false)} class='closeB'>
                ×
              </span>
              <Image class='barImg' src={'./notr.png'} width={50} height={50}/>
              <small>
                Browse faster on the app
              </small>
              <button onClick={openUrl} class='barButton'>
                Get
              </button>
            </div>
          </div>
        )
      : ''}
      
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