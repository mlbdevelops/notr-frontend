import '../styles/global.css';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function App({Component, pageProps}){
  const [size, setSize] = useState();
  
  useEffect(() => {
    setSize(localStorage.getItem('size') || 0)
  }, [!size]);
  
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
        <title>Notr - Note taking app</title>
      </Head>
    </div>
  )
}