import { ChevronLeft, Trash, User, ChevronDown } from 'lucide-react';
import styles from '../styles/editProfile.module.scss';
import Header from '../components/header.jsx';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loader from '../components/loading_spinner.jsx';
import Question from '../components/confirm.jsx';
import { useTranslation } from 'react-i18next';

export default function EditProfile(){
  const router = useRouter();
  const { t } = useTranslation();
  
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [isRole, setIsRole] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bio, setBio] = useState('');
  const [user, setUser] = useState('');
  const [token, setToken] = useState('');
  const [profile, setProfile] = useState();
  
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user'))?._id);
    setToken(JSON.parse(localStorage.getItem('token')));
  }, []);
  
  useEffect(() => {
    const getUser = async (token) => {
      setIsSubmitting(true)
      const res = await fetch(`https://notrbackend.vercel.app/api/getUserInfo`, {
        headers: {'token' : token}
      })
      const data = await res.json()
      
      if (res.ok) {
        setRole(data?.user.role)
        setUsername(data?.user.username)
        setName(data?.user.name)
        setBio(data?.user.bio)
        setProfile(data?.user.photoUrl)
        setIsSubmitting(false)
      }
    };
    getUser(token)
  }, [user && token])
  
  const usersRoles = t('editProfile.roles', {returnObjects: true})
  console.log(usersRoles)
  
  const chooseProfile = e => {
    e.preventDefault()
    const file = Array.from(e.target.files)
    if (file[0]) {
      setProfile(file[0])
    }
  }
  
  const updateData = async () => {
    //return console.log(String(profile))
    if ((!username || !name) || (!username && !name)) {
      return;
    }
    setIsSubmitting(true)
    const form = new FormData();
    form.append('name', name)
    form.append('username', username)
    form.append('bio', bio)
    form.append('role', role)
    typeof profile == 'string'? form.append('actualPhoto', profile) : null
    form.append('file', typeof profile == 'object'? profile : String(profile))
    const res = await fetch(`https://notrbackend.vercel.app/api/users/editProfile`, {
      method: 'PATCH',
      headers: {
        'token' : token
      },
      body: form
    })
    const data = await res.json()
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data.newData))
      setIsSubmitting(false)
      router.back()
    }
  }
  
  return(
    <div 
      onClick={() => isRole? setIsRole(false) : ''} className={styles.body}
      style={{
        opacity: !isSubmitting? 1 : 0.7,
        marginTop: '95px',
      }}
    >
      <Header 
        text={t('editProfile.title')}
        isTransparent={true}
        blur={'20px'}
        leftIcon={
          <ChevronLeft onClick={() => router.back()}/>
        }
      />
      
      {isSubmitting? <Loader loaderColor='white'/> : ''}
      <form 
        className={styles.form}
        action='' 
        method=''
        encType="multipart/form-data"
        acceptCharset="utf-8"
        onSubmit={(e) => e.preventDefault()}
        onSubmit={() => alert('Salut')}
      >
      <div className={styles.choose}>
        {profile != 'removed' && !profile == ''?
          <img className={styles.photo} src={typeof profile == 'object'? URL.createObjectURL(profile) : profile} height={150} width={150}/>
        : <User size={40} className={styles.profileIcon}/>}
        
        {profile?
          <Trash
            size={18} 
            onClick={() => {
              profile? setProfile('removed') : null
            }}
            className={styles.trashI}/> 
        : ''}
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        
        <button type='reset' className={styles.uploadB}>
          {t('editProfile.choose_a_pic')}
          <input 
            type='file' 
            accept='image/*'
            name='file' 
            onChange={chooseProfile}
            className={styles.hiddenB}
          />
        </button>
        </div>
      </div>
      </form>
      
      <div className={styles.inpBody}>
        {/* username */}
        
        {/*<label className={styles.label} for='username'>Username</label>
        <input 
          className={styles.inp} 
          name='username' 
          type="text"
          placeholder='Username'
          value={username}
          disabled
          style={{opacity : 0.5}}
          onChange={(e) => setUsername(e.target.value.trim().toLowerCase())}
        />
        {username.length <= 0? <small style={{color: '#7f7f7f', margin: '10px 0',}}>
          Cannot be blank!
        </small> : ''}*/}
        
        
        {/* name */}
        <label className={styles.label} for='name'>{t('editProfile.placeholder_name')}</label>
        <input 
          className={styles.inp} 
          name='name' 
          type="text"
          placeholder={t('editProfile.placeholder_name')}
          value={name}
          onChange={(e) => setName(e.target.value.substring(0, 20))}
        />
        {name.length <= 0? <small style={{color: '#7f7f7f', margin: '10px 0',}}>
          {t('editProfile.blank')}
        </small> : ''}
        {/* bio */}
        <label className={styles.label} for='bio'>{t('editProfile.placeholder_bio')}</label>
        <textarea 
          className={styles.inp} 
          name='bio'
          rows={7}
          placeholder={t('editProfile.placeholder_bio')}
          value={bio.substring(0, 105)}
          onInput={(e) => {
            e.target.value.length >= 105? '' : setBio(e.target.value)
          }}
        />
        <small style={{color: '#7f7f7f', margin: '10px 0',}}>
          {t('editProfile.chars')}
        </small>
        {/* role */}
        <label className={styles.label} for='role'>{t('editProfile.role')}</label> 
        <div 
          onClick={() => {
            isRole? setIsRole(false) : setIsRole(true)
          }}
          className={styles.roleSelection}>
          {role || t('editProfile.geust')}<ChevronDown/>
          {isRole? 
            <div className={styles.roleDiv}>
              {usersRoles.map((role, i) => (
                <span 
                  className={styles.role} 
                  onClick={() => {
                    setRole(role)
                  }}>{role}</span>
              ))}
            </div>
          : ''}
        </div>
      
      <button className={styles.updateButton} onClick={updateData}>
        {t('editProfile.submit')}
      </button>
      
      <small style={{
        textAlign: 'center',
        color: '#757575',
        marginTop: '50px',
      }}>{t('editProfile.letter.msg', {email: t('editProfile.letter.email'), pssw: t('editProfile.letter.password'), age : t('editProfile.letter.age'), username: t('editProfile.letter.username')})}</small>
      
      </div>
    </div>
  );
}