import type { LangFile } from './types';

export default {
  code: 'zh',
  label: '简体中文',
  lang: 'zh-CN',
  description: '小巧、零依赖的 npm 软件包',
  nav: { packages: '软件包' },
  home: { tagline: '小巧、快速、零依赖的 npm 软件包', action: '浏览软件包' },
  theme: {
    outline: '本页目录',
    prev: '上一页',
    next: '下一页',
    returnToTop: '返回顶部',
    menu: '菜单',
    darkModeSwitch: '主题',
    lightModeTitle: '切换到浅色模式',
    darkModeTitle: '切换到深色模式',
    langMenu: '语言',
    notFound: { title: '页面未找到', quote: '该页面不存在。', linkText: '返回首页' },
  },
  search: {
    button: '搜索',
    noResults: '没有找到结果',
    reset: '清除',
    select: '选择',
    navigate: '切换',
    close: '关闭',
  },
  docs: { signature: '签名', params: '参数', codes: '错误代码', examples: '示例', example: '示例', see: '另请参阅', notes: '注意事项' },
  demo: {
    version: '版本',
    local: '本地',
    unpublished: '尚未发布到 npm',
    loading: '加载中…',
    failed: '加载失败',
  },
} satisfies LangFile;
