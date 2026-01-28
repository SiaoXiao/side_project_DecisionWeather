import { createApp } from 'vue'
import './styles/style.css'
import App from './App.vue'
import i18n, { loadLocale } from './plugins/i18n'

const bootstrap = async () => {
  await loadLocale(i18n.global.locale.value);
  createApp(App).use(i18n).mount('#app');
};

bootstrap();
