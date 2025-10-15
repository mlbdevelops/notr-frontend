import Header from '../../components/header.jsx';
import { ChevronLeft, Save } from 'lucide-react';
import { useRouter } from 'next/router';
import styles from '../../styles/cache.module.scss'
import { useCache } from '../../hooks/notrCachingHook.js';
import { CapacitorClearCache } from 'capacitor-clear-cache';
import { useState } from 'react'

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
    clear()
    setCalPosts(0)
    setCalNotes(0)
    await CapacitorClearCache.clear();
  }
  
  return(
    <div className={styles.body}>
      <Header
        isTransparent={true}
        blur={'10px'}
        text='Cache'
        leftIcon={
          <ChevronLeft
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
      <button onClick={clear_cache}>
        Clear cache
      </button>
    </div>
  );
}