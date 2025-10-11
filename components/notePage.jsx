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

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();

  const [user, setUser] = useState('');
  const [userName, setUserName] = useState('');
  const [add, setAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState('');
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [networkConn, setNetworkConn] = useState('');
  const [token, setToken] = useState('');

  const { setCache, getCache } = useCache('notes');
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = JSON.parse(localStorage.getItem('token'));
    if (user && token) {
      setUser(user._id);
      setUserName(user.name);
      setToken(token);
    }
  }, []);
  
  const isNative = Capacitor.getPlatform() !== 'web';
  
  const saveNoteData = async () => {
    if (!isNative || notes.length === 0) return;
    try {
      await Filesystem.writeFile({
        path: 'notr_offline.json',
        data: JSON.stringify(notes),
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
    } catch (e) {
      console.error('Failed to save offline notes:', e);
      alert('Something went wrong saving notes.');
    }
  };
  
  const readFile = async () => {
    if (!isNative) return [];
    try {
      const file = await Filesystem.readFile({
        path: 'notr_offline.json',
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      return JSON.parse(file?.data || '[]');
    } catch (error) {
      console.log('No offline file found:', error);
      return [];
    }
  };
  
  useEffect(() => {
    let removeListener;
    const initNetworkListener = async () => {
      if (isNative) {
        const status = await Network.getStatus();
        setNetworkConn(status.connected ? t('notePage.networkStatusTrue') : t('notePage.networkStatusFalse'));
        setMode(status.connected ? 'Online' : 'Offline');

        const handler = await Network.addListener('networkStatusChange', async (status) => {
          const online = status.connected;
          setNetworkConn(online ? t('notePage.networkStatusTrue') : t('notePage.networkStatusFalse'));
          setMode(online ? 'Online' : 'Offline');

          if (online) {
            getNotesFunc();
          } else {
            const offlineNotes = await readFile();
            setNotes(offlineNotes);
          }
        });

        removeListener = handler.remove;
      } else {
        setMode('Online');
      }
    };

    initNetworkListener();
    return () => {
      if (removeListener) removeListener();
    };
  }, [user, token]);
  
  useEffect(() => {
    const setOfflineNotes = async () => {
      if (token && mode === 'Offline') {
        const offlineNotes = await readFile();
        setNotes(offlineNotes);
      }
    };
    setOfflineNotes();
  }, [token, mode]);
  
  const getNotesFunc = async () => {
    if (mode === 'Offline' || !user || !token) return;
    try {
      setIsLoading(true);
      const res = await fetch(`https://notrbackend.vercel.app/api/getNotes`, {
        headers: {
          token: token,
        },
      });
      const noteList = await res.json();
      if (res.ok) {
        setCache(noteList.response);
        setNotes(noteList.response);
        await saveNoteData();
      }
    } catch (err) {
      console.log('Error fetching notes:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (user && token) {
      const cachedData = getCache();
      if (cachedData?.length) {
        setNotes(cachedData);
      } else if (mode !== 'Offline') {
        getNotesFunc();
      }
    }
  }, [user, token]);
  
  const addNote = async () => {
    if (mode === 'Offline') {
      await Toast.show({
        text: "You're offline.",
        duration: 'long',
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
        duration: 'long',
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

  return (
    <div style={{ marginTop: '100px' }} className={styles.body}>
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
                  title={`${note.title.substring(0, 35)}`}
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

      {user && isLoading && networkConn !== 'Offline' && notes.length === 0 ? (
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