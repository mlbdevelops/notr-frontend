import { 
  ChevronLeft,
  Lock,
  Info,
  LogOut, 
  Bug,
  Save, 
  User, 
  Trash,
  ChevronRight,
  Accessibility,
  HelpingHand,
  LifeBuoy,
  HandHeart,
  ArrowUp,
  Globe,
  Moon,
  Locales,
  Star,
  ArrowUpCircle
} from 'lucide-react';
import Header from '../../components/header.jsx'
import { useRouter } from 'next/router'
import styles from '../../styles/settings.module.scss'
import Question from '../../components/confirm.jsx'
import Loader from '../../components/loading_spinner.jsx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useCache } from '../../hooks/notrCachingHook.js';

export default function settings(){
  const { t } = useTranslation()
  const router = useRouter()
  const [isPopup, setIsPopup] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [msgIndex, setMsgIndex] = useState()
  const [data, setData] = useState({})
  const [autoSave, setAutoSave] = useState('')
  const [user, setUser] = useState('')
  const [token, setToken] = useState('')
  const [update, setUpdate] = useState(true)
  const [isNewUpdate, setIsNewUpdate] = useState(false)
  const { clear } = useCache()
  
  useEffect(() => {
    const userid = JSON.parse(localStorage.getItem('user'))?._id || ''
    const token = JSON.parse(localStorage.getItem('token')) || ''
    setToken(token)
  }, [])
  
  const logOut = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  };
  
  useEffect(() => {
    function value() {
      const setv = localStorage.getItem('isAutoSave');
      setAutoSave(setv)
    }
    value()
  }, [])
  
  useEffect(() => {
    const update = sessionStorage.getItem('isNewUpdate')
    if (update) {
      setIsNewUpdate(true)
    }
  }, [isNewUpdate])
  
  useEffect(() => {
    const ls = localStorage.getItem('isAutoSave');
    localStorage.setItem('isAutoSave', autoSave);
  }, [autoSave]);

  const popActions = [
    {
      title: 'Logout',
      msg: 'Are you sure you want to logout?',
      actions: [
        <button
          className={styles.btn}
          onClick={() => {
            setIsPopup(false)
          }}>No</button>,
        <button onClick={logOut} className={styles.btn}>Yes</button>
      ]
    },
    {
      title: 'Delete account',
      msg: 'Are you sure you want to delete your account?',
      actions: [
        <button className={styles.btn} onClick={() => setIsPopup(false)}>No</button>,
        <button onClick={() => deleteAcc(user)} className={styles.btn}>Yes</button>
      ]
    },
  ]
  
  const deleteAcc = async (userId) => {
    setIsDeleting(true)
    setIsPopup(false)
    const res = await fetch(`https://notrbackend.vercel.app/api/delete`, {
      method: 'DELETE',
      headers: {
        'token' : token
      }
    })
    const data = await res.json()
    console.log(data)
    if (res.ok) {
      setIsDeleted(true)
      logOut()
      setData(data)
    }
  }
  
  return(
    <div style={{marginTop: '100px'}}>
      <Header
        text={t('header.setting')}
        isTransparent={true}
        blur={'10px'}
        leftIcon={<ChevronLeft style={{padding:'5px', cursor : 'pointer'}} onClick={() => router.back()} />}
      />
      { isDeleted? 
        <Question msg={data.response} title={'Account deleted'} actions={<button className={styles.btn} onClick={logOut}>Ok</button>}/> : null
      }
      {isPopup? 
        <Question 
          msg={popActions[msgIndex]?.msg}
          title={popActions[msgIndex]?.title}
          actions={popActions[msgIndex]?.actions}
        />
      : null}
      
      { isDeleting?
        <Loader loaderColor='white'/>
      : ''}
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        margin: '70px 0',
        marginTop: '94px',
        width: '100%',
        gap: '5px',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        { /*Privacy*/ }
        <div onClick={() => {
          router.push('/accountSettings/privacy')
        }} className={styles.component}>
          <span className={styles.span}>
            <Lock size={20}/>
            {t('accSettings.privacy')}
          </span>
          <ChevronRight/>
        </div>
        { /*accessibility*/ }
        <div onClick={() => {
          router.push('/accountSettings/accessibility')
        }} className={styles.component}>
          <span className={styles.span}>
            <Star size={20}/>
            {t('accSettings.accessibility')}
          </span>
          <ChevronRight/>
        </div>
        
        {/* Theme
        <div onClick={() => {
          router.push('/accountSettings/theme')
        }} className={styles.component}>
          <span className={styles.span}>
            <Moon size={20}/>
            Dark mode
          </span>
          <ChevronRight/>
        </div>*/}
        
        {/*Language*/}
        <div onClick={() => {
          router.push('/accountSettings/language')
        }} className={styles.component}>
          <span className={styles.span}>
            <Globe size={20}/>
            {t('accSettings.langs')}
          </span>
          <ChevronRight/>
        </div>
        
        { /*app update*/ }
        <div onClick={() => {
          router.push('/accountSettings/app_update')
        }} className={styles.component}>
          <span className={styles.span}>
            <ArrowUpCircle size={20}/>
            {t('accSettings.update')}
          </span>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            {isNewUpdate? <span style={{padding: '7px', borderRadius: '50px', backgroundColor: '#6a69fe',}}>
              
            </span> : ''}
            <ChevronRight/>
          </div>
        </div>
        
        { /*buy_me_a_coffee*/ }
        <div onClick={() => {
          router.push('/accountSettings/buy_me_a_coffee')
        }} className={styles.component}>
          <span className={styles.span}>
            <HandHeart size={20}/>
            {t('accSettings.buy_coffee')}
          </span>
          <ChevronRight/>
        </div>
        
        { /*Support*/ }
        <div onClick={() => {
          router.push('/accountSettings/support')
        }} className={styles.component}>
          <span className={styles.span}>
            <LifeBuoy size={20}/>
            {t('accSettings.support')}
          </span>
          <ChevronRight/>
        </div>
        
        { /*About*/ }
        <div onClick={() => {
          router.push('/accountSettings/about')
        }} className={styles.component}>
          <span className={styles.span}>
            <Info size={20}/>
            {t('accSettings.about')}
          </span>
          <ChevronRight/>
        </div>
        
        { /*Log out*/ }
        <div onClick={() => {
          setIsPopup(true)
          setMsgIndex(0)
          clear()
        }} className={styles.component}>
          <span className={styles.span}>
            <LogOut size={20}/>
            {t('accSettings.logout')}
          </span>
        </div>
        
        { /*Delete account*/ }
        <div 
          onClick={() => {
            setIsPopup(true)
            setMsgIndex(1)
            clear()
          }} 
          style={{color: 'red',justifyContent: 'space-between'}} className={styles.component}>
          <span className={styles.span}>
            <Trash size={20}/>
            {t('accSettings.deleteAcc')}
          </span>
          <span style={{color: 'lightgray'}}>
            {isDeleting? 'Deleting...' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}