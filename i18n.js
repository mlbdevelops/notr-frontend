import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './public/locales/en.json';
import fr from './public/locales/fr.json';
import zh from './public/locales/zh.json';
import hi from './public/locales/hi.json';
import es from './public/locales/es.json';
import bn from './public/locales/bn.json';
import ar from './public/locales/ar.json';
import ru from './public/locales/ru.json';
import pt from './public/locales/pt.json';
import ur from './public/locales/ur.json';
import id from './public/locales/id.json';
import de from './public/locales/de.json';
import ja from './public/locales/ja.json';
import sw from './public/locales/sw.json';
import mr from './public/locales/mr.json';
import te from './public/locales/te.json';
import tr from './public/locales/tr.json';
import ta from './public/locales/ta.json';
import vi from './public/locales/vi.json';
import ko from './public/locales/ko.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      zh: { translation: zh },
      hi: { translation: hi },
      es: { translation: es },
      bn: { translation: bn },
      ar: { translation: ar },
      ru: { translation: ru },
      pt: { translation: pt },
      ur: { translation: ur },
      id: { translation: id },
      de: { translation: de },
      ja: { translation: ja },
      sw: { translation: sw },
      mr: { translation: mr },
      te: { translation: te },
      tr: { translation: tr },
      ta: { translation: ta },
      vi: { translation: vi },
      ko: { translation: ko },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;