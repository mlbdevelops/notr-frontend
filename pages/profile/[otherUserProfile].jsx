'use client';

import Header from '../../components/header.jsx';
import { 
  ChevronLeft,
  Info,
  LogOut, 
  Copy,
  User,
  Trash,
  Camera,
  Menu,
  Check,
  Lock,
  Images
} from 'lucide-react';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../../styles/accInfo.module.scss'
import Post from '../../components/post.jsx'
import Loader from '../../components/loading_spinner.jsx'
import { useTranslation } from 'react-i18next';
import { Toast } from '@capacitor/toast'
import { Capacitor } from '@capacitor/core'
import PullToRefresh from 'pulltorefreshjs'

export default function account(){
  const { t } = useTranslation()
  const router = useRouter()
  const [user, setUser] = useState({})
  const [connections, setConnections] = useState()
  const [loggedUser, setLoggedUserId] = useState('')
  const [token, setToken] = useState('')
  const [userParam, setUserParam] = useState('')
  const [posts, setPosts] = useState([])
  const [likeCount, setLikeCont] = useState(0)
  const [isConnected, setIsConnect] = useState(false)
  const [isPicShown, setIsPicShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {}
    const token = JSON.parse(localStorage.getItem('token')) || ''
    if (user?._id && token) {
      setToken(token)
      setLoggedUserId(user._id || 'null')
    }
  }, [loggedUser])
  
  const getUser = async (userId, loggedUser) => {
    setIsLoading(true)
    try {
      if (!userId) return
      const res = await fetch(`https://notrbackend.vercel.app/api/users/getOtherProfile/${userId}/logged/${loggedUser}`)
      const data = await res.json()
      if (!res.ok || res.status === 404) {
        setIsLoading(false)
        if (Capacitor.isNativePlatform()) {
          await Toast.show({
            text: data.msg || 'Something went wrong, Try to load the page.',
            duration: 'long',
            position: 'bottom',
          });
        }else{
          alert(data.msg || 'Something went wrong, Try to load the page.')
        }
      }
      if (res.ok) {
        setUser(data.user)
        setPosts(data.posts)
        setLikeCont(data.likeCount)
        setConnections(data.connections)
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    const userId = new URLSearchParams(window.location.search).get('user')
    
    if (userId && loggedUser) {
      setUserParam(userId)
      getUser(userId, loggedUser)
    }
  }, [router.isReady, loggedUser])
  
  useEffect(() => {
    const getConnected = async () => {
      if (!user?._id) return
      const res = await fetch(`https://notrbackend.vercel.app/api/users/knowConnection/${user?._id}`, {
        headers: {
          'token' : token
        }
      })
      const data = await res.json()
      if (res.ok && data.msg) {
        return setIsConnect(true)
      }
      return setIsConnect(false)
    }
    getConnected()
  }, [user?._id])
  
  const connect = async () => {
    if (!user) {
      if (confirm('Login to perform this action')) {
        router.push('/auth/login')
      }
    }
    
    if (!user?._id) {
      return alert("Something went wrong or this user isn't available.")
    }
    const res = await fetch(`https://notrbackend.vercel.app/api/users/connect`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'token' : token
        },
        body: JSON.stringify({
          connect: user?._id
        })
      })
    const data = await res.json()
    if (res.ok && data.msg == 'connected') {
      setIsConnect(true)
      return setConnections((prev) => prev += 1)
    }
    setConnections((prev) => prev -= 1)
    setIsConnect(false)
  }
  
  useEffect(() => {
    PullToRefresh.init({
      mainElement: document.getElementById('body'),
      onRefresh(){
        if (userParam && loggedUser) {
          getUser(userParam, loggedUser)
        }
      },
      refreshTimeout: 500
    })
    return () => PullToRefresh.destroyAll()
  }, [userParam, loggedUser])
  
  return(
    <div id="body" style={{marginTop: '95px'}} className={styles.body}>
      <Header
        leftIcon={<ChevronLeft style={{padding:'10px'}} onClick={() => router.back()}/>}
        text={<small>{user?.name || '•••'}</small>}
        isTransparent={true}
        blur={'15px'}
      />
      
      {isPicShown?
        <div onClick={() => setIsPicShown(false)} className={styles.picDiv}>
          <img src={user.photoUrl} className={styles.shownPicture}/>
        </div>
      : null}
      
      {isLoading? <Loader loaderColor='white'/> : ''}
      
      <div className={styles.cover}>
        {user?.coverUrl? <img className={styles.coverPic} src={user?.coverUrl} alt=""/> : <Images className={styles.noCover} size={30}/>}
        <div className={styles.profileDiv}>
          {user?.photoUrl? <img onClick={() => user?.isPrivate? null : setIsPicShown(true)} src={user?.photoUrl} height={80} width={80} className={styles.profilePic}/> : <User size={30} className={styles.userIcon}/>}
          <span className={styles.role}>
            {user.isPrivate? <Lock size={13}/> : user?.role || 'Geust'}
          </span>
        </div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.info}>
          <span className={styles.username}>
            @{user?.username || ' •••'}
          </span>
          <span className={styles.conn}>
            {connections} connections
          </span>
        </div>
        
      </div>
      {user?.isPrivate? '' : user?.bio? <div className={styles.bioDiv}>
        <span className={styles.bio}>{user?.bio}</span> 
      </div> : ''}
      <div style={{display: user.isPrivate? 'none' : ''}} className={styles.buttonsDiv}>
        <button 
          onClick={connect} 
          className={styles.connectB}
        >{isConnected? <span style={{display: 'flex', alignItems: 'center',}}>{t('otherUserProfile.connected')} <Check className={styles.icon} size={15}/></span> : t('otherUserProfile.connect')}</button>
      </div>
      <div style={{display: user?.isPrivate? 'none' : 'flex'}} className={styles.metrics}>
        <span>
          {`${posts.length} posts`}
        </span>
      </div>
      <div className={styles.postsDiv}>
        {!user?.isPrivate && posts.length >= 1?
          <div>
            {posts.map((post, i) => (
              <Post tag={post?.tag}
                note={post?.note}
                title={post?.title}
                username={post?.owner?.username}
                ownerId={post?.owner?._id}
                _id={post?._id}
                accProfile={post?.userProfile}
                photos={post.photosUrls}
                loggedUser={loggedUser}
                likedByUser={post?.likedByUser}
                likes={post?.likeCount}
                time={post?.createdAt.substring(0, 10)}
                fontFamily={post?.fontFamily}
                textAlign={post?.textAlign}
                fontStyle={post?.fontStyle}
                fontWeight={post?.fontWeight}
              />
            ))}
          </div>
        : 
          <div className={styles.empty}>
            {user?.isPrivate? <Lock size={60} className={styles.cam}/> : <Camera size={60} className={styles.cam}/>}
            { user?.isPrivate? <span>
              This account is private
            </span> : ''}
          </div>
        }
      </div>
    </div>
  );
}