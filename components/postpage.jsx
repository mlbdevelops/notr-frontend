import Post from './post.jsx';
import { useEffect, useState, useRef } from 'react';
import styles from '../styles/postPage.module.scss';
import { Book, Newspaper } from 'lucide-react';
import { useRouter } from 'next/router';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';
import { useCache } from '../hooks/notrCachingHook.js';
import PullToRefresh from 'pulltorefreshjs';

export default function PostPage() {
  const { getCache, setCache, getProvider, saveProvider, remove } = useCache('posts');
  const [posts, setPosts] = useState([]);
  const [mode, setMode] = useState();
  const [user, setUser] = useState('');
  const [token, setToken] = useState('');
  const [postsLength, setPostsLength] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);
  const router = useRouter();
  
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const savedToken = JSON.parse(localStorage.getItem('token'));
    if (savedUser && savedToken) {
      setUser(savedUser._id);
      setToken(savedToken);
    }
  }, []);
  
  const fetchPosts = async () => {
    if (!user || isLoading || !hasMore) return;
    setIsLoading(true);
    
    try {
      const url = new URL("https://notrbackend.vercel.app/api/posts/getPosts");
      url.searchParams.append("userId", user);
      url.searchParams.append("limit", 10);
      if (cursor) url.searchParams.append("cursor", cursor);

      const res = await fetch(url, {
        headers: { token }
      });
      const data = await res.json();
      
      if (data.posts.length === 0 && posts.length === 0) {
        setPosts('nodata');
        setIsLoading(false);
        return;
      }
      if (data.posts.length === 0) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }
      
      if (res.ok) {
        setPosts(prev => {
          const newPosts = [...prev, ...data.posts];
          setCache(newPosts);
          saveProvider('cursor', data.nextCursor);
          return newPosts;
        });
        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
        setPostsLength(data.posts.length);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (!user) return;
    const cachedPosts = getCache('posts');
    const savedCursor = getProvider('cursor') || null;
    if (cachedPosts) setPosts(cachedPosts);
    if (savedCursor) setCursor(savedCursor);
    fetchPosts();
  }, [user]);
  
  useEffect(() => {
    let listener;
    const initNetworkListener = async () => {
      if (!Capacitor.isNativePlatform()) return;

      const status = await Network.getStatus();
      setMode(status.connected);

      listener = Network.addListener('networkStatusChange', async (status) => {
        setMode(status.connected);
        if (status.connected && posts.length === 0) {
          setCursor(getProvider('cursor') || null);
          fetchPosts();
        }
      });
    };
    initNetworkListener();

    return () => { if (listener) listener.remove(); };
  }, [user, token]);
  
  useEffect(() => {
    if (!loaderRef.current || posts.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && mode && !isLoading) {
          fetchPosts();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, cursor, mode, posts.length, isLoading]);
  
  useEffect(() => {
    PullToRefresh.init({
      mainElement: document.getElementById('body'),
      onRefresh() {
        try {
          setCursor(null);
          setHasMore(true);
          setPosts([]);
          remove('posts');
          saveProvider('cursor', null);
          fetchPosts();
        } catch (error) {
          console.error(error);
        }
      }
    });
    return () => PullToRefresh.destroyAll();
  }, [user])
  
  if (posts === 'nodata') {
    return (
      <div id="body" style={{ marginTop: '100px', height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className={styles.body}>
        <div style={{ height: 150, width: 150, borderRadius: 50, border: '1px solid darkgrey', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Newspaper size={50}/>
        </div>
        <strong style={{ fontSize: 25 }}>No post found</strong>
        <span onClick={() => router.push('/create/createNew')} style={{ color: '#6a69fe', cursor: 'pointer' }}>Be the first to share</span>
      </div>
    );
  }

  return (
    <div id="body" style={{ marginTop: '100px' }} className={styles.body}>
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
        <div ref={loaderRef} style={{ width: '100%', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ height: '30px', width: '30px', borderRadius: '300px', border: '1px solid', borderTopColor: 'transparent' }} className={styles.loader}></div>
        </div>
      )}
    </div>
  );
}