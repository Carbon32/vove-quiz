import { createApp } from 'vue'
// @ts-ignore
import './style.css'
import App from './App.vue'
import { createPinia } from "pinia"
import { router } from "./router"
import i18n from './i18n.ts'
import { useAuthStore } from './stores/auth.ts'

const pinia = createPinia()
const app = createApp(App).use(pinia).use(router).use(i18n)

const auth = useAuthStore(pinia)
await auth.check_auth()

app.mount('#app')
