import '@/api/axiosConfig'
import App from '@/App.vue'
import router from '@/router.ts'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import '@/assets/style/style.css'

createApp(App).use(router).use(createPinia()).mount('#app')
