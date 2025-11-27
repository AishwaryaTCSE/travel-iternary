import { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Import your translation files
import enTranslations from '../i18n/en.json';
import hiTranslations from '../i18n/hi.json';
import taTranslations from '../i18n/ta.json';
import teTranslations from '../i18n/te.json';
import knTranslations from '../i18n/kn.json';

const LanguageContext = createContext();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      hi: { translation: hiTranslations },
      ta: { translation: taTranslations },
      te: { translation: teTranslations },
      kn: { translation: knTranslations },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useLocalStorage('language', 'en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    // For RTL languages like Arabic, Hebrew, etc.
    setIsRTL(['ar', 'he'].includes(lang));
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        isRTL,
        t: (key, options) => i18n.t(key, options),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;