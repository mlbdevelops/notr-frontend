import Header from '../../components/header.jsx';
import { ChevronLeft, Save } from 'lucide-react';
import { useRouter } from 'next/router';
import styles from '../../styles/cache.module.scss';
import { useCache } from '../../hooks/notrCachingHook.js';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { useEffect, useState } from 'react';

export default function Cache() {
  const router = useRouter();
  const { getProvider, remove } = useCache();
  const notes = getProvider('notes');
  const posts = getProvider('posts');
  const onePostSize = 800;
  const oneNoteSize = 500;
  const [calNotes, setCalNotes] = useState(notes ? (oneNoteSize * notes?.length) / 1024 / 1024 : 0);
  const [calPosts, setCalPosts] = useState(posts ? (onePostSize * posts?.length) / 1024 / 1024 : 0);
  const [WebViewCache, setWebViewCache] = useState(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('capacitor-plugin-webview-cache')
        .then((mod) => setWebViewCache(mod.WebViewCache || mod.default))
        .catch((err) => console.error('Failed to load WebViewCache plugin:', err));
    }
  }, []);

  const clear_cache = async () => {
    try {
      remove('user');
      remove('posts');
      setCalPosts(0);
      setCalNotes(0);

      if (Capacitor.isNativePlatform() && WebViewCache) {
        await WebViewCache.clear();
        await Toast.show({
          text: 'Cache cleared',
          position: 'bottom',
          duration: 'long',
        });
        return;
      }

      await Toast.show({
        text: 'Cache cleared (web only)',
        position: 'bottom',
        duration: 'long',
      });
    } catch (error) {
      await Toast.show({
        text: error.message || 'Error clearing cache',
        position: 'bottom',
        duration: 'long',
      });
    }
  };

  return (
    <div className={styles.body}>
      <Header
        isTransparent={true}
        blur={'10px'}
        text="Cache"
        leftIcon={
          <ChevronLeft
            style={{ padding: 10 }}
            onClick={() => router.back()}
          />
        }
        rightIcons={<Save />}
      />

      <div className={styles.mbCount}>
        {(calPosts + calNotes).toString().slice(0, 6)}Mb
      </div>

      <div className={styles.datas}>
        <span className={styles.option}>
          Posts
          <small>{calPosts.toString().slice(0, 6)}Mb</small>
        </span>
        <span className={styles.option}>
          Notes
          <small>{calNotes.toString().slice(0, 6)}Mb</small>
        </span>
      </div>

      <button className={styles.clearB} onClick={clear_cache}>
        Clear cache
      </button>
    </div>
  );
}