import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { ChevronLeft, Users, Type, List } from 'lucide-react';
import styles from '../../styles/query.module.scss';
import Post from '../../components/post.jsx';
import ProfileDiv from '../../components/profileDiv.jsx';
import Loader from '../../components/loading_spinner.jsx';
import { useTranslation } from 'react-i18next';

export default function query(){
  const router = useRouter();
  const {t} = useTranslation();
  const [q, setQ] = useState('');
  const [user, setUser] = useState('');
  const [token, setToken] = useState('');
  const [tabIndex, setTabIndex] = useState(1);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [noData, setNoData] = useState(false);
  const [load, setLoad] = useState(false);
  
  useEffect(() => {
    setToken(JSON.parse(localStorage.getItem('token')));
  }, [!token]);
  
  
  const getPosts = async (q2) => {
    if (!q) {
      return
    }
    setLoad(true)
    const res = await fetch('https://notrbackend.vercel.app/api/postsOrusers/search', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'token' : token
      },
      body: JSON.stringify({
        query: q2 || q
      })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      setUsers(data?.users)
      setPosts(data?.posts)
      setNoData(true)
      setLoad(false)
    }
  };
  
  useEffect(() => {
    getPosts(router.query.q)
  }, [router.query.q])
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user?._id) {
      setUser(user?._id)
    }
  }, [])
  
  return(
    <div style={{marginTop: '30px'}} className={styles.body}>
      <div className={styles.inpDiv}>
        <ChevronLeft onClick={() => router.back()}/>
        <input 
          type="text"
          className={styles.inp}
          placeholder={router.query.q} 
          onKeyPress={(e) => {
            getPosts()
          }}
          onChange={(e) => setQ(e.target.value)}
        /> 
      </div>
      
      {load?
        <Loader loaderColor='white'/>
      : ''}
      
      <div className={styles.resultDiv}>
        <div className={styles.tabs}>
          <span 
            className={styles.tab}
            style={{
              color: tabIndex == 1? 'white' : '#717171',
            }}
            onClick={() => setTabIndex(1)}
          ><Type size={17}/>{t('searchPage.notes')}</span>
          <span 
            className={styles.tab}
            style={{
              color: tabIndex == 2? 'white' : '#717171',
            }}
            onClick={() => setTabIndex(2)}
          ><Users size={17}/>{t('searchPage.accounts')}</span>
        </div>
      </div>
      
      <div className={styles.posts} style={{
        display: tabIndex == 1? 'flex' : 'none',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <p style={{
          padding: '20px',
          margin: 0,
          border: 'none',
          borderBottom: '1px solid #1d1d1d',
          color: '#878787',
          width: '89%',
          wordBreak: 'break-word'
        }}>{t('searchPage.result')} <span style={{color: 'white'}}>{q ||router.query.q}</span></p>
        {posts?.length >= 1? 
          posts?.map((post, i) => (
            <Post 
              key={post?._id}
              tag={post?.tag}
              note={post?.note}
              title={post?.title}
              username={post.owner?.username}
              ownerId={post?.owner?._id}
              _id={post._id}
              photos={post?.photosUrls}
              loggedUser={user}
              accProfile={post?.userProfile}
              likes={post?.likeCount}
              likedByUser={post?.likedByUser}
              fontFamily={post?.fontFamily}
              textAlign={post?.textAlign}
              fontStyle={post?.fontStyle}
              fontWeight={post?.fontWeight}
              time={post?.createdAt?.substring(0, 10)}
            />
          ))
        : <p
            style={{
              textAlign: 'center',
              marginTop: '150px',
              color: 'white',
            }}
          >{t('searchPage.no_result')} {q || router.query.q}!</p>}
      </div>
      
      <div style={{
        display: tabIndex == 2? 'flex' : 'none',
        width: '100%',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
      }}>
        <p style={{
          padding: '20px',
          margin: 0,
          border: 'none',
          borderBottom: '1px solid #1d1d1d',
          color: '#878787',
          width: '89%',
          wordBreak: 'break-word'
        }}>{t('searchPage.result')} <span style={{color: 'white'}}>{q || router.query.q}</span></p> 
        <div style={{
          width: '95%',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {users.length >= 1?
            users.map((user, i) => (
              <ProfileDiv 
                username={user.username}
                profile={user.photoUrl}
                userId={user._id}
                role={user.role}
              />
            ))
          : <p
              style={{
                textAlign: 'center',
                marginTop: '150px',
              }}
            >{t('searchPage.no_result')} {q || router.query.q}!</p>}
        </div>
      </div>
    </div>
  );
}