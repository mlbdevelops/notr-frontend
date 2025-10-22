import Header from '../components/header.jsx';
import { 
  ChevronLeft,
  Info,
  LogOut, 
  Copy,
  User,
  Trash,
  Camera,
  Menu,
  Share,
  Link,
  Settings,
  Images,
  Wend2,
  RotateCw,
  Heart,
  QrCode,
  UserPlus,
  Check
} from 'lucide-react';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/accInfo.module.scss'
import badge from '../styles/badge.module.scss'
import Post from '../components/post.jsx'
import { Share as CapShare } from '@capacitor/share';
import { useTranslation } from 'react-i18next';
import { Toast } from '@capacitor/toast'
import { useCache } from '../hooks/notrCachingHook.js';
import PullToRefresh from 'pulltorefreshjs'
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
import codeStyles from '../styles/qrcode.module.scss'
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export default function account(){
  const { t } = useTranslation()
  const router = useRouter()
  const [user, setUser] = useState({})
  const [userId, setUserId] = useState('')
  const [userProfile, setUserProfile] = useState('')
  const [note, setNotes] = useState()
  const [connections, setConnections] = useState()
  const [posts, setPosts] = useState([])
  const [likeCount, setLikeCont] = useState(0)
  const [userToken, setToken] = useState('')
  const [isPicShown, setIsPicShown] = useState(false)
  const [isMore, setIsMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCodeShown, setIsCodeShown] = useState(false)
  const [isNewUpdate, setIsNewUpdate] = useState(false)
  const [isManualReload, setIsManualReload] = useState(false)
  const [userData, setUserData] = useState()
  const { data, setCache } = useCache('user')
  const qrRef = useRef();

  const downloadQRCode = async () => {
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;
  
    const url = canvas.toDataURL("image/png");
    const base64Data = url.split(',')[1];
    const fileName = `${user.username}_qrcode_${Date.now()}.png`;
  
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
      try {
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Documents
        });
        await Toast.show({
          text: 'Saved',
          duration: 'long',
          position: 'bottom',
        })
      } catch (err) {
        alert(err);
      }
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
    }
  };
  
  const getUser = async (token) => {
    try {
      setIsLoading(true)
      const res = await fetch(`https://notrbackend.vercel.app/api/getUserInfo`, {
        headers: {
          'token': token
        }
      })
      const data = await res.json()
      console.log(data)
      if (!res.ok) {
        setIsManualReload(true)
        setIsLoading(false)
      }
      console.log(data)
      if (res.ok) {
        setCache(data)
        setIsLoading(false)
        setUserData(data)
        setUser(data.user)
        setUserProfile(data?.user?.photoUrl)
        setNotes(data.notes)
        setPosts(data.posts)
        setLikeCont(data.likeCount)
        setConnections(data.connections)
      }
    } catch (error) {
      setIsLoading(false)
      setIsManualReload(true)
    }
  }
  
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('user')) || {}
    userId._id = 'localId'
    setUser(userId)
    userId.photoUrl? setUserProfile(userId.photoUrl) : ''
    const token = JSON.parse(localStorage.getItem('token')) || ''
    
    setToken(token)
    if (!token || !userId?._id) {
      return;
    }
    
    if (data?.user?._id) {
      setIsLoading(false)
      setUser(data.user)
      setUserProfile(data?.user?.photoUrl)
      setNotes(data.notes)
      setPosts(data.posts)
      setConnections(data.connections)
    }else{
      getUser(token)
    }
    
  }, [])
  
  useEffect(() => {
    const isNewUpdate = sessionStorage.getItem('isNewUpdate')
    if (isNewUpdate) {
      setIsNewUpdate(true)
    }
  }, [isNewUpdate])
  
  const copyFunc = async () => {
    if (user?._id  == 'localId') {
      setIsMore(false)
      return showToast('Network error')
    }
    
    try {
      await navigator.clipboard.writeText(`https://notr-app.vercel.app/user?id=${user?._id}`).trim();
    } catch (error) {
      console.log(error)
    }
    setIsMore(false)
  }
  
  const showToast = async (text) => {
    if (Capacitor.isNativePlatform()) {
      await Toast.show({
        text: text,
        duration : 'short',
        position: 'bottom',
      })
    }
  }
  useEffect(() => {
  const token = JSON.parse(localStorage.getItem('token')) || '';

  const element = document.querySelector('#docBody');
  if (!element) return;

  PullToRefresh.init({
    mainElement: '#docBody',
    onRefresh() {
      return getUser(userToken);
    },
    iconArrow: '<div style="color:transparent; height: 0; width: 0;"></div>',
    iconRefreshing: `<div className="ptr-spinner" style="
      border: 3px solid rgba(255,255,255,0.2);
      border-top-color: white;
      border-radius: 50%;
      width: 22px;
      height: 22px;
      margin-top: 180px;
      animation: spin 0.6s linear infinite;
    "></div>`,
    getStyles: () => `
      .ptr--ptr {
        box-shadow: none !important;
        background: transparent !important;
        color: transparent !important;
        height: 0;
        z-index: 9999999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .ptr--box {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: white;
        height: 10px
      }
      .ptr--text {
        display: none !important;
      }
    `,
    instructionsPullToRefresh: false,
    instructionsReleaseToRefresh: false,
    instructionsRefreshing: false,
    refreshTimeout: 500,
  });

  return () => {
    PullToRefresh.destroyAll();
  };
}, [userToken]);
  
  
  isManualReload? showToast('Network error.') : null
  
  const shareApp = async () => {
    try {
      const shareData = {
        title: 'Notr',
        text:`https://notrapp.vercel.app`
      }
      if (Capacitor.isNativePlatform()) {
        await CapShare.share(shareData)
      }else{
        if (navigator.share) {
          await navigator.share(shareData)
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  const shareProfile = async () => {
    if (!user) {
      return setIsMore(false)
    }
    
    if (user?._id  == 'localId') {
      setIsMore(false)
      return showToast('Network error')
    }
    
    const shareData = {
      title: user?.name,
      text:`https://notr-app.vercel.app/user?id=${user?._id}`
    }
    
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log(error);
      }
    }else{
      try {
        await CapShare.share(shareData)
      } catch (error) {
        console.error(error);
      }
    }
    setIsMore(false)
  }
  
  return(
    <div id="docBody" style={{marginTop: '100px'}} className={styles.body}>
      <Header
        leftIcon={<ChevronLeft style={{padding:'10px'}} onClick={() => router.back()}/>}
        text={<small>{user?.name?.length >= 30? `${user?.name?.substring(0, 20)}...` : user?.name}</small>}
        rightIcons={[
          <div className={styles.moreIcon}>
            <Menu onClick={() => setIsMore(true)}/>
            {isNewUpdate? <div className={styles.purplePoint}></div> : null}
          </div>,
        ]}
        isTransparent={true}
        blur={'15px'}
      />
      
      {isPicShown?
        <div onClick={() => setIsPicShown(false)} className={styles.picDiv}>
          <img src={user.photoUrl} className={styles.shownPicture}/>
        </div>
      : null}
      
      {user?._id != 'localId' && isCodeShown? <div onClick={() => setIsCodeShown(false)} className={codeStyles.blur}>
        <div className={codeStyles.div} ref={qrRef}>
          <QRCodeCanvas style={{border: '1px solid #262626', borderRadius: 10, margin: 0, padding: 10, backgroundColor: '1d1d1d',}} value={`https://notr-app.vercel.app/user?id=${user?._id}`} size={256} />
        <button className={codeStyles.saveB} onClick={downloadQRCode}>{t('indivuNote.save')}</button>
        </div>
      </div> : ''}
      
      { isMore?
        <div onClick={() => setIsMore(false)} className={styles.blur}>
          <div className={styles.optionsDiv}>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-evenly',
            }}>
              <span style={{position: 'relative'}} onClick={shareProfile} className={styles.option}><Share size={20}/>{t('account.options.share')} 
              </span>
              <QrCode style={{
                padding: 10,
                borderRadius: 10,
              }}
              className={styles.code}
              onClick={() => setIsCodeShown(true)}
              />
            </div>
            
            <span onClick={copyFunc} className={styles.option}><Link size={20}/>{t('account.options.copy_link')}</span>
            
            <span onClick={shareApp} className={styles.option}><UserPlus size={20}/>{t('account.options.share_app')}</span>
            
            <span 
              style={{
                position: 'relative',
              }}
              className={styles.option}
              onClick={() => router.push('/accountSettings')}>
              <Settings size={20}/>{t('account.options.moreSets')}
              {isNewUpdate? <small className={styles.purple}>
                Update
              </small> : ''}
            </span>
            
          </div>
        </div>
      : ''}
      
      <div className={styles.cover}>
        {user?.coverUrl? <img className={styles.coverPic} src={user?.coverUrl} alt=""/> : <Images className={styles.noCover} size={30}/>}
        <div className={styles.profileDiv}>
          {userProfile? <img src={userProfile} height={80} width={80} onClick={() => setIsPicShown(true)} className={styles.profilePic}/> : <User size={30} className={styles.userIcon}/>}
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.info}>
          <span className={styles.username}>
            @{user?.username || ' •••'}
            {user?.isVerified?
              <Check size={10} className={badge.badge}/>
            : ''}
          </span>
          <span className={styles.conn}>
            {connections} connections
          </span>
          <span className={styles.role}>
            {`~ ${user?.role || 'Geust'}`}
          </span>
        </div>
      </div>
      
      {user?.bio? <div className={styles.bioDiv}>
        <span className={styles.bio}>{user?.bio}</span> 
      </div> : ''}
      
      <div className={styles.buttonsDiv}>
        <button onClick={() => router.push('/editProfile')} className={styles.btn}>{t('account.edit')}</button>
        <button onClick={() => router.push('/create/createNew')} className={styles.btn}>{t('account.create')}</button>
      </div>
      <div className={styles.metrics}>
        <span>
          {`${posts.length} ${t('account.posts')}`}
        </span>
        •
        <span>
          {note || 0} {t('account.notes')}
        </span>
      </div>
      <div className={styles.postsDiv}>
        { isLoading? <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100px',
            width: '100px',
            borderRadius: '20px',
            placeSelf: 'center',
            marginTop: '90px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          }}>
            <div className={styles.spinner}></div>
          </div> : isManualReload && posts?.length == 0?
          <div onClick={() => {
            setIsManualReload(false)
            getUser(userToken)
          }} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100px',
            width: '100px',
            borderRadius: '20px',
            placeSelf: 'center',
            marginTop: '90px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          }}>
            <RotateCw size={50}/>
          </div>
        : !isLoading && posts.length >= 1?
          <div>
            {posts.map((post, i) => (
              <Post 
                tag={post?.tag}
                note={post?.note}
                title={post?.title}
                username={post?.owner?.username}
                ownerId={post?.owner?._id}
                isVerified={post?.owner?.isVerified}
                _id={post?._id}
                accProfile={post?.userProfile}
                photos={post.photosUrls}
                loggedUser={user?._id}
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
          !isLoading && posts.length == 0 && connections >= 0? <div className={styles.empty}>
            <Camera size={60} className={styles.cam}/>
            <strong>{t('account.no_post')}</strong>
            <small onClick={() => {
              router.push('/create/createNew')
            }} style={{
              margin: '10px 0',
              fontWeight: 'bold',
              color: '#6a69fe',
              cursor: 'pointer'
            }}>Share your first thought</small>
          </div>
        : ''}
      </div>
    </div>
  );
}