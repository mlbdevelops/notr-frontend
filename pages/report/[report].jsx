import Header from '../../components/header.jsx'
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/router'
import styles from '../../styles/report.module.scss'
import Loader from '../../components/loading_spinner.jsx';
import Question from '../../components/confirm.jsx';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function report(){
  const [load, setLoad] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const router = useRouter();
  const {t} = useTranslation();
  
  const harmfulContents = t('harmfulContents', {returnObjects: true})
  
  console.log(harmfulContents)
  
  const report = () => {
    setConfirm(false)
    setLoad(true)
    setTimeout(() => {
      router.back()
      setLoad(false)
    }, 3500)
  }
  
  return(
    <div style={{marginTop: '95px'}} className={styles.body}>
      <Header 
        isTransparent={true}
        text={t('reportMsgBox.reason')}
        leftIcon={<ChevronLeft onClick={() => router.back()}/>}
        blur={'20px'}
        rightIcons={
          <AlertTriangle/>
        }
      />
      <div className={styles.msgDiv}>
        <span className={styles.msgTitle}>{t('reportMsgBox.title')}</span>
        <small>
          {t('reportMsgBox.msg')}
        </small>
      </div>
      
      {load?
        <Loader loaderColor={'white'}/>
      : ''}
      
      {confirm?
        <Question title={t('reportMsgBox.alert.title')} msg={t('reportMsgBox.alert.msg')} actions={[
          <p onClick={() => setConfirm(false)}>{t('reportMsgBox.alert.no')}</p>,
          <p onClick={report}>{t('reportMsgBox.alert.ok')}</p>
          ]}/>
      : ''}
      
      <div className={styles.reportDiv}>
        {router?.query?.reported? 
          harmfulContents.map((harmful, i) => ( 
            <p onClick={() => setConfirm(true)} className={styles.report}>
              {harmful}
              <ChevronRight size={20}/>
            </p>
          ))
        : null}
      </div>
    </div>
  );
}