import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import PackageDemo from './components/PackageDemo.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PackageDemo', PackageDemo);
  },
} satisfies Theme;
