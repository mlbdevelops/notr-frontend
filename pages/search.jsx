import Header from '../components/header.jsx';
import { ChevronLeft, Search, Users, Type } from 'lucide-react';
import { useRouter } from 'next/router';
import styles from '../styles/search.module.scss';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function search(){
  const router = useRouter();
  const { t } = useTranslation();
  const historyList = [];
  const [q, setQ] = useState('');
  const [token, setToken] = useState('');
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, [!token]);
  
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    if (history) {
      setHistory(history);
    }
  }, []);
  
  const save = () => {
    !q? '' : historyList.push(q)
    const newList = [...historyList, ...history].splice(0, 7)
    const saveToLs = localStorage.setItem('history', JSON.stringify([...new Set([...newList])]))
  };
  
  const redirect = (e) => {
    !e.target.value? '' : router.push(`/searchPage/search?q=${e.target.value}`)
    save()
  }
  
  return(
    <div style={{marginTop: '30px'}} className={styles.body}>
      <div className={styles.inpDiv}>
        <ChevronLeft onClick={() => router.back()}/>
        <input 
          type='text' 
          placeholder={t('searchPage.placeholder')}
          value={q}
          className={styles.inp}
          onChange={(e) => setQ(e.target.value)}
          onKeyPress={redirect}
        />
        <Search onClick={() => {
          !q? '' : router.push(`/searchPage/search?q=${q}`)
        }} className={styles.searchB} size={20}/>
      </div>
      <div className={styles.historyDiv}>
        {history.length >= 1?
          history.map((his, i) => (
            <span 
              onClick={(e) => {
                setQ(his)
                e.target.value = his
                redirect(e)
              }}
              className={styles.elem}>
              {his}
              <span 
                onClick={() => {
                  setHistory(history.filter((sHis) => sHis !== his))
                  save()
                }}
                className={styles.remove}>
                ×
              </span>
            </span>
          ))
        : ''}
      </div>
    </div>
  );
}