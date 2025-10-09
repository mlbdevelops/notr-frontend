import Post from './post.jsx';
import { useEffect, useState, useRef } from 'react';
import styles from '../styles/postPage.module.scss';
import { Book, WifiOff } from 'lucide-react';
import { useRouter } from 'next/router';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';

export default function PostPage() {
  const [posts, setPosts] = useState([]);
  const [mode, setMode] = useState();
  const [user, setUser] = useState('');
  const [token, setToken] = useState('');
  const [postsLength, setPostsLength] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const router = useRouter();
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const token = JSON.parse(localStorage.getItem('token'));
    if (savedUser) {
      setUser(savedUser._id);
      setToken(token);
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const url = new URL("https://notrbackend.vercel.app/api/posts/getPosts");
      url.searchParams.append("userId", user);
      url.searchParams.append("limit", 10);
      if (cursor) url.searchParams.append("cursor", cursor);

      const res = await fetch(url, {
        headers: {'token' : token}
      });
      const data = await res.json();

      if (res.ok) {
        setPosts(prev => [...prev, ...data.posts]);
        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
        setPostsLength(data.posts.length);
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(() => {
    let listener;
    const initNetworkListener = async () => {
      if (Capacitor.isNativePlatform()) {
        const status = await Network.getStatus();
        setMode(status.connected)
        
        listener = Network.addListener('networkStatusChange', async (status) => {
          setMode(status.connected)
          if (status.connected) fetchPosts()
        });
      }
    }
    initNetworkListener();

    return () => { if (listener) listener.remove(); };
  }, [user, token])
  
  useEffect(() => {
    if (user) {
      if (Capacitor.isNativePlatform() && mode) {
        fetchPosts()
      }else{
        fetchPosts()
      }
    }
  }, [user, mode]);

  useEffect(() => {
    if (!loaderRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && mode) {
          fetchPosts();
        }
      },
      { threshold: 1.0 }
    );
    
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, cursor, mode]);
  
  if (!user) {
    return(
      <div style={{
        margin: '70px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '80dvh',
        gap: '30px'
      }}>
        <small>
          You have to register yourself to see posts.
        </small>
        
        <button style={{
          width: '70%',
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          color: 'black',
          cursor: 'pointer',
          backgroundColor: 'white',
        }} onClick={() => router.push('/auth/login')}>
          Login
        </button>
        
        <strong style={{color: 'darkgray'}}>
          Or
        </strong>
        
        <button style={{
          cursor: 'pointer',
          width: '70%',
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          color: 'black',
          backgroundColor: 'white',
        }} onClick={() => router.push('/auth/register')}>
          Create an account
        </button>
      </div> 
    )
  }
  
  if (Capacitor.isNativePlatform() && !mode) {
    return (
      <div style={{
        height: '60dvh',
        marginTop: 100,
        width: '100dvw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          fontSize: 12,
          gap: 20,
          color: 'darkgray',
        }}>
          <WifiOff size={80}/>
          You're offline, Make sure you are connected and try again.
        </span>
      </div>
    )
  }
  
  return (
    <div style={{marginTop: '100px'}} className={styles.body}>
      {posts.map(post => (
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
      ))}

      {!hasMore && (
        <div className={styles.div}>
          <strong>No more posts to see</strong>
          <Book className={styles.i} />
        </div>
      )}

      {hasMore && (
        <div
          ref={loaderRef}
          style={{
            width: '100%',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
        <div style={{
          height: '30px',
          width: '30px',
          borderRadius: '300px',
          border: '1px solid',
          borderTopColor: 'transparent'
        }} className={styles.loader}></div> 
        </div>
      )}
    </div>
  );
}