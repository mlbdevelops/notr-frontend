import Header from '../../components/header.jsx';
import { ChevronLeft, Lock, Planet, Earth } from 'lucide-react';
import { useRouter } from 'next/router';
import styles from '../../styles/privacy.module.scss';
import { useState, useEffect } from 'react';
import Loader from '../../components/loading_spinner.jsx';

export default function privacy(){
  const router = useRouter();
  const [isPrivate, setIsPrivate] = useState(false);
  const [load, setLoad] = useState(false);
  const [token, setToken] = useState('');
  
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token')) || '';
    token? setToken(token) : null
  }, []);
  
  useEffect(() => {
    const getPrivate = async (token) => {
      setLoad(true)
      const res = await fetch('https://notrbackend.vercel.app/api/user/isPrivate', {
        method: 'GET',
        headers:{
          'token' : token
        }
      })
      const data = await res.json();
      console.log(data)
      if (res.ok) {
        setIsPrivate(data.isPrivate)
        setLoad(false)
      }
    }
    getPrivate(token)
  }, [token]);
  
  const editPrivacy = async (tkn) => {
    setLoad(true);
    const data = {
      isPrivate : isPrivate? false : true
    }
    const res = await fetch('https://notrbackend.vercel.app/api/user/editIsPrivate', {
      method: 'POST',
      headers:{
        'Content-Type' : 'application/json',
        'token' : tkn,
      },
      body: JSON.stringify(data)
    })
    const response = await res.json()
    console.log(response)
    if (res.ok) {
      setIsPrivate(response.isPrivate)
      setLoad(false)
    }
  }
  
  return(
    <div className={styles.body}>
      <Header 
        text='Privacy'
        leftIcon={
          <ChevronLeft
            style={{padding: '10px 15px'}}
            onClick={() => router.back()}/>
        }
      />
      
      {load?
        <Loader loaderColor='white'/>
      : ''}
      
      <div 
        onClick={() => {
          isPrivate? setIsPrivate(false) : setIsPrivate(true)
          editPrivacy(token)
        }}
        className={styles.option}
      >
        <span style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          {isPrivate? <Earth/>  : <Lock size={20}/>} Switch to {isPrivate? 'public' : 'private'}
        </span>
        <div style={{
          placeContent: isPrivate? 'end' : 'start',
          transition: '1s'
        }} className={styles.switch}>
        	<div style={{
        	  backgroundColor: isPrivate? 'white' : '#181818',
        	}} className={styles.swch}></div>
        </div>
      </div>
      <span style={{
        margin: '10px',
        color: 'darkgray',
        fontSize: '12px',
        marginTop: '13.5px',
        marginBottom: 0,
        width: '95%',
      }}>
        If this option is enabled, no one will be able to : 
        <ul>
        	<li>See your profile details,</li>
        	<li>Connect with you,</li>
        	<li>See your posts on your profile.</li>
        </ul>
        Note: 
        <ul>
        	<li>Your posts are still visible on the feeds.</li>
        	<li>If your a teenager, this option will be automatically enabled when registering your account.</li>
        </ul>
      </span>
    </div>
  );
}