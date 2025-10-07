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
  Images
} from 'lucide-react';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/accInfo.module.scss'
import Post from '../components/post.jsx'
import { Share as CapShare } from '@capacitor/share';
import { useTranslation } from 'react-i18next';

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
  const [isPicShown, setIsPicShown] = useState(false)
  const [isMore, setIsMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('user')) || ''
    setUser(userId)
    userId.photoUrl? setUserProfile(userId.photoUrl) : ''
    const token = JSON.parse(localStorage.getItem('token')) || ''
    
    const getUser = async (token) => {
      setIsLoading(true)
      const res = await fetch(`https://notrbackend.vercel.app/api/getUserInfo`, {
        headers: {
          'token': token
        }
      })
      const data = await res.json()
      if (res.ok) {
        setIsLoading(false)
        setUser(data.user)
        setUserProfile(data?.user?.photoUrl)
        setNotes(data.notes)
        setPosts(data.posts)
        setLikeCont(data.likeCount)
        setConnections(data.connections)
      }
    }
    getUser(token)
  }, [user?._id])
  
  const copyFunc = async () => {
    try {
      await navigator.clipboard.writeText(`https://notr-app.vercel.app/user?id=${user?._id}`).trim();
    } catch (error) {
      console.log(error)
    }
    setIsMore(false)
  }
  
  const shareProfile = async () => {
    if (!user) {
      return setIsMore(false)
    }
    const shareData = {
      title: user?.name,
      text:
`Hey, it's me ${user?.name}

Let's connect on Notr. Here's my link

https://notr-app.vercel.app/user?id=${user?._id}
`
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
    <div style={{marginTop: '100px'}} className={styles.body}>
      <Header
        leftIcon={<ChevronLeft style={{padding:'10px'}} onClick={() => router.back()}/>}
        text={<small>{user?.name}</small>}
        rightIcons={[
          <Menu onClick={() => setIsMore(true)}/>,
        ]}
        isTransparent={true}
        blur={'15px'}
      />
      
      {isPicShown?
        <div onClick={() => setIsPicShown(false)} className={styles.picDiv}>
          <img src={user.photoUrl} className={styles.shownPicture}/>
        </div>
      : null}
      
      { isMore?
        <div onClick={() => setIsMore(false)} className={styles.blur}>
          <div className={styles.optionsDiv}>
            
            <span onClick={shareProfile} className={styles.option}><Share size={20}/>{t('account.options.share')}</span>
            
            <span onClick={copyFunc} className={styles.option}><Link size={20}/>{t('account.options.copy_link')}</span>
            
            <span 
              className={styles.option}
              onClick={() => router.push('/accountSettings')}><Settings size={20}/>{t('account.options.moreSets')}</span>
            
          </div>
        </div>
      : ''}
      
      <div className={styles.cover}>
        {user?.coverUrl? <img className={styles.coverPic} src={user?.coverUrl} alt=""/> : <Images className={styles.noCover} size={30}/>}
        <div className={styles.profileDiv}>
          {userProfile? <img src={userProfile} height={80} width={80} onClick={() => setIsPicShown(true)} className={styles.profilePic}/> : <User size={30} className={styles.userIcon}/>}
          <span className={styles.role}>
            {user?.role || 'Geust'}
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
          </div> : ''}
          
        {!isLoading && posts.length >= 1?
          <div>
            {posts.map((post, i) => (
              <Post 
                tag={post?.tag}
                note={post?.note}
                title={post?.title}
                username={post?.owner?.username}
                ownerId={post?.owner?._id}
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
          !isLoading && posts.length == 0? <div className={styles.empty}>
            <Camera size={60} className={styles.cam}/>
            <strong>{t('account.no_post')}</strong>
          </div>
        : ''}
      </div>
    </div>
  );
}