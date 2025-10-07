import Header from '../../components/header.jsx'
import { ChevronLeft, Check, Globe } from 'lucide-react'
import { useRouter } from 'next/router'
import styles from '../../styles/lang.module.scss'
import { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

export default function report(){
  const [load, setLoad] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [selectedLang, setSelectedLang] = useState('')
  const router = useRouter();
  const { t } = useTranslation()
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '普通话 / 汉语' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'ru', name: 'Русский' },
    { code: 'pt', name: 'Português' },
    { code: 'ur', name: 'اردو' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
    { code: 'sw', name: 'Kiswahili' },
    { code: 'mr', name: 'मराठी' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'ko', name: '한국어' }
  ];
  
  useEffect(() => {
    const loadLang = async () => {
      const { value } = await Preferences.get({ key: 'language' });
      if (value) setSelectedLang(value);
    };
    loadLang();
  }, []);

  const selectLanguage = async (langCode) => {
    setSelectedLang(langCode);
    setConfirm(true);

    try {
      i18n.changeLanguage(langCode);
      await Preferences.set({ key: 'language', value: langCode });
    } catch (err) {
      console.error('Error changing language', err);
    }
  }

  const report = () => {
    setConfirm(false)
    setLoad(true)
    setTimeout(() => {
      router.back()
      setLoad(false)
    }, 3500)
  }

  return(
    <div style={{marginTop: '100px'}} className={styles.body}>
      <Header 
        isTransparent={true}
        text={t('header.langs')}
        leftIcon={<ChevronLeft style={{padding: '10px'}} onClick={() => router.back()}/>}
        blur={'20px'}
        rightIcons={<Globe/>}
      />

      <div className={styles.languages}>
          {languages.map(({ code, name }) => (
            <p 
              key={code}
              onClick={() => selectLanguage(code)} 
              className={styles.language}
              style={{ fontWeight: selectedLang === code ? 'bold' : 'normal' }}
            >
              {name}
              {selectedLang === code && <Check className={styles.check} size={12}/>}
            </p>
          ))}
      </div>
    </div>
  );
}