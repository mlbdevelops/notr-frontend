import styles from '../styles/profileDiv.module.scss'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { User } from 'lucide-react'

export default function ProfileDiv({username, profile, role, connect, userId}){
  const router = useRouter();
  const [user, setUser] = useState('')
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user?._id) {
      setUser(user?._id)
    }
  }, [])
  
  return(
    <div className={styles.profileDiv}>
      <div onClick={() => router.push(userId === user? '/account' : `/profile/user?user=${userId}`)} className={styles.profileInfo}>
      
        {profile? <img className={styles.img} src={profile} height={50} width={50}/> : <div className={styles.profile}><User size={20}/></div>}
        
        <div className={styles.urname}>
          <span>{username}</span>
          <span className={styles.conn}>{role}</span>
        </div>
      </div>
      {userId == user? <span>You</span> : ''}
    </div>
  );
}