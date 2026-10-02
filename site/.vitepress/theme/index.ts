import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import PackageDemo from './components/PackageDemo.vue';
import TinyvalDemo from './components/TinyvalDemo.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PackageDemo', PackageDemo);
    app.component('TinyvalDemo', TinyvalDemo);
  },
} satisfies Theme;
