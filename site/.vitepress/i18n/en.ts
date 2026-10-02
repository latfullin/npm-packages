import type { LangFile } from './types';

export default {
  code: 'en',
  label: 'English',
  lang: 'en-US',
  description: 'Tiny zero-dependency npm packages',
  nav: { packages: 'Packages' },
  home: { tagline: 'Tiny, fast, zero-dependency npm packages', action: 'Browse packages' },
  theme: {
    outline: 'On this page',
    prev: 'Previous page',
    next: 'Next page',
    returnToTop: 'Return to top',
    menu: 'Menu',
    darkModeSwitch: 'Appearance',
    lightModeTitle: 'Switch to light theme',
    darkModeTitle: 'Switch to dark theme',
    langMenu: 'Change language',
    notFound: { title: 'Page not found', quote: 'This page does not exist.', linkText: 'Take me home' },
  },
  search: {
    button: 'Search',
    noResults: 'No results for',
    reset: 'Reset search',
    select: 'to select',
    navigate: 'to navigate',
    close: 'to close',
  },
  docs: { signature: 'Signature', params: 'Parameters', codes: 'Error codes', examples: 'Examples', example: 'Example', see: 'See also', notes: 'Notes' },
  demo: {
    version: 'Version',
    local: 'local',
    unpublished: 'not published to npm yet',
    loading: 'Loading…',
    failed: 'Failed to load',
  },
} satisfies LangFile;
