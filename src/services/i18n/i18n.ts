import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// Storage
import { STORAGE_KEYS } from "@/src/services/storage/storageKeys";
import { storageService } from "@/src/services/storage";
// ? Languages
// Auth
import auth_en from "./locales/en/auth.json";
import auth_tr from "./locales/tr/auth.json";
// Welcome
import welcome_en from "./locales/en/welcome.json";
import welcome_tr from "./locales/tr/welcome.json";

const resources: any = {
  en: {
    auth: auth_en,
    welcome: welcome_en,
  },
  tr: {
    auth: auth_tr,
    welcome: welcome_tr,
  },
};

const getDefaultLang = async () => {
  const storedLang: string | null = await storageService.get<string>(
    STORAGE_KEYS.SETTINGS.LANGUAGE,
  );

  return i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: storedLang ? storedLang : 'en',

      interpolation: {
        escapeValue: false,
      },

      fallbackLng: ['uz', 'en'],
    });
};

export default getDefaultLang();