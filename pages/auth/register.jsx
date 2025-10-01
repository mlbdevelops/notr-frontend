import { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import styles from '../../styles/register.module.scss';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../../components/header.jsx';
import Loader from '../../components/loading_spinner.jsx';
import Question from '../../components/confirm.jsx'

export default function register(){
  const router = useRouter();
  
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [userAge, setAge] = useState()
  const [password, setPssw] = useState('')
  const [vPass, setVpass] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [msg, setMsg] = useState(false)
  const [young, setYoung] = useState(false)
  const [msgData, setMsgData] = useState({})
  
  const [verify_pass, setVerifyPass] = useState()
  const [verificationNumber, setVerificationNumber] = useState('')
  const [steps, setSteps] = useState(1)
  
  const [sucess, setSucess] = useState(false)
  const dateInp = useRef(null)
  
  const cal = (year) => {
    if (!year) return;
    const birthYear = Number(year.slice(0, 4));
    if (isNaN(birthYear)) return;
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };
  
  useEffect(() => {
    const getUser = localStorage.getItem('user')
    const user = JSON.stringify(getUser)
    if(user.id) {
      router.push('/')
    }
  }, []);
  
  const regLogic = () => {
    if(confirm_p != password){
      return alert('password miss match')
    }
    if(!name || !email) return alert('Some field are missing');
    register()
  }
  
  const register = async () => {
    if (!vPass) {
      return;
    }
    setIsLoading(true);
    const res = await fetch('https://notrbackend.vercel.app/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        email: email,
        name: name,
        username: username,
        password: vPass,
        age: cal(userAge),
      })
    });
    
    const data = await res.json()
    if(res.ok){
      localStorage.setItem('user', JSON.stringify(data.response))
      localStorage.setItem('token', JSON.stringify(data.token))
      localStorage.setItem('isAutoSave', 'Off')
      localStorage.setItem('tab', 1)
      router.push('/')
    }
  }
  
  const createVerifiyPass = async () => {
    return setSteps(5)
    setIsLoading(true);
    const res = await fetch('https://notrbackend.vercel.app/api/createCode/email', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        email: email
      })
    });
    const data = await res.json();
    console.log(data)
    console.log(res)
    if (res.status == 401) {
      setMsg(true);
      setMsgData(data)
      setIsLoading(false);
      return;
    }
    if (res.ok && data?.isSuccess) {
      setIsLoading(false);
      setSteps(4);
    }
  };
  
  const verifyPass = async () => {
    setIsLoading(true);
    const res = await fetch('https://notrbackend.vercel.app/api/verify/email', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        email: email,
        code: verificationNumber
      })
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(true)
      setMsgData(data)
      setIsLoading(false)
    }
    if (res.ok && data?.isSuccess) {
      setIsLoading(false);
      setSteps(5);
    }
  };
  
  const checkAge = () => {
    if (cal(userAge) >= 13) {
      setSteps(3)
    }else{
      setYoung(true)
    }
  }
  
  return(
    <div style={{marginTop: '95px'}} className={styles.body}>
      <Header leftIcon={<ChevronLeft onClick={() => router.back()} style={{padding : '10px', cursor: 'pointer', transition: '0.1s'}}/>}
        isTransparent={true}
        blur={'10px'}
      />
      
      {young?
        <Question title={'Age'} msg={'You cannot register if you are less than 13 years old.'} actions={
          <p onClick={() => setYoung(false)}>
            Check
          </p>
        }/>
      : ''}
      
      { isLoading?
        <Loader loaderColor='white'/>
      : null}
      
      { msg && msgData?.msg == 'This email is already registered. Try another one' && msgData?.msg?
        <Question msg={msgData.msg} title={'Account'} actions={[
          <p onClick={() => setMsg(false)}>
            Retry
          </p>,
          <p onClick={() => router.push('/auth/login')}>
            login
          </p>
        ]}/>
      : ''}
      
      { msg && msgData?.msg == 'Incorrect code' && msgData?.msg?
        <Question msg={msgData.msg} title={'Incorrect'} actions={<p onClick={() => {
          setMsg(false)
        }}>Try again</p>}/>
      : ''}
      
      {/*Name and username*/}
      
      <div 
        style={{
          display: steps == 1? 'flex' : 'none',
        }}
        className={styles.nameDiv}>
        <span 
          className={styles.big}
        >Name and username</span>
        <span 
          className={styles.desc} 
        >Choose a name and a username</span>
        
        <label 
          className={styles.label} 
          htmlFor="name" 
        >
          Name
        </label>
        
        <input 
          name='name' 
          className={styles.name}
          value={name}
          type='text' 
          onChange={(e) => setName(e.target.value)}
          placeholder='Name'
        />
          
        <label 
          className={styles.label} 
          htmlFor="username"
        >
          Username
        </label>
        <input 
          name='username' 
          className={styles.name} 
          value={username}
          type='text'
          onChange={(e) => setUsername(e.target.value.trim().toLowerCase().substring(0, 20))}
          placeholder='Username'
        />
        <span style={{
          alignSelf: 'flex-start',
          fontSize: '12px',
          margin: '10px 0',
          marginLeft: '15px',
          color: 'darkgray',
        }}>Username must be less than 21 characters!</span>
        <button 
          onClick={() => username && name? setSteps(2) : ''}
          className={styles.cButton} 
        >Continue</button>
      </div>
      
      {/*Age*/}
      
      <div 
        style={{
          display: steps == 2? 'flex' : 'none',
        }}
        className={styles.nameDiv}>
        <span 
          className={styles.big}
        >Birthday date</span>
        <span 
          className={styles.desc} 
        >Enter your birthday date</span>
        
        <label 
          className={styles.label} 
          htmlFor="date" 
        >
          Date
        </label>
        
        <input 
          name='date' 
          className={styles.name} 
          type='date' 
          value={userAge}
          onChange={(e) => {
            setAge(e.target.value)
          }}
        />
        <div className={styles.buttons}>
          <button 
            className={styles.backButton} 
            onClick={() => setSteps((prev) => prev-1)}
          >Back</button> 
          <button 
            className={styles.ButtonDiv} 
            onClick={checkAge}
          >Continue</button> 
        </div>
      </div>
      
      {/*Email*/}
      
      <div 
        style={{
          display: steps == 3? 'flex' : 'none',
        }}
        className={styles.nameDiv}>
        <span 
          className={styles.big}
        >Email</span>
        <span 
          className={styles.desc} 
        >Enter your email for confirmation</span>
        
        <label 
          className={styles.label} 
          htmlFor="email" 
        >
          Email
        </label>
        
        <input 
          name='email' 
          className={styles.name} 
          type='email' 
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className={styles.buttons}>
          <button 
            className={styles.backButton} 
            onClick={() => setSteps((prev) => prev-1)}
          >Back</button> 
          <button 
            className={styles.ButtonDiv} 
            onClick={() => email? createVerifiyPass() : ''}
          >Continue</button> 
        </div>
      </div>
      
      {/*verify email*/}
      
      <div 
        style={{
          display: steps == 4? 'flex' : 'none',
        }}
        className={styles.nameDiv}>
        <span 
          className={styles.big}
        >Verification</span>
        <span 
          className={styles.desc} 
        >Enter the digit code sent to {email}</span>
        
        <input 
          name='Code' 
          className={styles.number} 
          type='number' 
          placeholder='Code'
          value={verificationNumber}
          onChange={(e) => setVerificationNumber(e.target.value)}
        />
        <div className={styles.buttons}>
          <button 
            className={styles.backButton} 
            onClick={() => setSteps((prev) => prev-1)}
          >Back</button> 
          <button 
            className={styles.ButtonDiv} 
            onClick={verifyPass}
          >Verify</button> 
        </div>
      </div>
      
      {/*Password*/}
      
      <div 
        style={{
          display: steps == 5? 'flex' : 'none',
        }}
        className={styles.nameDiv}>
        <span 
          className={styles.big}
        >Password</span>
        <span 
          className={styles.desc} 
        >Create a strong password to secure your account</span>
        
        <label 
          className={styles.label} 
          htmlFor="password" 
        >
          Password
        </label>
        
        <input 
          name='password' 
          className={styles.name}
          value={password}
          type='password' 
          onChange={(e) => setPssw(e.target.value)}
          placeholder='Password'
        />
          
        <label 
          className={styles.label} 
          htmlFor="vPass"
        >
          Verify password
        </label>
        <input 
          name='vPass' 
          className={styles.name} 
          value={vPass}
          type='password'
          onChange={(e) => setVpass(e.target.value)}
          placeholder='Verify password'
        />
        
        <small style={{color: 'darkgray', margin: '10px 0',}}>
          By continuing you're agree with our <strong style={{color: 'white', cursor : 'pointer'}} onClick={() => router.push('/privacy_policy')}>Privacy policy</strong> and <strong onClick={() => router.push('/term_of_use')} style={{color: 'white', cursor: 'pointer'}}>Term of use</strong>.
        </small>
        
        <div className={styles.buttons}>
          <button 
            className={styles.backButton} 
            onClick={() => setSteps((prev) => prev-2)}
          >Back</button> 
          <button 
            className={styles.ButtonDiv} 
            onClick={register}
          >Finish</button> 
        </div>
      </div>
      
      
    </div>
  )
}