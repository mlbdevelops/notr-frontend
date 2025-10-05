import {
  Use,
  Term,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Header from '../../components/header.jsx';
import { useRouter } from 'next/router';
import styles from '../../styles/settings.module.scss'
import { useTranslation } from 'react-i18next';

export default function about() {
  const router = useRouter()
  const { t } = useTranslation();
  return(
    <div style={{
      margin: '70px 0',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      marginTop: '100px',
    }}>
      <Header 
        text={t('header.about')}
        isTransparent={true}
        blur={'10px'}
        leftIcon={<ChevronLeft style={{padding: '10px'}} onClick={() => router.back()}/>}
      />
        { /*privacy policy*/ }
        <div onClick={() => {
          router.push('/privacy_policy')
        }} className={styles.component}>
          <span className={styles.span}>
            {t('about.policy')}
          </span>
          <ChevronRight/>
        </div>
        { /*term of use*/ }
        <div onClick={() => {
          router.push('/term_of_use')
        }} className={styles.component}>
          <span className={styles.span}>
            {t('about.term')}
          </span>
          <ChevronRight/>
        </div>
    </div>
  );
}