import { createI18n } from "vue-i18n"

import en from "./locales/en.json"
import fr from "./locales/fr.json"
import es from "./locales/es.json"

const messages = {
    en,
    fr,
    es
}

const saved_language = localStorage.getItem("language")
const initial_language =
    saved_language &&
        Object.prototype.hasOwnProperty.call(messages, saved_language)
        ? saved_language
        : "en"

const i18n = createI18n({
    legacy: false,
    locale: initial_language,
    fallbackLocale: "en",
    messages,
})

export default i18n
