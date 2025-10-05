import noteStyles from '../styles/noteStyles.module.scss';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Trash, Tag } from 'lucide-react';

export default function Note({title, note, time, noteId, tag, deleteFunc, networkStatus, token}){
  const router = useRouter();
  
  const deleteNote = async (note) => {
    const res = await fetch(`https://notrbackend.vercel.app/api/delete/${note}`, {
      method: 'DELETE',
      headers: {
        'token' : token
      }
    });
  };

  return(
      <div className={noteStyles.noteBox}>
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <p className={noteStyles.title}>{title}</p> 
          {deleteFunc}
        </div>
        <small>{note}</small> 
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '102.9%',
          alignItems: 'center',
        }}>
          <small className={noteStyles.time}>{time}</small> 
          { tag?
          <span style={{
            padding: '4px 9px',
            fontSize: '10px',
            borderRadius: '50px',
            border: '1px solid #2d2d2d',
            backgroundColor: '#262626',
          }}>{tag}</span> : <Tag className={noteStyles.tagIcon} size={12}/>}
        </div>
        {networkStatus !== 'offline'? <Link href={`/notes/${encodeURIComponent(noteId)}`}>
          <div className={noteStyles.linkToPage}></div>
        </Link> : ''}
      </div>
    
  );
}