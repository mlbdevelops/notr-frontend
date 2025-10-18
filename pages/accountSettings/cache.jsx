import Header from '../../components/header.jsx';
import { ChevronLeft, Save } from 'lucide-react';
import { useRouter } from 'next/router';
import styles from '../../styles/cache.module.scss'
import { useCache } from '../../hooks/notrCachingHook.js';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { useState } from 'react'
import ClearCache from 'capacitor-clear-cache'; // ✅ replace WebViewCache

export default function cache(){
  const router = useRouter();
  const { getProvider, remove, clear } = useCache()
  const notes = getProvider('notes')
  const posts = getProvider('posts')
  const onePostSize = 800
  const oneNoteSize = 500
  const [calNotes, setCalNotes] = useState(notes? oneNoteSize*notes?.length/1024/1024 : 0)
  const [calPosts, setCalPosts] = useState(posts? onePostSize*posts?.length/1024/1024 : 0)
  
  const clear_cache = async () => {
    try {
      remove('posts')
      remove('notes')
      setCalPosts(0)
      setCalNotes(0)
      if (Capacitor.isNativePlatform()) {
        await ClearCache.clear();
        return await Toast.show({
          text: 'Cache cleared',
          position: 'bottom',
          duration: 'long'
        })
      }
    } catch (error) {
      await Toast.show({
        text: error,
        position: 'bottom',
        duration: 'long'
      })
    }
  }
  
  return(
    <div className={styles.body}>
      <Header
        isTransparent={true}
        blur={'10px'}
        text='Cache'
        leftIcon={
          <ChevronLeft
            style={{
              padding: 10,
            }}
            onClick={() => {
              router.back()
            }}
          />
        }
        rightIcons={
          <Save/>
        }
      />
      
      <div className={styles.mbCount}>
        {(calPosts + calNotes).toString().slice(0, 6)}Mb
      </div>
      
      <div className={styles.datas}>
        <span className={styles.option}>
          Posts
          <small>
            {calPosts.toString().slice(0, 6)}Mb
          </small>
        </span>
        <span className={styles.option}>
          Notes
          <small>
            {calNotes.toString().slice(0, 6)}Mb
          </small>
        </span>
      </div>
      <button className={styles.clearB} onClick={clear_cache}>
        Clear cache
      </button>
    </div>
  );
}