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
      fontSize: size == 0? '13.5px' : size == 1? '15px' : size == 2? '17px' : size == 3? '19px' : size == 4? '21px' : '16px',
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