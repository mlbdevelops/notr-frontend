import {
  EllipsisVertical, 
  Heart, 
  MessageCircle,
  Tag,
  Send,
  Trash,
  Share,
  User,
  AlertTriangle
} from 'lucide-react';
import styles from '../styles/post.module.scss'
import { useState, useEffect, useRef } from 'react'
import Question from './confirm.jsx'
import { useRouter } from 'next/router';
import Loader from './loading_spinner.jsx'

import styles2 from '../styles/comment.module.scss';
export default function Post({tag, note, title, username, name, ownerId, _id, photos, loggedUser, likes, fontFamily, textAlign, fontStyle, fontWeight, time, accProfile, likedByUser}){
  const router = useRouter()
  const [image, setImage] = useState('')
  const [noUser, setNoUser] = useState(false)
  const [isRed, setIsRed] = useState(likedByUser)
  const [isDelete, setIsDelete] = useState(false)
  const [comment, setComment] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [images, setImages] = useState(photos)
  const [likeCount, setLikeCount] = useState(likes)
  const [user, setUser] = useState('')
  const [token, setToken] = useState('')
  const [commentList, setCommentList] = useState([])
  const [expanded, setExpanded] = useState(false)
  const [isLikes, setIsLikes] = useState(likedByUser)
  const [isLoading, setIsLoading] = useState(false)
  
  const menuRef = useRef(null)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || ''
    const token = JSON.parse(localStorage.getItem('token')) || ''
    if (user?._id || token) {
      setUser(user?._id)
      setToken(token)
    }
  }, [user && token])
  
  useEffect(() => {
    likedByUser? setIsRed(true) : setIsRed(false)
  }, [likedByUser])
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);
  
  
  useEffect(() => {
    if (comment) {
      document.body.style.overflow = 'hidden';
      window.history.pushState({ commentOpen: true }, "");
      const handlePop = () => {
        setComment(false);
      };
      window.addEventListener("popstate", handlePop);
      return () => {
        window.removeEventListener("popstate", handlePop);
      };
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [comment]);
  
  
  const like = async (tkn) => {
    const res = await fetch('https://notrbackend.vercel.app/api/post/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': tkn
      },
      body: JSON.stringify({
        postId: _id,
      })
    });
    const data = await res.json()
    if (res.ok) {
      if (data?.res == 'liked') {
        setLikeCount((like) => like += 1)
        setIsRed(true)
      } else if(data?.res == 'unliked'){
        setLikeCount((like) => like -= 1)
        setIsRed(false)
      }else{
        null
      }
    }
  };
  
  const userProfile = async () => {
    if(router.pathname == '/account' || router.query.user == ownerId){
      return;
    }
    router.push(ownerId === user? '/account' : `/profile/profile?user=${ownerId}`);
  };
  
  const sendComment = async () => {
    if (!commentText) {
      return;
    }
    setCommentText('');
    setIsLoading(true)
    const res = await fetch('https://notrbackend.vercel.app/api/posts/comments', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'token' : token
      },
      body: JSON.stringify({
        postId: _id,
        text: commentText
      })
    });
    const data = await res.json();
    if (res.ok) {
      getPostsComments();
    }
  };
  
  const getPostsComments = async () => {
    try {
      
      setIsLoading(true)
      !comment? setComment(true) : null;
      const res = await fetch(`https://notrbackend.vercel.app/api/posts/GetComments/${_id}`, {
        headers: {
          'Content-Type' : 'application',
          'token' : token
        }
      });
      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false)
      }
      if (res.ok) {
        setIsLoading(false)
        setCommentList(data.comments);
      }
    } catch (error) {
    }
  };
  
  const deleteFunc = async () => {
    if (!loggedUser) {
      return alert('Login to perform this action.');
    }
    setIsLoading(true)
    const res = await fetch(`https://notrbackend.vercel.app/api/posts/delete/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type':'application/json',
        'token' : token
      }
    });
    const data = await res.json()
    if (res.ok) {
      setIsLoading(false)
      alert(data?.msg);  
    }
  };
  
  const shareFunc = async () => {
    const shareData = {
      title: title,
      text: `
••• ${title}

${note}
.
.
.
.
See more on Notr.
      `,
    }
    
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log(error);
      }
    }
  }
  
  const reportFunc = async () => {
    router.push(`/report/report?reported=${_id}`)
  }
  
  const displayNote = !expanded && note.length > 400 ? note.slice(0, 400) + "..." : note;
  
  return(
    <div ref={menuRef} onClick={() => menuOpen? setMenuOpen(false) : ''} className={styles.post}>
        {menuOpen? 
          <div className={styles.menuDiv}>
              <span onClick={shareFunc} className={styles.elem}><Share size={15}/> Share</span>
              {loggedUser == ownerId? <span onClick={() => setIsDelete(true)} className={styles.elem}><Trash size={15}/> Delete</span> : ''} 
              <span onClick={reportFunc} className={styles.elem}><AlertTriangle size={15}/>Report</span> 
          </div>
        : ''}
      <div className={styles.postHeader}>
        <div className={styles.userDiv}>
          {accProfile? <img src={accProfile} height={52} width={52} onClick={userProfile} className={styles.userProfile}>{}</img> : <User onClick={userProfile} size={20} className={styles.userProfileNone}/>}
          <div className={styles.postUser}>
            <span style={{cursor: 'pointer'}} onClick={() => userProfile()}>{username}</span>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <span style={{color: '#a6a6a6', fontSize: '12px',}}>{time}</span>
            </span>
          </div>
        </div>
        <EllipsisVertical 
          size={17.5} 
          color={'#b1b1b1'}
          onClick={() => setMenuOpen(true)}
        />
      </div>
      
      {/*delete comp*/}
      
      { isDelete?
        <Question msg='Are you sure you want to delete?' title='Delete' actions={[
          <p onClick={() => setIsDelete(false)}>No</p>,
          <p onClick={() => {
            setIsDelete(false)
            deleteFunc()
          }}>Yes</p>
          ]}/>
      : ''}
      
      {/*Comments*/}
      
      { comment?
        <div className={styles2.blur}>
          <div 
            onClick={() => setComment(false)} 
            className={styles.closeComments}> 
          </div>
          <div className={styles2.commentDiv}>
            <p className={styles2.commentText}>Comments</p>
            <div>
              { isLoading? <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100px',
                width: '100px',
                borderRadius: '20px',
                placeSelf: 'center',
                marginTop: '90px',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}>
                <div className={styles.spinner}></div>
              </div> : ''}
              <div className={styles2.comments}>
                { !isLoading && commentList.length >= 1?
                  commentList.map((comm, i) => (
                    <div key={i} className={styles2.comment}>
                      <div className={styles2.profile}>{comm.user?.username[0].toUpperCase() || ''}</div>
                      <div className={styles2.usernameAndText}>
                        <strong>{comm.user?.username}</strong>
                        <span>{comm.text}</span> 
                      </div>
                    </div>
                  ))
                : !isLoading && commentList.length == 0? <p style={{
                  textAlign: 'center',
                  marginTop: '80px',
                  width: '100%',
                }}>This post has 0 comments</p> : ''}
              </div>
            </div>
             <div className={styles.commentInpDiv}>
                <input 
                  placeholder='Write something...' 
                  className={styles.sendInp} 
                  type='text'
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Send style={{
                  opacity: commentText? 1 : 0.5,
                }} onClick={sendComment}/>
            </div>
          </div>
        </div>
      : ''}
      
      { noUser?
        <Question msg={'Login to like this post'} title={'Login'} actions={<p onClick={() => {
          setNoUser(false)
          router.push('/auth/login')
        }}>login</p>}/>
      : null}
      
      <strong style={{
        fontWeight: 'bold',
        fontSize: fontFamily == 'Arial' || 'monospace'? '17px' : '22px',
        alignSelf: 'flex-start',
        marginLeft: '13px',
        marginTop: '15px',
        width: 'auto',
        maxWidth: '335px',
        textAlign: textAlign,
        fontStyle: fontStyle,
        fontFamily: fontFamily,
      }}>••• {title}</strong> 
      
      <div style={{
        fontFamily: fontFamily,
        textAlign: textAlign,
        fontStyle: fontStyle,
        fontWeight: fontWeight,
        paddingBottom: tag? '35px' : 0,
        whiteSpace: 'pre-line',
        display: 'flex',
        flexDirection: 'column',
      }} className={styles.note}>
        {image? <span onClick={() => setImage('')} className={styles.btnote}>{'< note'}</span> : null}
        {image? <img className={styles.postImg} src={image}/> : displayNote}
        {note.length > 400 && !image && (
          <span 
            onClick={() => setExpanded(!expanded)} 
            style={{ color: '#4da3ff', cursor: 'pointer', margin: '10px 0' }}
          >
            {expanded ? 'See less' : 'See more'}
          </span>
        )}
        {tag? 
          <span className={styles.tag}><Tag size={11}/> {tag}</span> 
        : ''}
      </div>
      { photos.length >= 1?
        <div className={styles.imgBox}>
          {photos.map((photo, i) => (
            <img 
              onClick={() => {
                setImage(images[i])
              }}
              style={{
                outline: image === images[i]? '1px solid #595959' : 'none',
                outlineOffset: image === images[i]? '2px' : 0,
                border: image === images[i]? '1px solid #323232' : 'none'
              }}
              className={styles.img} 
              src={photo} 
              height='60'
            /> || <div style={{height: '20px', width: '50px', border: '1px solid #262626', backgroundColor: '#1d1d1d',}}></div>
          ))}
        </div>
      : null}
      <div 
        style={{
          border: 'none',
          borderTop: photos.length >= 1? '' : '1px solid #262626',
          marginTop: photos.length >= 1? '' : '20px',
        }}
        className={styles.reactionBox}>
        <div className={styles.metric}>
          <Heart 
            size={20} 
            className={styles.reaction}
            onClick={() => user && token? like(token) : setNoUser(true)}
            fill={ isRed? '#f74a4a' : 'transparent'}
            stroke={isRed? '#f74a4a' : 'white'}
          />
          <span style={{
            fontSize: '12px',
          }}>
            {likeCount}
          </span>
        </div>
        <div onClick={getPostsComments} className={styles.metric}>
          <MessageCircle size={20} className={styles.reaction}/>
          <span style={{
            fontSize: '12px',
          }}>
            comments
          </span>
        </div>
      </div>
    </div>
  );
}