import { useState, useEffect } from 'react';
import Home from '../components/notePage.jsx'
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx'
import Image from 'next/image'
import { List, Heart, Search, Settings, User } from 'lucide-react'
import styles from '../styles/home.module.scss'
import styles1 from '../styles/header.module.scss';
import { useRouter } from 'next/router'
import PostPage from '../components/postpage.jsx'
import Question from '../components/confirm.jsx'

export default function home(){
  
  const [user, setUser] = useState('')
  const [name, setName] = useState('')
  const [profile, setProfile] = useState('')
  const [tabIndex, setTabIndex] = useState(0)
  const [noUser, setNoUser] = useState(false)
  const router = useRouter()
  const [scrollPositions, setScrollPositions] = useState({})
  
  const switchTab = (tab) => {
    setScrollPositions(prev => ({
      ...prev,
      [tabIndex]: window.scrollY
    }))
    setTabIndex(tab)
  }
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user._id);
      setProfile(user?.photoUrl);
      setName(user.name);
    }
 }, []);
 
  useEffect(() => {
    const tab = JSON.parse(localStorage.getItem('tab'));
    if (user) {
      if (tab) {
        setTabIndex(tab);
      }
    } else {
      setTabIndex(1);
    }
  }, [user]);
  
 useEffect(() => {
    tabIndex != 0? localStorage.setItem('tab', tabIndex) : null;
    if (scrollPositions[tabIndex] !== undefined) {
      window.scrollTo(0, scrollPositions[tabIndex])
    } else {
      window.scrollTo(0, 0)
    }
 }, [tabIndex]);
  
  const notes_icons = [
    <Settings onClick={() => user? router.push('/settings') : null} className={styles1.i}/>
  ]
  
  const posts_icons = [
    <Search onClick={() => {
      router.push('/search')
    }} size={23} className={styles1.i}/>,
    <div 
      style={{
        height: !profile? '35px' : '',
        width: !profile? '35px' : '',
      }}
      onClick={() => 
        user? router.push('/account') : setNoUser(true)
      }
      className={styles.profile}
    >{user? (profile? <img height={35} width={35} className={styles.profilePic} src={profile}/> : <User size={18}/>) : '?'}
    </div>
  ]
  
  return(
    <div>
      <Header 
        textColor={'white'}
        leftIcon={<Image height={100} width={100} src={'/background_less_logo.png'}/>}
        rightIcons={user? tabIndex == 1? notes_icons : posts_icons : ''}
        isTransparent={true}
        blur={'10px'}
      />
      
      { noUser?
        <Question msg={'Login to see your profile'} title={'Login'} actions={<p onClick={() => {
          setNoUser(false)
          router.push('/auth/login')
        }}>login</p>}/>
      : null}
      
      <div style={{
        display: tabIndex == 1? 'block' : 'none',
      }}>
        <Home/>
      </div>
      
      <div style={{
        display: tabIndex == 2? 'block' : 'none',
      }}>
        <PostPage/>
      </div>
      
      {user?
        <Footer icons={[
          <List 
            onClick={() => switchTab(1)}
            fill={tabIndex == 1? 'white' : ''}
            className={tabIndex == 1? styles.tabIconActive : styles.tabIcon} size={20}/>,
          <Heart 
            onClick={() => switchTab(2)} 
            className={tabIndex == 2? styles.tabIconActive : styles.tabIcon} 
            size={20}
            fill={tabIndex == 2? 'white' : ''}
          />
        ]}/> 
      : ''}
    </div>
  )
}