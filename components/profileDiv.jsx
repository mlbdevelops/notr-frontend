import styles from '../styles/profileDiv.module.scss'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { User, Check } from 'lucide-react'
import badge from '../styles/badge.module.scss';

export default function ProfileDiv({username, profile, role, connect, userId, isVerified}){
  const router = useRouter();
  const [user, setUser] = useState('')
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user?._id) {
      setUser(user?._id)
    }
  }, [])
  
  return(
    <div className={styles.profileDiv} 
      onClick={() => router.push(userId === user? '/account' : `/profile/user?user=${userId}`)}
    >
      <div onClick={() => router.push(userId === user? '/account' : `/profile/user?user=${userId}`)} className={styles.profileInfo}>
      
        {profile? <img className={styles.img} src={profile} height={50} width={50}/> : <div className={styles.profile}><User size={20}/></div>}
        
        <div className={styles.urname}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}>
            {username} 
            {isVerified?
              <Check size={10} className={badge.badge}/>
            : ''}
          </span>
          <span className={styles.conn}>{role}</span>
        </div>
      </div>
      {userId == user? <span style={{marginRight: 5}}>You</span> : ''}
    </div>
  );
}