import { createApp } from 'vue';
import './plugins/assets';
import VxeUI from 'vxe-pc-ui';
import VXETable from '@/plugins/vxeTable';
import { setupAppVersionNotification, setupDayjs, setupIconifyOffline, setupLoading, setupNProgress } from './plugins';
import { setupStore } from './store';
import { setupRouter } from './router';
import { setupI18n } from './locales';
import { setupDirectives } from './directives';
import App from './App.vue';

import 'vxe-pc-ui/lib/style.css';
import 'vxe-table/lib/style.css';

async function setupApp() {
  setupLoading();

  setupNProgress();

  setupIconifyOffline();

  setupDayjs();

  const app = createApp(App);

  setupStore(app);

  setupDirectives(app);

  await setupRouter(app);

  setupI18n(app);

  setupAppVersionNotification();

  app.use(VxeUI).use(VXETable).mount('#app');
}

setupApp();
