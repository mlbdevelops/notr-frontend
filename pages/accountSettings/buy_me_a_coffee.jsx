import { useRouter } from 'next/router';
import { Browser } from '@capacitor/browser';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core'

export default function buy_me(){
  useEffect(() => {
    const redirect = async () => {
      if (Capacitor.isNativePlatorm()) {
        await Browser.open('https://buy.stripe.com/test_eVq4gz3chfW68yM6Btb7y00')
      }else{
        await useRouter().redirect('https://buy.stripe.com/test_eVq4gz3chfW68yM6Btb7y00')
      }
    }
  }, [])
  
  return(
    <h1>Redirecting...</h1>
  );
}