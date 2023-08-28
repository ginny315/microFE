import { createI18n } from 'vue-i18n'
/**
 * 此处引入ZH EN文件，为键值对模式
 * {{ $t('msg.title')}}
 */
const messages = {
  en: {
    msg: {
      title: 'UMS'
    }
  },
  zh: {
    msg: {
      title: '用户管理系统'
    }
  }
}

const getCurrentLanguage = () => {
  const UAlang = navigator.language
  const langCode = UAlang.indexOf('zh') !== -1 ? 'zh' : 'en'
  localStorage.setItem('lang', langCode)
  return langCode
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getCurrentLanguage() || 'zh',
  messages: messages
})

export default i18n
