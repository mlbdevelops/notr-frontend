import { useRouter } from 'next/router';
import Header from '../../components/header.jsx'
import { 
  ChevronLeft,
  Tag,
  Camera,
  Type,
  Bold,
  Italic,
  List,
  AlignRight,
  AlignCenter,
  Code,
  Plus
} from 'lucide-react'
import styles from '../../styles/createPost.module.scss';
import { useState, useEffect } from 'react';
import styles2 from '../../styles/notePage.module.scss';
import Quetion from '../../components/confirm.jsx'
import Loader from '../../components/loading_spinner.jsx';

export default function createPost(){
  const router = useRouter()
  
  const [noteId, setNoteId] = useState(router.query.create_post);
  
  const [images, setImages] = useState([]);
  const [selectedTag, setSelectedTag] = useState([]);
  const [noteList, setNoteList] = useState([]);
  const [tagPopUp, setTagPopUp] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isFont, setIsFont] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noData, setNodata] = useState(false);
  const [list, setList] = useState(false);
  const [user, setUser] = useState('');
  const [username, setUsername] = useState('');
  const [note, setNote] = useState({});
  const [newNote, setNewNote] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [token, setToken] = useState('');
 
  const [font, setFont] = useState('');
  const [fontWeight, setFontWeight] = useState('');
  const [fontStyle, setFontStyle] = useState('');
  const [tl, setTl] = useState('');
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = JSON.parse(localStorage.getItem('token'));
    if (user) {
      setUser(user?._id);
      setToken(token);
      setUsername(user?.username);
    }
  }, []);
  
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden'
    }else{
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading])
 
  const getIndividualNote = async (id, token) => {
    const res = await fetch(`https://notrbackend.vercel.app/api/getIndividualNote/${id}`, {
      headers:{
        'token' : token
      }
    })
    const data = await res.json();
    if (res.ok) {
      setIsLoading(false)
      setNote(data?.response)
      setNewNote(data?.response?.note)
      setNewTitle(data?.response?.title)
      data?.response.tag? selectedTag[0] = data?.response?.tag : ''
      if (!data) {
        setNodata(true)
      }
    }
  }
  
  useEffect(() => {
    getIndividualNote(noteId, token)
  }, [noteId && token])
  
  const getNotesFunc = async () => {
    try{
      if (!user) return;
      const res = await fetch(`https://notrbackend.vercel.app/api/getNotes`, {
        headers: {'token' : token}
      });
      if (!res.ok && notes.length == 0) {
        return setNotes([]);
      }
      const noteList = await res.json();
      if (res.ok) {
        setIsLoading(false);
        const note = noteList.response.filter(item => item.note !== '')
        setNoteList(note)
        return [...noteList]
      }
      return [
        err = {error : false}
      ];
    }catch(err) {
      console.log(err)
    }
  }
  
  console.log(note)
  
  const tagData=[{category:"Topic/Subject",tags:["ProjectProposal","MeetingNotes","Recipe","Ideas","Quotes","Memories","Challenges","Reflections","Goals","Journaling","Favorites","Stories","Tips","Advice","Opinions"]},{category:"Status",tags:["InProgress","Completed","Blocked","Pending","Reviewed"]},{category:"Priority",tags:["High","Medium","Low","Urgent"]},{category:"Context",tags:["Work","Personal","School","Travel","Fitness","Wellness","Learning","Creativity","Mindfulness"]},{category:"People",tags:["Family","Friends","Girlfriend","Boyfriend","Crush","Myself","Colleagues","Mentors","Dad","Mom","Sister","Brother","Aunt","Uncle","Grandma","Grandpa","Cousin","Neighbors"]},{category:"Date/Time",tags:["Today","Tomorrow","Yesterday","NextWeek","LastMonth","ThisYear","Weekend"]},{category:"Projects&Events",tags:["MarketingCampaign","WebsiteRedesign","WeekendVibes","Conferences","Birthday","Holiday","Party"]},{category:"Location",tags:["Home","Office","Cafe","Outdoors","Gym","NatureLovers","City","Beach"]},{category:"Type",tags:["Idea","Quote","Question","Reflection","Story","Tip","Advice","Opinion","Announcement","GoalSetting"]},{category:"Source",tags:["Article","Book","Website","Podcast","Video"]},{category:"Sentiment",tags:["Positive","Negative","Neutral","Motivational","Gratitude","Inspiration","Mindfulness","Humor","Love","Peace","Hope","Excited"]},{category:"Extras",tags:["CreativityBoost","Focus","LearningCurve","SelfCare","Productivity","Adventure","Relaxation","Growth"]}
  ];
  
  const genericFontFamilies = ["serif","sans-serif","monospace","cursive","fantasy"];
  
  
  const setfiles = (e) => {
    const files = Array.from(e.target.files)
    if (files) {
      setImages(files)
    }
    console.log(e)
  }
  
  const create_post = async () => {
    if (!newNote) {
      return;
    }
    setIsLoading(true)
    const userId = {
      _id : user,
      username: username
    }
    const form = new FormData();
    form.append('tag', [...new Set([...selectedTag])].join(', '));
    form.append('user', JSON.stringify(userId));
    form.append('note', newNote);
    form.append('title', newTitle);
    form.append('fontWeight', fontWeight);
    form.append('fontStyle', fontStyle);
    form.append('textAlign', tl);
    form.append('fontFamily', font);
    
    images.forEach((file) => {
      form.append('files', file);
    });
    
    const res = await fetch('https://notrbackend.vercel.app/api/posts/post', {
      method: 'POST',
      headers:{
        'token' : token
      },
      body: form
    })
    if (res.ok) {
      setIsLoading(false)
      setSuccess(true)
    }
  }
  
  return(
    <div style={{marginTop: '100px'}} className={styles.body}>
      <Header 
        leftIcon={<ChevronLeft style={{padding: '10px'}} onClick={() => router.back()}/>}
        text={'Post'}
        rightIcons={
          <p onClick={create_post} className={styles.iTab}>Post</p>
        }
        isTransparent={true}
        blur={'10px'}
      />
      
      {success? 
        <Quetion msg='Successfully posted ✓' title='Post' actions={<p onClick={() => {
          setSuccess(false)
          router.back()
        }}>Ok</p>}/>
      : ''}
      
      { isFont?
        <div onClick={() => setIsFont(false)} className={styles2.blur}>
          <div className={styles.fontBox}>
            {genericFontFamilies.map((font, i) => (
              <span style={{
                fontFamily: genericFontFamilies[i],
                color: 'white',
              }}
              className={styles.font}
              onClick={() => {
                setFont(font)
                setIsFont(false)
              }}
              >{font}</span>
            ))}
          </div>
        </div>
      : ''}
      
      { isLoading?
        <Loader loaderColor={'white'}/>
      : null}
      
      { tagPopUp?
      <div className={styles2.blur}>
        <div className={styles2.tagsBox}>
          <p className={styles2.tagsTitle}>
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
                <ul className={styles2.ul}>
                  {tag.tags.map((tg, i) => (
                    <span onClick={() => {
                      selectedTag.push(tg)
                      if (selectedTag.length === 3) {
                        setTagPopUp(false)
                      }
                    }} className={styles2.li} key={i}>
                      {tg}
                    </span>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className={styles2.buttonsDivPopUp}>
            <span className={styles2.other} onClick={() => {
              selectedTag.push('Other')
              setTagPopUp(false)
            }}>Other</span>
            <button className={styles2.closeB} onClick={() => setTagPopUp(false)}>
              Close
            </button>
          </div>
        </div>
      </div> : ''}
      
      { user && list? 
        <div className={styles.blur}>
          <div className={styles.listBox}>
            <p style={{marginTop: 0, fontSize: '20px', fontWeight: 'bold',}}>Notes</p> 
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: 'column',
              alignItems: 'center',
              overflow: 'scroll',
              width: '100%',
              gap: '10px',
              height: '80%',
              padding: '10px 0',
            }}>
            {noteList.length >= 1?
              noteList.map((note, i) => (
                <div
                  onClick={() => {
                    setIsLoading(true)
                    setNoteId(note._id)
                    setList(false)
                    getIndividualNote(note._id, token)
                  }}
                  className={styles.noteFromNotesList}>
                  <strong style={{fontSize: '20px'}}>{note.title.length >= 20? `${note?.title?.substring(0, 20)}...` : note?.title}</strong>
                  <span>{note?.note?.substring(0, 50) || 'Empty'}</span> 
                  
                  <div className={styles.bottomBox}>
                    <span style={{color: '#4c4c4c'}}>{note?.createdAt?.substring(0, 10)}</span>
                    {note.tag? <span className={styles.tag}>{note.tag}</span> : null}
                  </div>
                  
                </div>
              ))
            : <div style={{width: '90%', textAlign: 'center', marginTop: '230px'}}>
              No notes found, Create one before posting.
            </div>} 
            </div>
            
            <button onClick={() => setList(false)} className={styles.closeBList}>
              Close
            </button>
          </div>
        </div>
      : null}
      
      <div className={styles.container}>
        { newNote && newTitle?
          <div className={styles.note}>
            <strong className={styles.noteTitle}>
              {newTitle.substring(0, 20)}
            </strong>
            <span
              className={styles.noteText}
              style={{
                fontFamily: font? font : 'Arial',
                textAlign: tl? tl : 'left',
                fontWeight: fontWeight? fontWeight : 'normal',
                fontStyle: fontStyle? fontStyle : 'normal',
              }}
            >
              {newNote?.substring(0, 350)}
            </span>
            <span className={styles.time}>
              {note?.createdAt?.substring(0, 10)}
            </span>
          </div>
        : 
          <div 
            onClick={() => {
              getNotesFunc()
              setList(true)
            }}
            className={styles.addNote}>
            <Plus size={30}/>
            <span>Add a note</span> 
          </div>
        }
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
          
        </div>
        
        <div className={styles.more1}>
          <span 
            style={{
              opacity: !newNote? 0.5 : 1,
            }}
            onClick={() => newNote && selectedTag.length !== 3? setTagPopUp(true) : null} 
            className={styles.tags}
          >
            <span 
              className={styles.tagButton}>
              <Tag 
                size={14} 
                className={styles.icon}/>
              Add tags
            </span>
          </span>
          { selectedTag.length >= 1?
            <div 
              className={styles.tagList}>
                {selectedTag.map((tag, i) => (
                  <span
                    key={i}
                    onClick={() => { 
                      const rmt = selectedTag.filter(arrTg => arrTg != tag)
                      setSelectedTag(rmt)
                    }}
                    className={styles.tag}
                  >{tag}
                  </span>
                ))}
            </div>
          : ''}
        </div>
        
        <form 
          action='' 
          method=''
          encType="multipart/form-data"
          acceptCharset="utf-8"
          onSubmit={(e) => {
            e.preventDefault()
            create_post()
          }}
          className={styles.form}
          >
            <div className={styles.imgs}>
            <button
              style={{
                opacity: !newNote? 0.5 : 1,
              }}
              className={styles.uploadButton}
            > <Camera 
                className={styles.icon} 
                size={17.5}
              />Add images
            </button>
            <input 
              accept='image/*' 
              onChange={(e) => setfiles(e)}
              className={styles.uploadFunc} 
              multiple
              max={10}
              type='file'
              name='files'
              style={{
                display: !newNote? 'none' : 'block',
              }}  
            />
          </div>
          {images.length > 0?
            <div className={styles.picsDiv}>
              {images.map((img, i) => {
                const url = URL.createObjectURL(img)
                return (
                  <img 
                    key={i}
                    src={url}
                    height={100}
                    width={100}
                    onClick={() => {
                      setImages(images.filter(image => image !== img))
                    }}
                    className={styles.img}
                  />
                )
              })}
            </div> 
          : null }
          <div className={styles.buttonsDiv}>
            <button className={styles.postB} type='submit'>Post</button> 
          </div>
        </form>
        <div style={{
          width: '95%',
          border: 'none',
          display: 'flex',
        }}>
          <span 
            onClick={() => !newNote? '' : setIsFont(true)}
            className={styles.fontB}
            style={{
              fontFamily: font? font : 'Arial',
              opacity: !newNote? 0.5 : 1,
            }}
          ><Type size={17.5} className={styles.icon}/>{font? font : 'Set font family'}</span>
        </div>
      </div>
      
    </div>
  );
}