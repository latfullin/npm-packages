import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import PackageDemo from './components/PackageDemo.vue';
import TinyvalDemo from './components/TinyvalDemo.vue';
import TinyvalVueDemo from './components/TinyvalVueDemo.vue';
import TinyvalMaskDemo from './components/TinyvalMaskDemo.vue';
import TinyvalPhoneDemo from './components/TinyvalPhoneDemo.vue';
import { trackRouteChanges } from './metrika';

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('PackageDemo', PackageDemo);
    app.component('TinyvalDemo', TinyvalDemo);
    app.component('TinyvalVueDemo', TinyvalVueDemo);
    app.component('TinyvalMaskDemo', TinyvalMaskDemo);
    app.component('TinyvalPhoneDemo', TinyvalPhoneDemo);
    trackRouteChanges(router);
  },
} satisfies Theme;
