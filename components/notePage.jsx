import { Search, Heart, Menu, Trash, Plus, User, List, Edit, Settings } from 'lucide-react';
import styles2 from '../styles/addNote.module.scss';
import styles1 from '../styles/header.module.scss';
import styles from '../styles/home.module.scss';
import Note from './note.jsx';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AddNote from './addNote.jsx';
import Loader from './loading_spinner.jsx';
import noteStyles from '../styles/noteStyles.module.scss';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { Network } from '@capacitor/network';
import { useRouter } from 'next/router';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { useTranslation } from 'react-i18next';
import { useCache } from '../hooks/notrCachingHook.js';
import PullToRefresh from 'pulltorefreshjs'

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState('');
  const [userName, setUserName] = useState('');
  const [add, setAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState('Online');
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [networkConn, setNetworkConn] = useState('Online');
  const [token, setToken] = useState('');
  const { setCache, getCache } = useCache('notes');
  
  const isNative = Capacitor.getPlatform() !== 'web';
  
  const saveNoteData = async (data) => {
    if (!isNative || notes.length === 0) return;
    try {
      await Filesystem.writeFile({
        path: 'notr_offline.json',
        data: JSON.stringify(data),
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
    } catch (e) {
      console.error('Failed to save offline notes:', e);
      await Toast.show({
        text: 'Something went wrong while saving notes.',
        duration: 'long',
        position: 'bottom',
      })
    }
  };
  
  const readFile = async () => {
    if (!isNative) return [];
    try {
      await Filesystem.stat({
        path: 'notr_offline.json',
        directory: Directory.Data,
      });
  
      const file = await Filesystem.readFile({
        path: 'notr_offline.json',
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
  
      return JSON.parse(file.data || '[]');
    } catch (error) {
      console.warn('Offline file not found or corrupted:', error.message);
      return [];
    }
  };

  useEffect(() => {
    const initApp = async () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      const userToken = JSON.parse(localStorage.getItem('token'));
      if (userData && userToken) {
        setUser(userData._id);
        setUserName(userData.username);
        setToken(userToken);
      }

      if (isNative) {
        const status = await Network.getStatus();
        const online = status.connected;
        setMode(online ? 'Online' : 'Offline');
        setNetworkConn(online ? t('notePage.networkStatusTrue') : t('notePage.networkStatusFalse'));

        if (!online) {
          const offlineNotes = await readFile();
          if (offlineNotes.length > 0) setNotes(offlineNotes);
        } else {
          getNotesFunc();
        }

        Network.addListener('networkStatusChange', async (status) => {
          const connected = status.connected;
          setMode(connected ? 'Online' : 'Offline');
          setNetworkConn(connected ? t('notePage.networkStatusTrue') : t('notePage.networkStatusFalse'));
          if (connected) {
            getNotesFunc();
          } else {
            const offlineNotes = await readFile();
            setNotes(offlineNotes);
          }
        });
      } else {
        setMode('Online');
        setNetworkConn('Online');
        getNotesFunc();
      }
    };

    initApp();
  }, []);

  const getNotesFunc = async () => {
    if (!user || !token) return;

    if (mode === 'Offline') {
      const offlineNotes = await readFile();
      if (offlineNotes.length > 0) setNotes(offlineNotes);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`https://notrbackend.vercel.app/api/getNotes`, {
        headers: { token },
      });
      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false)
        if (Capacitor.isNativePlatform()) {
          await Toast.show({
            text: 'Something went wrong, try again',
            duration: 'long',
            position: 'bottom'
          })
        }else{
          console.log('Something went wrong, try again', e)
        }
      }
      if (res.ok) {
        setCache(data.response);
        setNotes(data.response);
        await saveNoteData(data.response);
      }
    } catch (err) {
      console.error('Fetch notes failed:', err);
      const cachedData = getCache();
      if (cachedData?.length) setNotes(cachedData);
      else {
        const offlineNotes = await readFile();
        if (offlineNotes.length) setNotes(offlineNotes);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      const cached = getCache();
      if (cached?.length) {
        setNotes(cached);
      } else {
        getNotesFunc();
      }
    }
  }, [user, token, mode]);
  
  const addNote = async () => {
    if (mode === 'Offline') {
      await Toast.show({
        text: "You're offline.",
        duration: 'short',
        position: 'bottom',
      });
      return;
    }
    if (!title.trim()) return;

    try {
      setIsLoading(true);
      const res = await fetch('https://notrbackend.vercel.app/api/addNote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({ title: title.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setTitle('');
        getNotesFunc();
      }
    } catch (err) {
      alert(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteNote = async (noteId, token) => {
    if (mode === 'Offline') {
      await Toast.show({
        text: "You're offline.",
        duration: 'short',
        position: 'bottom',
      });
      return;
    }

    try {
      const res = await fetch(`https://notrbackend.vercel.app/api/delete/${noteId}`, {
        method: 'DELETE',
        headers: { token },
      });
      if (res.ok) getNotesFunc();
    } catch (err) {
      console.log('Delete error:', err);
    }
  };
  
  useEffect(() => {
    PullToRefresh.init({
      mainElement: '#body',
      onRefresh(){
        try {
          setIsLoading(true)
          getNotesFunc()
        } catch (error) {
          console.error(error);
        }
      }
    })
    
    return () => PullToRefresh.destroyAll()
  }, []);

  return (
    <div id="body" style={{ 
      marginTop: '100px',
    }} className={styles.body}>
      {user && token ? (
        <div className={styles.networkDiv}>
          <p>{t('notePage.noteLengthText', { returnsObject: true, notesLength: notes.length })}</p>
          <div
            style={{
              border: '1px solid #262626',
              backgroundColor: '#1d1d1d',
            }}
            className={styles.networkMsg}
          >
            <div
              style={{
                outline: mode === 'Online' ? '1px solid #03b500' : '1px solid #ff4646',
                backgroundColor: mode === 'Online' ? '#03b500' : '#ff4646',
              }}
              className={styles.networkPoint}
            ></div>
            <span style={{ color: 'darkgray', fontSize: '10px' }}>{networkConn || 'Offline'}</span>
          </div>
        </div>
      ) : (
        ''
      )}

      {user ? (
        <div className={styles.notesContainer}>
          {notes.length >= 1
            ? notes.map((note, i) => (
                <Note
                  noteId={note._id}
                  tag={note.tag}
                  key={i}
                  networkStatus={mode}
                  token={token}
                  title={
                    note.title.length > 25
                    ? `${note.title.substring(0, 25)}...`
                    : `${note.title}`
                  }
                  note={
                    note.note.length <= 0
                      ? t('notePage.empty')
                      : note?.note?.length > 35
                      ? `${note.note.substring(0, 35)}...`
                      : `${note.note}`
                  }
                  time={`${note.updatedAt.substring(0, 10)} • ${userName}`}
                  deleteFunc={
                    <Trash
                      size={15}
                      className={noteStyles.deleteIcon}
                      onClick={() => deleteNote(note._id, token)}
                    />
                  }
                />
              ))
            : ''}
        </div>
      ) : (
        <div className={styles.noUser}>
          <User size={50} className={styles.icon} />
          <p className={styles.text}>
            <Link style={{ textDecoration: 'none', fontWeight: 'bold', color: 'white' }} href={'/auth/login'}>
              login
            </Link>{' '}
            or{' '}
            <Link style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }} href={'/auth/register'}>
              create an account
            </Link>{' '}
            to add or share your notes.
          </p>
        </div>
      )}

      {user && token ? (
        <Plus
          onClick={() => {
            user != null ? setAdd(true) : null;
          }}
          style={{
            bottom: mode === 'Offline' ? '30px' : '65px',
          }}
          className={styles.add}
        />
      ) : (
        ''
      )}

      {user && notes.length < 1 ? (
        <div className={styles.noUser}>
          <Plus
            onClick={() => {
              setAdd(true);
            }}
            size={50}
            className={styles.icon}
          />
          <p className={styles.text}>{t('notePage.addNotesText')}</p>
        </div>
      ) : (
        ''
      )}

      {user && isLoading && networkConn !== 'Offline'? (
        <Loader loaderColor={'white'} />
      ) : null}

      {add && user ? (
        <div className={styles2.blur}>
          <div className={styles2.msgBox}>
            <strong
              style={{
                fontSize: '20px',
                margin: '25px 0 0 0',
              }}
            >
              {t('notePage.addNoteTitle')}
            </strong>
            {user ? (
              <input
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && title.trim()) {
                    addNote();
                    setAdd(false);
                  }
                }}
                className={styles2.input}
                type="text"
                placeholder={t('notePage.enter_a_name')}
                style={{
                  marginTop: user ? '20px' : '16.5px',
                }}
              />
            ) : (
              'Login or register first.'
            )}
            <div
              className={styles2.buttonsDiv}
              style={{
                display: 'flex',
                gap: '10px',
              }}
            >
              <button
                onClick={() => {
                  setAdd(false);
                }}
                className={styles2.btn}
                type="submit"
              >
                {t('notePage.cancel')}
              </button>
              <button
                onClick={() => {
                  if (title.trim()) {
                    addNote();
                    setAdd(false);
                  }
                }}
                className={styles2.btn}
                type="submit"
              >
                {t('notePage.addNote')}
              </button>
            </div>
            {!user ? (
              <p style={{ margin: '35px 0 0 0' }}>
                <Link
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                  }}
                  href={'/auth/login'}
                >
                  Login
                </Link>{' '}
                to add notes
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}