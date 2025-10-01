import { ChevronLeft, Lock, Info, LogOut, Save, User, Trash, Plus } from 'lucide-react';
import Header from '../../components/header.jsx'
import { useRouter } from 'next/router'
import styles from '../../styles/private.module.scss'
import Question from '../../components/confirm.jsx'
import Note from '../../components/note.jsx'
import { useEffect, useState } from 'react'
import PasswordDiv from '../../components/password.jsx'
import noteStyles from '../../styles/noteStyles.module.scss';
import styles2 from '../../styles/password.module.scss'
import styles3 from '../../styles/home.module.scss'
import Loader from '../../components/loading_spinner.jsx'

export default function Private(){
  const router = useRouter()
  
  const [user, setUser] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [textData, setTextData] = useState('')
  const [submitting, setSubmitting] = useState('')
  const [msg, setMsg] = useState('')
  const [notes, setNotes] = useState([])
  const [auth, setAuth] = useState(false)
  const [isSetAll, setIsSetAll] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)
  const [isPopUp, setIsPop] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [serverMsg, setServerMsg] = useState('')
  const [token, setToken] = useState('')
  const [text, setText] = useState('Set all as public')
  
  const allAsPublic = notes.map(note => {
    note.isPrivate = false
    return note
  });
  
  console.log(allAsPublic)
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    setToken(JSON.parse(localStorage.getItem('token')))
    setUser(user?._id)
    setUsername(user?.name)
  }, [])
  
  const getPassword = async () => {
    const res = await fetch(`https://notrbackend.vercel.app/api/notes/getPass`, {
      headers: {'token' : token}
    })
    const data = await res.json()
    if (res.ok) {
      setIsLoading(false)
      setTextData(data.msg)
    }
  }
  textData? null : getPassword()
  
  const setPws = async () => {
    setSubmitting('Submitting...')
    if (!password) {
      setSubmitting('Submit')
      return setMsg('Required field!')
    }
    setIsLoading(true)
    const res = await fetch(`https://notrbackend.vercel.app/api/notes/password`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'token' : token
      },
      body: JSON.stringify({
        password: password
      })
    })
    const data = await res.json()
    if (data.msg == 'Your password has succesfully been set') {
      setSubmitting('Submit')
      setIsLoading(false)
      return setAuth(true)
    }
    if (res.ok) {
      if (data.response) {
        setIsLoading(false)
        setSubmitting('Continue')
      }else{
        setIsLoading(false)
        setSubmitting('Submit')
      }
      data.response === true? getNotes() : null
      return setAuth(data.response? data.response : setMsg('Wrong password!'))
    }
    return setAuth(false)
  }
  
  const getNotes = async () => {
    setIsLoading(true)
    const res = await fetch(`https://notrbackend.vercel.app/api/notes/privateNotes`, {
      headers: {
        'token' : token
      }
    })
    const data = await res.json()
    console.log(data)
    if (res.ok) {
      setNotes(data.response)
      setIsLoading(false)
    }
  }
  
  const setAllAsPublic = async () => {
    setText('Setting...')
    setIsLoading(true)
    const res = await fetch(`https://notrbackend.vercel.app/api/notes/setAllAsPublic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token' : token
      },
      body: JSON.stringify({
        updates: allAsPublic
      })
    })
    const data = await res.json()
    if (res.ok) {
      setText('Set all as public')
      setIsDone(true)
      setIsLoading(false)
      setServerMsg(data.msg)
      getNotes()
    }
  }
  
  const deleteNote = async (note) => {
    setIsLoading(true)
    const res = await fetch(`https://notrbackend.vercel.app/api/delete/${note}`, {
      method: 'DELETE',
      headers: {
        'token' : token
      }
    });
    if (res.ok) {
      setNotes([])
    }
    getNotes()
  };
  
  return(
    <div style={{marginTop: '95px'}} className={styles.body}>
      <Header 
        text='Private notes' 
        leftIcon={<ChevronLeft style={{padding: '10px'}} onClick={() => router.back()}/>}
        rightIcons={<p onClick={() => {
          notes.length <= 0? setIsEmpty(true) : setIsSetAll(true)
          
        }} className={styles.setAll}>{text}</p>}
      />
      
      { isEmpty?
        <Question title={'Empty'} msg={'The list is empty!'} actions={<p onClick={() => setIsEmpty(false)}>Ok</p>}/>
      : null}
      
      { isDone?
        <Question title='Done' msg={serverMsg} actions={<p onClick={() => setIsDone(false)}>Ok</p>}/>
      : null}
      
      { isLoading? <Loader loaderColor={'white'}/> : ''}
      
      {isSetAll?
        <Question title='To public' msg={'Are you sure to set them to public?'} actions={[
          <p onClick={() => setIsSetAll(false)}>No</p>,
          <p onClick={() => {
            setIsSetAll(false)
            setAllAsPublic()
          }}>Yes</p>,
        ]}/>
      : null}
      
      { !auth? 
        <PasswordDiv 
          title={textData || 'Loading...'}
          input={
            <input 
              placeholder="Enter your password" 
              type="password" 
              className={styles2.input} 
              onKeyPress={setPws}
              onChange={(e) => setPassword(e.target.value)} 
            />
          }
          msg={msg}
          buttons={[
            <button 
              onClick={() => router.back()}
              className={styles2.btn}>Close</button>,
            <button 
              onClick={setPws} 
              className={styles2.btn}>{submitting || 'Submit'}</button>
          ]}
        />
      : ''}
      
      { 
        isPopUp?
        <Question title='Home' msg='Go to home page to add new notes.' actions={<p onClick={() => setIsPop(false)}>Ok</p>}/>
      : ''}
      
      
      <div className={styles.notesContainer}>
        { notes.length >= 1?
          <div className={styles.Notes}>
            {notes.map((note, i) => (
              <Note
                onClick={() => router.push(`/notes/${note.id}`)}
                noteId={note._id} 
                tag={note.tag}
                key={i} 
                title={`${note.title.substring(0, 20)}`} 
                note={note.note.length <= 0? 'Empty' : note.note.length > 35? `${note.note.substring(0, 35)}...` : `${note.note}`}
                time={`${note.updatedAt.substring(0, 10)} • ${username}`}
                deleteFunc={<Trash 
                  size={15}
                  className={noteStyles.deleteIcon}
                  onClick={() => {
                    deleteNote(note._id)
                }}/>}
              />
            ))}
          </div>
        : user && notes.length < 1?
        <div className={styles3.noUser}>
          <Plus onClick={() => {
            setIsPop(true)
          }} size={50} className={styles3.icon}/>
          <p className={styles3.text}>Empty list!</p>
        </div>
      : '' }
      </div>
    </div>
  );
}
