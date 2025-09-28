import Question from '../../components/confirm.jsx'
import { ArrowRight } from 'lucide-react';
import styles from '../../styles/login.module.scss';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Loader from '../../components/loading_spinner.jsx'

export default function loginPage(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSucess, setIsSucess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({});
  const router = useRouter();
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user != null){
     router.push('/');
    }
  }, []);
  
  const login = async () => {
    const data = {
      email: email,
      password: password
    };
    
    try{
      setIsLoading(true)
      const res = await fetch('https://notrbackend.vercel.app/api/auth/login', {
        method: 'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
      });
      const user = await res.json();
      if(res.ok) {
        setIsLoading(false);
        localStorage.setItem('user', JSON.stringify(user.response));
        localStorage.setItem('token', JSON.stringify(user.token));
        localStorage.setItem('isAutoSave', 'Off');
        localStorage.setItem('tab', 1);
        router.push('/');
      } else {
        console.log(user)
        setIsSucess(true)
        setIsLoading(false)
        setMsg({
          msg: user.msg,
          title: 'login',
          actions: <p onClick={() => setIsSucess(false)}>Ok</p>
        })
      }
    } catch(e){
      console.log(e)
    }
  };
  
  return(
    <div className={styles.body}>
      <h2 style={{margin: '20px 0'}}>
        Login to Notr
      </h2>
      
      {isSucess?
        <Question msg={msg.msg} title={msg.title} actions={msg.actions}/>
      : null}
      
      { isLoading?
        <Loader loaderColor='white'/>
      : ''}
      
      <div className={styles.inpDiv}>
        <label className={styles.label} for="email">
          <strong style={{marginLeft:'5px'}}>
            Email
          </strong>
          <input 
            className={styles.inp} 
            name='email' 
            type="text"
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        
        <span className={styles.forgot}>Forgot password</span>
        
        <label className={styles.label} for="pssw">
          <strong style={{marginLeft:'5px'}}>
            Password
          </strong>
          <input 
            className={styles.inp} 
            name='pssw' 
            type="password"
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button 
          className={styles.lbtn}
          onClick={login}
        >Login</button>
      </div>
      <p style={{position: 'absolute',color: '#707070', bottom: '10px',}}>Don't have an account? <Link style={{fontWeight:'bold', textDecoration: 'none', color: 'white'}} href='/auth/register'>create an account</Link></p>
    </div>
  )
}


