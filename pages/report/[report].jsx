import Header from '../../components/header.jsx'
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/router'
import styles from '../../styles/report.module.scss'
import Loader from '../../components/loading_spinner.jsx';
import Question from '../../components/confirm.jsx';
import { useState, useEffect } from 'react';

export default function report(){
  const [load, setLoad] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const router = useRouter();
  
  const harmfulContents = [
    'Harassment or bullying',
    'Hate speech',
    'Plagiarism',
    'Offensive or abusive language',
    'Nudes / sexually explicit content',
    'Self-harm or suicide promotion',
    'Violence or gore',
    'Misinformation or disinformation',
    'Illegal activities (drugs, weapons, piracy)',
    'Spam or scam content',
    'Terrorism or extremist content',
    'Child sexual abuse material (CSAM)',
    'Impersonation or identity theft',
    'Malware or harmful software links',
  ];
  
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
        text='Reason for report'
        leftIcon={<ChevronLeft onClick={() => router.back()}/>}
        blur={'20px'}
        rightIcons={
          <AlertTriangle/>
        }
      />
      <div className={styles.msgDiv}>
        <span className={styles.msgTitle}>Before reporting</span>
        <small>
          Please choose the reason that best describes the issue. 
          Your feedback helps us keep this community safe, respectful, and enjoyable for everyone. 
          Thank you for helping us make this space better!
        </small>
      </div>
      
      {load?
        <Loader loaderColor={'white'}/>
      : ''}
      
      {confirm?
        <Question title={'Report'} msg='Are you sure you want to report this post?' actions={[
          <p onClick={() => setConfirm(false)}>Cancel</p>,
          <p onClick={report}>Report</p>
          ]}/>
      : ''}
      
      <div className={styles.reportDiv}>
        { router?.query?.reported? 
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