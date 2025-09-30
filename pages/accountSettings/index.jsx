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
} from 'lucide-react';
import Header from '../../components/header.jsx'
import { useRouter } from 'next/router'
import styles from '../../styles/settings.module.scss'
import Question from '../../components/confirm.jsx'
import Loader from '../../components/loading_spinner.jsx'
import { useEffect, useState } from 'react'

export default function settings(){
  const router = useRouter()
  const [isPopup, setIsPopup] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [msgIndex, setMsgIndex] = useState()
  const [data, setData] = useState({})
  const [autoSave, setAutoSave] = useState('')
  const [user, setUser] = useState('')
  const [token, setToken] = useState('')
  
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
        text={'Settings'} 
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
            Privacy
          </span>
          <ChevronRight/>
        </div>
        { /*accessibility*/ }
        <div onClick={() => {
          router.push('/accountSettings/accessibility')
        }} className={styles.component}>
          <span className={styles.span}>
            <Accessibility size={20}/>
            Accessibility
          </span>
          <ChevronRight/>
        </div>
        { /*About*/ }
        <div onClick={() => {
          router.push('/accountSettings/about')
        }} className={styles.component}>
          <span className={styles.span}>
            <Info size={20}/>
            About
          </span>
          <ChevronRight/>
        </div>
        { /*Support*/ }
        <div onClick={() => {
          router.push('/accountSettings/support')
        }} className={styles.component}>
          <span className={styles.span}>
            <LifeBuoy size={20}/>
            Support
          </span>
          <ChevronRight/>
        </div>
        { /*Log out*/ }
        <div onClick={() => {
          setIsPopup(true)
          setMsgIndex(0)
        }} className={styles.component}>
          <span className={styles.span}>
            <LogOut size={20}/>
            Logout
          </span>
        </div>
        { /*Delete account*/ }
        <div 
          onClick={() => {
            setIsPopup(true)
            setMsgIndex(1)
          }} 
          style={{color: 'red',justifyContent: 'space-between'}} className={styles.component}>
          <span className={styles.span}>
            <Trash size={20}/>
            Delete account 
          </span>
          <span style={{color: 'lightgray'}}>
            {isDeleting? 'Deleting...' : ''}
          </span>
        </div>
      </div>
      <p style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '12px',
        bottom: '10px',
        color: '#5f5f5f',
        position: 'fixed',
        placeSelf: 'center',
      }}><Bug size={13.5}/> Report any bugs to the <a style={{textDecoration: 'none', fontWeight: 'bold', color: 'white'}} href='https://www.facebook.com/mlbdev'>developer</a></p>
    </div>
  );
}