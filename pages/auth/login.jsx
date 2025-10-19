import Question from '../../components/confirm.jsx';
import { ArrowRight } from 'lucide-react';
import styles from '../../styles/login.module.scss';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Loader from '../../components/loading_spinner.jsx';
import { useTranslation } from 'react-i18next';
import { Toast } from '@capacitor/toast'

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({});
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      router.push('/');
    }
  }, []);

  const login = async () => {
    const data = { email, password };

    try {
      setIsLoading(true);
      const res = await fetch('https://notrbackend.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const user = await res.json();
      if (!res.ok) {
        setIsLoading(false)
        setIsSuccess(false);
        await Toast.show({
          text: 'Error, try again',
          duration: 'short',
          position: 'bottom',
        })
        return;
      }
      if (res.ok) {
        setIsLoading(false);
        localStorage.setItem('theme', 'dark');
        localStorage.setItem('user', JSON.stringify(user.response));
        localStorage.setItem('token', JSON.stringify(user.token));
        localStorage.setItem('isAutoSave', 'Off');
        localStorage.setItem('tab', 1);
        router.push('/');
      } else {
        setIsSuccess(true);
        setIsLoading(false);
        setMsg({
          msg: user.msg,
          title: t('login.alert_title'),
          actions: <p onClick={() => setIsSuccess(false)}>{t('login.alert_ok')}</p>,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={styles.body}>
      <h2 style={{ margin: '20px 0' }}>{t('login.login_message')}</h2>

      {isSuccess && <Question msg={msg.msg} title={msg.title} actions={msg.actions} />}

      {isLoading && <Loader loaderColor="white" />}

      <div className={styles.inpDiv}>
        <label className={styles.label} htmlFor="email">
          <strong style={{ marginLeft: '5px' }}>{t('login.email')}</strong>
          <input
            className={styles.inp}
            name="email"
            type="text"
            placeholder={t('login.email')}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className={styles.label} htmlFor="pssw">
          <strong style={{ marginLeft: '5px' }}>{t('login.password')}</strong>
          <input
            className={styles.inp}
            name="pssw"
            type="password"
            placeholder={t('login.password')}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className={styles.lbtn} onClick={login}>
          {t('login.login_button')}
        </button>
      </div>

      <p style={{ position: 'absolute', color: '#707070', bottom: '10px' }}>
        {t('login.account_not_exist')}{' '}
        <Link
          style={{ fontWeight: 'bold', textDecoration: 'none', color: 'white' }}
          href="/auth/register"
        >
          {t('login.register_link')}
        </Link>
      </p>
    </div>
  );
}