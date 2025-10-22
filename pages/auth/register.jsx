import { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import styles from '../../styles/register.module.scss';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../../components/header.jsx';
import Loader from '../../components/loading_spinner.jsx';
import Question from '../../components/confirm.jsx';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { Toast } from '@capacitor/toast'
import { Capacitor } from '@capacitor/core'

export default function Register() {
  const { t } = useTranslation();
  const router = useRouter();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [userAge, setAge] = useState();
  const [password, setPssw] = useState('');
  const [vPass, setVpass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState(false);
  const [young, setYoung] = useState(false);
  const [msgData, setMsgData] = useState({});
  const [verificationNumber, setVerificationNumber] = useState('');
  const [steps, setSteps] = useState(1);

  const dateInp = useRef(null);

  const cal = (year) => {
    if (!year) return;
    const birthYear = Number(year.slice(0, 4));
    if (isNaN(birthYear)) return;
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  useEffect(() => {
    const getUser = localStorage.getItem('user');
    const user = JSON.parse(getUser);
    if (user?.id) {
      router.push('/');
    }
  }, []);

  const regLogic = async () => {
    if (vPass !== password) {
      if (Capacitor.isNativePlatform()) {
        return await Toast.show({
          text : t('register.alerts.password_mismatch'), 
          duration: 'long',
          position: 'bottom',
        });
      }else{
        return alert(t('register.alerts.password_mismatch'));
      }
      return;
    }
    register();
  };

  const register = async () => {
    if (!vPass) return;
    setIsLoading(true);

    const res = await fetch('https://notrbackend.vercel.app/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name,
        username,
        password: vPass,
        age: cal(userAge),
      }),
    });
    
    if (!res.ok) {
      setIsLoading(false)
      await Toast.show({
        text: 'Error, try again',
        duration: 'short',
        position: 'bottom',
      })
      return;
    }
    
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data.response));
      localStorage.setItem('token', JSON.stringify(data.token));
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('isAutoSave', 'Off');
      localStorage.setItem('tab', 1);
      router.push('/');
    }
  };

  const createVerifyPass = async () => {
    return setSteps(5);
    setIsLoading(true);
    const res = await fetch('https://notrbackend.vercel.app/api/createCode/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    
    if (!res.ok) {
      setIsLoading(false)
      await Toast.show({
        text: 'Error, try again',
        duration: 'short',
        position: 'bottom',
      })
      return;
    }
    
    if (res.status === 401) {
      setMsg(true);
      setMsgData(data);
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: verificationNumber }),
    });
    const data = await res.json();
    
    if (!res.ok) {
      setMsg(true);
      setMsgData(data);
      setIsLoading(false);
    }

    if (res.ok && data?.isSuccess) {
      setIsLoading(false);
      setSteps(5);
    }
  };

  const checkAge = () => {
    if (cal(userAge) >= 13) {
      setSteps(3);
    } else {
      setYoung(true);
    }
  };

  return (
    <div style={{ marginTop: '95px' }} className={styles.body}>
      <Header
        leftIcon={
          <ChevronLeft
            onClick={() => router.back()}
            style={{ padding: '10px', cursor: 'pointer', transition: '0.1s' }}
          />
        }
        isTransparent={true}
        blur={'10px'}
      />

      {young && (
        <Question
          title={t('register.alerts.ageTitle')}
          msg={t('register.alerts.age_restriction')}
          actions={<p onClick={() => setYoung(false)}>{t('register.alerts.alert_ok')}</p>}
        />
      )}

      {isLoading && <Loader loaderColor="white" />}

      {msg && msgData?.msg === t('register.alerts.email_registered') && (
        <Question
          msg={msgData.msg}
          title={t('register.alerts.email_registered')}
          actions={[
            <p onClick={() => setMsg(false)}>{t('register.alerts.alert_ok')}</p>,
            <p onClick={() => router.push('/auth/login')}>{t('login.login_button')}</p>,
          ]}
        />
      )}

      {msg && msgData?.msg === t('register.alerts.incorrect_code') && (
        <Question
          msg={msgData.msg}
          title={t('register.alerts.incorrect_code')}
          actions={<p onClick={() => setMsg(false)}>{t('register.alerts.alert_ok')}</p>}
        />
      )}

      {/* Name and username */}
      <div style={{ display: steps === 1 ? 'flex' : 'none' }} className={styles.nameDiv}>
        <span className={styles.big}>{t('register.steps.name_username.title')}</span>
        <span className={styles.desc}>{t('register.steps.name_username.desc')}</span>

        <label className={styles.label} htmlFor="name">
          {t('register.steps.name_username.name')}
        </label>
        <input
          name="name"
          className={styles.name}
          value={name}
          type="text"
          onChange={(e) => setName(e.target.value)}
          placeholder={t('register.steps.name_username.name')}
        />

        <label className={styles.label} htmlFor="username">
          {t('register.steps.name_username.username')}
        </label>
        <input
          name="username"
          className={styles.name}
          value={username}
          type="text"
          onChange={(e) =>
            setUsername(e.target.value.trim().toLowerCase().substring(0, 20))
          }
          placeholder={t('register.steps.name_username.username')}
        />
        <span
          style={{
            alignSelf: 'flex-start',
            fontSize: '12px',
            margin: '10px 0',
            marginLeft: '15px',
            color: 'darkgray',
          }}
        >
          {t('register.steps.name_username.username_note')}
        </span>
        <button
          onClick={() => (username && name ? setSteps(2) : '')}
          className={styles.cButton}
        >
          {t('register.steps.name_username.continue')}
        </button>
      </div>

      {/* Birthday */}
      <div style={{ display: steps === 2 ? 'flex' : 'none' }} className={styles.nameDiv}>
        <span className={styles.big}>{t('register.steps.birthday.title')}</span>
        <span className={styles.desc}>{t('register.steps.birthday.desc')}</span>

        <label className={styles.label} htmlFor="date">
          {t('register.steps.birthday.date')}
        </label>
        <input
          name="date"
          className={styles.name}
          type="date"
          value={userAge}
          onChange={(e) => setAge(e.target.value)}
        />
        <div className={styles.buttons}>
          <button
            className={styles.backButton}
            onClick={() => setSteps((prev) => prev - 1)}
          >
            {t('register.steps.birthday.back')}
          </button>
          <button className={styles.ButtonDiv} onClick={checkAge}>
            {t('register.steps.birthday.continue')}
          </button>
        </div>
      </div>

      {/* Email */}
      <div style={{ display: steps === 3 ? 'flex' : 'none' }} className={styles.nameDiv}>
        <span className={styles.big}>{t('register.steps.email.title')}</span>
        <span className={styles.desc}>{t('register.steps.email.desc')}</span>

        <label className={styles.label} htmlFor="email">
          {t('register.steps.email.email')}
        </label>
        <input
          name="email"
          className={styles.name}
          type="email"
          placeholder={t('register.steps.email.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className={styles.buttons}>
          <button
            className={styles.backButton}
            onClick={() => setSteps((prev) => prev - 1)}
          >
            {t('register.steps.email.back')}
          </button>
          <button
            className={styles.ButtonDiv}
            onClick={() => (email ? createVerifyPass() : '')}
          >
            {t('register.steps.email.continue')}
          </button>
        </div>
      </div>

      {/* Verify email */}
      <div style={{ display: steps === 4 ? 'flex' : 'none' }} className={styles.nameDiv}>
        <span className={styles.big}>{t('register.steps.verification.title')}</span>
        <span className={styles.desc}>
          {t('register.steps.verification.desc', { email })}
        </span>

        <input
          name="Code"
          className={styles.number}
          type="number"
          placeholder={t('register.steps.verification.code')}
          value={verificationNumber}
          onChange={(e) => setVerificationNumber(e.target.value)}
        />
        <div className={styles.buttons}>
          <button
            className={styles.backButton}
            onClick={() => setSteps((prev) => prev - 1)}
          >
            {t('register.steps.verification.back')}
          </button>
          <button className={styles.ButtonDiv} onClick={verifyPass}>
            {t('register.steps.verification.verify')}
          </button>
        </div>
      </div>

      {/* Password */}
      <div style={{ display: steps === 5 ? 'flex' : 'none' }} className={styles.nameDiv}>
        <span className={styles.big}>{t('register.steps.password.title')}</span>
        <span className={styles.desc}>{t('register.steps.password.desc')}</span>

        <label className={styles.label} htmlFor="password">
          {t('register.steps.password.password')}
        </label>
        <input
          name="password"
          className={styles.name}
          value={password}
          type="password"
          onChange={(e) => setPssw(e.target.value)}
          placeholder={t('register.steps.password.password')}
        />

        <label className={styles.label} htmlFor="vPass">
          {t('register.steps.password.verify_password')}
        </label>
        <input
          name="vPass"
          className={styles.name}
          value={vPass}
          type="password"
          onChange={(e) => setVpass(e.target.value)}
          placeholder={t('register.steps.password.verify_password')}
        />
        
        
        <small style={{ color: 'darkgray', margin: '10px 0' }}>
          {t('register.steps.password.privacy_policy_text', {
            privacy_policy: t('register.steps.password.privacy_policy'),
            terms_of_use: t('register.steps.password.terms_of_use')
          })}
          <span style={{ marginLeft: '4px' }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                font: 'inherit'
              }}
              onClick={() => router.push('/privacy_policy')}
            >
              {t('register.steps.password.privacy_policy')}
            </button>
            { t('register.steps.password.and_text')}
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                font: 'inherit'
              }}
              onClick={() => router.push('/term_of_use')}
            >
              {t('register.steps.password.terms_of_use')}
            </button>
          </span>
        </small>
        <div className={styles.buttons}>
          <button
            className={styles.backButton}
            onClick={() => setSteps((prev) => prev - 2)}
          >
            {t('register.steps.password.back')}
          </button>
          <button className={styles.ButtonDiv} onClick={regLogic}>
            {t('register.steps.password.finish')}
          </button>
        </div>
      </div>
    </div>
  );
}