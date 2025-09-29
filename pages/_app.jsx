import '../styles/global.css';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { App } from '@capacitor/app';
import { useRouter } from 'next/router';

export default function app({Component, pageProps}){
  const [size, setSize] = useState();
  
  useEffect(() => {
    setSize(localStorage.getItem('size') || 0)
  }, [!size]);
  
  useEffect(() => {
    const handler = App.addListener('backButton', () => {
      // If on root page, exit app
      if (window.location.pathname === '/') {
        App.exitApp();  // exits app
      } else {
        window.history.back(); // go back to previous page
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
        <title>Notr - Note taking/sharing app</title>
      </Head>
    </div>
  )
}