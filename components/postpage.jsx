import Post from './post.jsx';
import { useEffect, useState, useRef } from 'react';
import styles from '../styles/postPage.module.scss';
import { Book, WifiOff } from 'lucide-react';
import { useRouter } from 'next/router';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';
import { useCache } from '../hooks/notrCachingHook.js';
import PullToRefresh from 'pulltorefreshjs'

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
  const { getCache, setCache } = useCache('posts')
  
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
        setPosts(prev => {
          const newPosts = [...prev, ...data.posts];
          setCache(newPosts);
          return newPosts;
        });
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
    const data = getCache('posts')
    
    if (user) {
      if (Capacitor.isNativePlatform() && mode) {
        data? setPosts(data) : fetchPosts()
      }else{
        data? setPosts(data) : fetchPosts()
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
  
  useEffect(() => {
    PullToRefresh.init({
      mainElement: '#body',
      onRefresh(){
        try {
          setPosts([])
          fetchPosts()
        } catch (error) {
          console.error(error);
        }
      }
    })
    
    return () => PullToRefresh.destroyAll()
  }, []);
  
  return (
    <div id="body" style={{marginTop: '100px'}} className={styles.body}>
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