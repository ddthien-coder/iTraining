import i18n, {TFunction} from "i18next";
import Backend from 'i18next-http-backend';

class I18nManager {
  language:    string = 'en';
  fallbackLng: string = 'en';

  constructor() {
    i18n
      .use(Backend)
      .init({
        lng: this.language,
        ns: ['translation', 'widget'],
        fallbackLng: this.fallbackLng,
        defaultNS: 'translation',
        keySeparator: false, // we do not use keys in form messages.welcome
        interpolation: {
          escapeValue: false // react already safes from xss
        },
        backend: {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
          addPath:  '/locales/add/{{lng}}/{{ns}}',
        }
      });
  }

  getLanguage() { return this.language ; }

  changeLanguage(lang: string) {
    this.language = lang;
    i18n.changeLanguage(lang);
  }

  getT(ns?: Array<string>, lang?: string) : TFunction {
    let language = lang;
    if(!language) language = this.language;
    if(!ns) ns = ['translation'];
    else    ns.push('translation');
    let t: TFunction = i18n.getFixedT(language, ns);
    return t;
  }

  getDataByLanguage(lang: string = 'en') {
    return i18n.getDataByLanguage(lang);
  }
}

const i18nManager = new I18nManager();
export  { i18nManager  as i18n };