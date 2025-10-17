import Header from '../../components/header.jsx';
import Loader from '../../components/loading_spinner.jsx';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import { ChevronLeft, Bug, ChevronRight, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Browser } from '@capacitor/browser'
import styles from '../../styles/support.module.scss';

export default function support(){
  const router = useRouter();
  const { t } = useTranslation();
  
  const openWa = async () => {
    await Browser.open({
      url: 'https://wa.me/243816103994'
    })
  }
  
  return(
    <div style={{marginTop: '95px'}} className={styles.body}>
      <Header 
        text={t('header.support')}
        leftIcon={<ChevronLeft style={{padding: '10px 15px'}} onClick={() => router.back()}/>}
      />
      
      <div onClick={openWa} className={styles.option}>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}><Bug size={20}/>{t('support.report_a_prob')} (WhatsApp)</span>
        <ChevronRight/>
      </div>
      
      <a style={{color: 'white', textDecoration: 'none', cursor: 'none'}} href="mailto:notr73442@gmail.com" className={styles.option}>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}><MessageSquare size={20}/>{t('support.ask')} (Email)</span>
        <ChevronRight/>
      </a>
    </div>
  );
}