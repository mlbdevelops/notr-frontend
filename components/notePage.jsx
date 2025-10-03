import { Search, Heart, Menu, Trash, Plus, User, List, Edit, Settings } from 'lucide-react';
import styles2 from '../styles/addNote.module.scss';
import styles1 from '../styles/header.module.scss';
import styles from '../styles/home.module.scss';
import Note from './note.jsx';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AddNote from './addNote.jsx';
import Loader from './loading_spinner.jsx'
import noteStyles from '../styles/noteStyles.module.scss';
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { useRouter } from 'next/router'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export default function home(){
  const router = useRouter()
  const [user, setUser] = useState('')
  const [userName, setUserName] = useState('')
  const [getAgain, setGetAgain] = useState('')
  const [add, setAdd] = useState(false)
  const [title, setTitle] = useState('')
  const [mode, setMode] = useState('')
  const [notes, setNotes] = useState([])
  const [queryData, setQueryData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [networkConn, setNetworkConn] = useState('')
  const [token, setToken] = useState('')
  const [list, setList] = useState()
  
  const saveNoteData = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Filesystem.writeFile({
          path: 'notr_offline.json',
          data: JSON.stringify(notes),
          directory: Directory.Data,
          encoding: Encoding.UTF8,
        });
      } catch (e) {
        alert('Something went wrong, if the problem persists, contact us.')
      }
    }
  };
  
  const readFile = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const file = await Filesystem.readFile({
          path: 'notr_offline.json',
          directory: Directory.Data,
          encoding: Encoding.UTF8,
        });
        return JSON.parse(file.data);
      } catch (error) {
        alert('Something went wrong while getting your notes, try again later.');
      }
    }
  };
  
  useEffect(() => {
    const setOfflineNotes = async () => {
      if (user && token && mode === 'Offline') {
        const offlineNotes = await readFile()
        setNotes(offlineNotes);
      }
    }
    setOfflineNotes()
  }, [user, token, mode]);
  
  useEffect(() => {
    let listener;
    const initNetworkListener = async () => {
      if (Capacitor.isNativePlatform()) {
        const status = await Network.getStatus();
        setNetworkConn(status.connected? 'Online' : 'Offline')
        setMode(status.connected? 'Online' : 'Offline')
        listener = Network.addListener('networkStatusChange', async (status) => {
          setNetworkConn(status.connected? 'Online': 'Offline');
          const offlineNotes = await readFile()
          if (status.connected) getNotesFunc()
          setMode(status.connected? 'Online': 'Offline')
          if (!status.connected) {
            setNotes(offlineNotes)
          }
        });
      }
    }
    initNetworkListener();

    return () => { if (listener) listener.remove(); }
  }, [user, token])
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = JSON.parse(localStorage.getItem('token'));
    if (user && token) {
      setUser(user._id);
      setUserName(user.name);
      setToken(token);
    }
 }, []);
 
  const getNotesFunc = async () => {
    try{
      setIsLoading(true)
      if (!user) return;
      const res = await fetch(`https://notrbackend.vercel.app/api/getNotes`, {
        headers: {
          'token' : token
        }
      });
      const noteList = await res.json();
      if (res.ok) {
        setIsLoading(false);
        setNotes(noteList.response)
        saveNoteData()
      }
      return {
        err: {
          error : false
        }
      };
    }catch(err) {
      console.log(err)
    }
  }
  
  useEffect(() => {
    getNotesFunc()
  }, [user, token, networkConn !== 'Offline'])
  
  const addNote = async () => {
    try{
    setIsLoading(true)
    const res = await fetch('https://notrbackend.vercel.app/api/addNote', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'token' : token
      },
      body: JSON.stringify({
        title : title.trim(),
      })
    });
    const data = await res.json();
    if (res.ok) {
      data.length >= 1? setIsLoading(false) : null
      getNotesFunc();
    }
    }catch(err){
      alert(err)
    }
  };
  
  const deleteNote = async (note, token) => {
    const res = await fetch(`https://notrbackend.vercel.app/api/delete/${note}`, {
      method: 'DELETE',
      headers: {
        'token' : token
      }
    });
    if (res.ok) {
      getNotesFunc()
    }
  };
  
  return(
    <div style={{marginTop: '100px'}} className={styles.body}>
    <div className={styles.networkDiv}>
      <p>
        You have {notes.length} notes
      </p>
      <div style={{
        border: '1px solid',
        borderColor: networkConn == 'Online'? '#03b500' : '#ff4646',
      }} className={styles.networkMsg}>
        <div style={{
          outline: networkConn == 'Online'? '1px solid #03b500' : '1px solid #ff4646',
          backgroundColor: networkConn == 'Online'? '#03b500' : '#ff4646'
        }} className={styles.networkPoint}></div>
        <span style={{color: 'darkgray', fontSize: '10px',}}>
          {networkConn}
        </span>
      </div>
    </div>
    
      { user? 
        <div className={styles.notesContainer}>
          { notes.length >= 1? notes.map((note, i) => (
            <Note 
              noteId={note._id} 
              tag={note.tag}
              key={i} 
              title={`${note.title.substring(0, 20)}`} 
              note={note.note.length <= 0? 'Empty' : note?.note?.length > 35? `${note.note.substring(0, 35)}...` : `${note.note}`}
              time={`${note.updatedAt.substring(0, 10)} • ${userName}`}
              deleteFunc={<Trash 
                size={15}
                className={noteStyles.deleteIcon}
                onClick={() => {
                  deleteNote(note._id, token)
              }}/>}
            />
          )) : ''}
        </div> : <div className={styles.noUser}>
        <User size={50} className={styles.icon}/>
        <p className={styles.text}><Link style={{textDecoration: 'none', fontWeight: 'bold', color: 'white',}} href={'/auth/login'}>login</Link> or <Link style={{textDecoration: 'none', color: 'white', fontWeight: 'bold',}} href={'/auth/register'}>create an account</Link> to add or share your notes. </p>
        </div> }
        
      
      {user && token? <Plus onClick={() => {
        user != null? setAdd(true) : null
      }} style={{
        bottom: networkConn == 'Offline'? '30px' : '65px'
      }} className={styles.add}/> : ''}
      
      { user && notes.length < 1?
        <div className={styles.noUser}>
          <Plus onClick={() => {
            setAdd(true)
          }} size={50} className={styles.icon}/>
          <p className={styles.text}>Empty list, add new notes</p>
        </div>
      : '' }
      
      {user && isLoading && networkConn !== 'Offline' && notes.length == 0?
        <Loader loaderColor={'white'}/>
      : null}
      
      {add && user? 
      <div className={styles2.blur}>
        <div className={styles2.msgBox}>
          <strong style={{
            fontSize: '20px',
            margin: '25px 0 0 0',
          }}>Add a note</strong>
          {user? 
            <input 
              onChange={(e) => setTitle(e.target.value)} 
              onKeyPress={(e) => {
                if(e.key === 'Enter' && title){
                  addNote()
                  setAdd(false)
                }
              }}
              className={styles2.input} type="text" 
              placeholder="Enter a name"
              style={{
                marginTop: user? '20px' : '16.5px',
              }}
            /> : 'Login or register first.'}
          <div className={styles2.buttonsDiv} style={{
            display: 'flex',
            gap: '10px'
          }}>
            <button onClick={() => {
              setAdd(false)
            }} className={styles2.btn} type='submit'>
              Close
            </button>
            <button onClick={() => {
              title? addNote() : ''
              title? setAdd(false) : ''
            }} className={styles2.btn} type='submit'>
              Submit
            </button>
          </div>
          <p style={{
            margin: 0,
          }}>
            { !user? <p style={{margin: '35px 0 0 0',}}> <Link style={{
              color: 'white',
              fontWeight: 'bold',
              textDecoration: 'none',
              
            }} href={'/auth/login'}>Login</Link> to add notes </p>: null}
          </p>
        </div>
      </div>
      : null }
    </div>
  )
}