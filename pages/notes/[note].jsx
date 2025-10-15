"use client";

import { useRouter } from 'next/router';
import Header from '../../components/header.jsx';
import { 
  RotateCw,
  ChevronLeft,
  Trash,
  Copy,
  Bold,
  Italic,
  List,
  AlignRight,
  AlignCenter,
  Code,
  Share,
  Paste,
  Clipboard,
  Eraser,
  Key,
  EllipsisVertical
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Clipboard as CapClip } from '@capacitor/clipboard';
import { Share as CapShare } from '@capacitor/share';
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react';
import styles from '../../styles/notePage.module.scss';
import Question from '../../components/confirm.jsx'
import Options from '../../components/litlePopup.jsx'
import styles2 from '../../styles/litlePopup.module.scss';
import Loader from '../../components/loading_spinner.jsx';
import { Capacitor } from '@capacitor/core'
import { Toast } from '@capacitor/toast'

export default function note(){
  const router = useRouter();
  const { t } = useTranslation();
  const { note } = router.query;
  const [notes, setNotes] = useState({});
  const [title, setTitle] = useState('');
  const [isSave, setIsSave] = useState(false);
  const [fontFam, setFontFam] = useState('');
  const [fontWeight, setFontWeight] = useState('');
  const [fontStyle, setFontStyle] = useState('');
  const [tl, setTl] = useState('');
  const [tag, setTag] = useState('');
  const [tagPopUp, setTagPopUp] = useState(false);
  const [isOptions, setIsOptions] = useState(false);
  const [isShare, setIsShare] = useState(true);
  const [clear, setClear] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [optionsOff, setOptionsOff] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaste, setIsPaste] = useState(false);
  const [noData, setNoData] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  let isPrvt;
  const [newNote, setNewNote] = useState(notes?.note);
  const [newTitle, setNewTitle] = useState(notes?.title);
  const [autoSave, setAutoSave] = useState('');
  const [token, setToken] = useState('');
  
  const refTitle = useRef(null);
  const refNote = useRef(null);
  
  useEffect(() => {
    const clipboard = async () => {
      try {
        const clbTxt = await navigator.clipboard.readText();
        if (clbTxt) {
          setIsPaste(true)
        }
      } catch (error) {
      }
    }
    clipboard()
  }, [])
  
  useEffect(() => {
    setToken(JSON.parse(localStorage.getItem('token')))
  }, [])
  
  const shareNote = async () => {
    setIsOptions(false)
    if (!newNote) {
      return setIsShare(false)
    }
    const shareData = {
      title: newTitle,
      text: 
`Title: ${newTitle}

Note: ${newNote}
.
.
.
Notr - https://notr-sigma.vercel.app`
    }
    
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log(error);
      }
    }else{
      await CapShare.share({
        title: newTitle,
        text: 
`Title: ${newTitle}

Note: ${newNote}
.
.
.
Notr - https://notr-sigma.vercel.app`
      })
    }
  }
  
  useEffect(() => {
    const saved = localStorage.getItem('isAutoSave')
    setAutoSave(saved)
  }, [])
  
  const handleExpend = () => {
    const element = refNote.current;
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
  };
  
  const tagData=[{category:"Topic/Subject",tags:["ProjectProposal","MeetingNotes","Recipe","Ideas","Quotes","Memories","Challenges","Reflections","Goals","Journaling","Favorites","Stories","Tips","Advice","Opinions"]},{category:"Status",tags:["InProgress","Completed","Blocked","Pending","Reviewed"]},{category:"Priority",tags:["High","Medium","Low","Urgent"]},{category:"Context",tags:["Work","Personal","School","Travel","Fitness","Wellness","Learning","Creativity","Mindfulness"]},{category:"People",tags:["Family","Friends","Girlfriend","Boyfriend","Crush","Myself","Colleagues","Mentors","Dad","Mom","Sister","Brother","Aunt","Uncle","Grandma","Grandpa","Cousin","Neighbors"]},{category:"Date/Time",tags:["Today","Tomorrow","Yesterday","NextWeek","LastMonth","ThisYear","Weekend"]},{category:"Projects&Events",tags:["MarketingCampaign","WebsiteRedesign","WeekendVibes","Conferences","Birthday","Holiday","Party"]},{category:"Location",tags:["Home","Office","Cafe","Outdoors","Gym","NatureLovers","City","Beach"]},{category:"Type",tags:["Idea","Quote","Question","Reflection","Story","Tip","Advice","Opinion","Announcement","GoalSetting"]},{category:"Source",tags:["Article","Book","Website","Podcast","Video"]},{category:"Sentiment",tags:["Positive","Negative","Neutral","Motivational","Gratitude","Inspiration","Mindfulness","Humor","Love","Peace","Hope","Excited"]},{category:"Extras",tags:["CreativityBoost","Focus","LearningCurve","SelfCare","Productivity","Adventure","Relaxation","Growth"]}
  ];

  useEffect(() => {
    const getIndividualNote = async (token) => {
      setIsLoading(true)
      const res = await fetch(`https://notrbackend.vercel.app/api/getIndividualNote/${note}`, {
        headers: {
          'token' : token
        }
      })
      const data = await res.json()
      console.log('💙',data.response?.fontStyle) 
      if (res.ok && data?.response?.title) {
        setNotes(data.response)
        setNewNote(data.response?.note)
        
        setFontStyle(data.response?.fontStyle)
        setFontFam(data.response?.fontFamily)
        setFontWeight(data.response?.fontWeight)
        setTl(data.response?.textAlign)
        
        setNewTitle(data.response?.title)
        setIsPrivate(data?.response?.isPrivate)
        setIsLoading(false)
        if (!data) {
          setNoData(true)
        }
      }
    }
    getIndividualNote(token)
  }, [note && token])
  
  const saveNote = async () => {
    const res = await fetch(`https://notrbackend.vercel.app/api/saveNote/${note}`, {
      method: 'PATCH',
      headers: {
        'Content-Type' : 'application/json',
        'token' : token
      },
      body: JSON.stringify({
        title: newTitle,
        note: newNote,
        tag: tag? tag : notes?.tag,
        isPrivate: isPrvt === false || true? isPrvt : notes?.isPrivate,
        fontStyle : fontStyle,
        textAlign : tl,
        fontFamily : fontFam,
        fontWeight : fontWeight
      })
    });
    if (!res.ok) {
      await Toast.show({
        text: 'Error saving note.',
        duration: 'long',
        positive: 'positive',
      })
      setIsSave(false)
      return setIsLoading(false)
    }
    if (res.ok) {
      setIsTyping(false)
      setIsSave(false)
    }
  };
  
  const deleteNote = async () => {
    setIsLoading(true)
    const res = await fetch(`https://notrbackend.vercel.app/api/delete/${note}`, {
      method: 'DELETE',
      headers: {'token' : token}
    });
    if (res.ok) {
      setIsLoading(false);
      router.back();
    }
  };
  
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.log(error)
    }
  };

const pasteFunc = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      const { value } = await CapClip.read();
      if (value) setNewNote((prev) => prev + value);
      else console.log('Clipboard empty!');
    } else {
      const text = await navigator.clipboard.readText();
      if (text) setNewNote((prev) => prev + text);
      else console.log('Clipboard empty!');
    }
  } catch (error) {
    console.error('Clipboard error:', error);
  }
};
  
  const autosaveFunc = () => {
    setIsTyping(true)
    clearTimeout(() => timeout)
    const timeout = setTimeout(() => {
      saveNote()
    }, 3000)
  }
  
  const privateUpdate = () => {
    saveNote()
  }
  
  return(
    <div style={{marginTop: '95px'}} className={styles.body}>
      <Header
        isTransparent={true}
        blur={'10px'}
        leftIcon={<ChevronLeft style={{
          padding:'10px',
        }} onClick={() => {
          autoSave == 'On'? saveNote() : ''
          router.back()
        }}/>}
        text={'Notes'}
        textColor='white'
        rightIcons={[
          <div style={{
            opacity: newNote? 1 : 0.5,}}>
            <p 
              onClick={() => {
                if (!newNote) {
                  return;
                }
                saveNote()
                router.push(`/create/note?note=${notes?._id}`)
              }}
              className={styles.postThis}>{t('indivuNote.post_note_b')}</p>
          </div>,
          <EllipsisVertical size={20} onClick={() => setIsOptions(true)} className={styles.elli}/>
        ]}
      />
      
      { isOptions?
        <div onClick={() => setIsOptions(false)} className={styles2.blur}>
          <div className={styles2.listBox}>
            <span onClick={() => {
                copy(newNote)
                setIsOptions(false)
              }} className={styles.optionName}>
              <Copy size={20}/>
              {t('indivuNote.copy')}
            </span>
            <span onClick={() => {
              setIsDelete(true)
              setIsOptions(false)
            }} className={styles.optionName}>
              <Trash size={20} />
              {t('indivuNote.delete')}
            </span>
            <span onClick={shareNote}  className={styles.optionName}>
              <Share size={20}/>
              {t('indivuNote.share')}
            </span>
            <span onClick={() => {
              setIsOptions(false)
              isPrvt = notes?.isPrivate? false : true
              setIsPrivate((prvt) => prvt? false : true)
              privateUpdate()
            }} className={styles.optionName}>
              <Key  size={20}/>
              {isPrivate? t('indivuNote.set_public') : t('indivuNote.set_secret')}
            </span>
          </div>
        </div>
      : ''}
      
      {
        !isShare?
        <Question title={t('indivuNote.shareAlert.title')} msg={t('indivuNote.shareAlert.msg')} actions={<p onClick={() => setIsShare(true)}>{t('indivuNote.shareAlert.ok')}</p>}
      />
      : null}
      
      {
        clear?
        <Question title={t('indivuNote.clearAlert.title')} msg={t('indivuNote.clearAlert.msg')} actions={[
          <p onClick={() => setClear(false)}>
            {t('indivuNote.clearAlert.no')}
          </p>,
          <p onClick={() => {
            setClear(false)
            setNewNote('')
          }}>
            {t('indivuNote.clearAlert.ok')}
          </p>
        ]}/>
      : null}
      
      {
        isDelete?
        <Question msg={t('indivuNote.deleteAlert.msg')} title={t('indivuNote.deleteAlert.title')} actions={[
          <p onClick={() => setIsDelete(false)}>{t('indivuNote.deleteAlert.boxBs.no')}</p>,
          <p onClick={deleteNote}>{t('indivuNote.deleteAlert.boxBs.yes')}</p>
        ]}/>
      : null}
      
      { isLoading? <Loader loaderColor={'white'}/> : ''}
      
      { tagPopUp?
      <div className={styles.blur}>
        <div className={styles.tagsBox}>
          <p className={styles.tagsTitle}>
            Tags
          </p>
          <div style={{
            overflowY: 'scroll',
            height: '82.5%',
          }}>
            { tagData.map((tag, i) => (
              <div key={i}>
                <strong>
                  {tag.category}
                </strong>
                <ul className={styles.ul}>
                  {tag.tags.map((tg, i) => (
                    <span onClick={() => {
                      setTag(tg)
                      setTagPopUp(false)
                    }} className={styles.li} key={i}>
                      {tg}
                    </span>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className={styles.buttonsDivPopUp}>
            <span className={styles.other} onClick={() => {
              setTagPopUp(false)
              setTag('Other')
            }}>Other</span>
            <button className={styles.closeB} onClick={() => setTagPopUp(false)}>
              Close
            </button>
          </div>
        </div>
      </div> : ''}
      
      <div className={styles.noteEditingContainer}> 
        <input 
          placeholder={t('indivuNote.title')}
          className={styles.input}
          type='text' 
          onChange={(e) => setNewTitle(e.target.value)}
          value={newTitle}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '95%',
          alignItems: 'center',
          marginLeft: '10px',
        }}>
          <div style={{display:'flex', justifyContent: 'center', alignItems: 'center',}}>
            <p className={styles.time}>{notes?.updatedAt?.substring(0, 10)} </p>
            <span className={styles.tagText} onClick={() => setTagPopUp(true)}>{tag? tag : notes?.tag? notes?.tag : t('indivuNote.addTag')}</span>
          </div>
          <button onClick={() => {
            saveNote()
            setIsSave(true)
          }} className={styles.saveButton}>
            { isSave? 'saving...' : isTyping? 'Typing...' : t('indivuNote.save')}
          </button>
        </div>
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
          <Bold onClick={() => {
            setFontWeight(fontWeight == 'bold'? '' : 'bold')
          }} className={fontWeight !== 'bold'? styles.fi : styles.fiActive} size={16}/>
          
          <Italic onClick={() => {
            setFontStyle(fontStyle == 'Italic'? '' : 'Italic')
          }} className={fontStyle == 'Italic'? styles.fiActive : styles.fi} size={16}/>
          
          <AlignCenter onClick={() => {
            setTl(tl == 'center'? '' : 'center')
          }} className={tl == 'center'? styles.fiActive : styles.fi} size={16}/>
          
          <AlignRight onClick={() => {
            setTl(tl == 'right'? '' : 'right')
          }} className={tl == 'right'? styles.fiActive : styles.fi} size={16}/>
          
          <Code onClick={() => {
            setFontFam(fontFam == 'Monospace'? '' : 'Monospace')
          }} className={fontFam == 'Monospace'? styles.fiActive : styles.fi} size={16}/>
          
          <Clipboard onClick={() => {
            pasteFunc()
          }} className={styles.pasteStyles} size={16}/>
          
          <Eraser onClick={() => {
            newNote? setClear(true) : ''
          }} color={newNote? 'white' : 'gray'} className={styles.pasteStyles} size={16}/>
          
        </div>
        <div className={styles.noteDiv}>
          <textarea 
            ref={refNote}
            placeholder={t('indivuNote.placeholder')}
            className={styles.noteInput}
            value={newNote || ''}
            onInput={(e) => {
              setNewNote(e.target.value)
              if(autoSave == 'On') autosaveFunc()
              handleExpend()
            }}
            style={{
              fontWeight: fontWeight? fontWeight : 'normal',
              fontFamily: fontFam? fontFam : 'Arial',
              textAlign: tl? tl : 'left',
              fontStyle: fontStyle? fontStyle : 'normal',
            }}
          />
        </div>
      </div>
    </div>
  )
}

