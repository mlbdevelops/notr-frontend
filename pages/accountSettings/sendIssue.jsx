import Header from '../../components/header.jsx';
import { Bug, ChevronLeft, Plus } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styles from '../../styles/reportIssue.module.scss';
import Loader from '../../components/loading_spinner.jsx';

export default function sendIssue() {
  const router = useRouter()
  const [img, setImg] = useState([])
  const [load, setLoad] = useState(false)
  const [text, setText] = useState('')
  
  const setfiles = (e) => {
    try {
      const files = Array.from(e.target.files)
      if (files) {
        setImg((prev) => 
          [...new Set([...prev, ...files])]
        )
      }
      console.log(img)
    } catch (error) {
      console.error(error);
    }
  }
  
  const sendFunc = () => {
    if (!text) {
      return;
    }
    setLoad(true)
    setTimeout(() => {
      setLoad(false)
      setText('')
      setImg([])
    }, 4000)
  }
  
  return(
    <div style={{marginTop: '95px'}} className={styles.body}>
      <Header
        text='Report a problem'
        leftIcon={
          <ChevronLeft style={{padding: '10px'}} onClick={() => router.back()}/>
        }
        rightIcons={
          <Bug/>
        }
        isTransparent={true}
        blur='10px'
      />
      
      {load? 
        <Loader loaderColor='white'/>
      : ''}
      
      <label className={styles.label}>
        Describe what happened.
      </label>
      <textarea 
        className={styles.inp}
        type='text' 
        value={text}
        placeholder={'What happened'}
        onInput={(e) => setText(e.target.value)}
      />
      <label style={{fontWeight: 'bold', margin: '20px',}}>
        Add screenshots
      </label>
      <div className={styles.selectDiv}>
        <input 
          className={styles.inpImg}
          type='file'
          accept='image/*'
          onChange={setfiles}
          multiple
        />
        <Plus size={40} className={styles.plus}/>
      </div>
        <div style={{display: 'flex', alignItems: 'center', overflow: 'scroll', width: '100%', gap: '10px'}}>
          {img? img.map((image) => {
            const url = image? URL.createObjectURL(image) : ''
            return(
            <img 
              onClick={() => {
                setImg((prev) => prev.filter(pr => pr !== image))
              }}
              className={styles.img} 
              src={url}
            />)
          }) : ''}
        </div>
      <button onClick={sendFunc} className={styles.sendB}>
        Send issues
      </button>
    </div>
  );  
}