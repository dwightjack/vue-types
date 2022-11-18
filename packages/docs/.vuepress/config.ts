import { slugify as vuePressSlugify } from '@vuepress/shared-utils'
import { defineConfig } from 'vuepress/config'

// https://github.com/vuejs/vuepress/issues/1985#issuecomment-704924046
function customSlugifyToHandleBadges(str) {
  // Remove badges and use original slugify function
  return vuePressSlugify(str.replace(/<Badge[^>]*\/>/, ''))
}

export default defineConfig({
  title: 'VueTypes',
  base: process.env.NODE_ENV === 'production' ? '/vue-types/' : undefined,
  plugins: [
    [
      'container',
      {
        type: 'ts',
        defaultTitle: 'TYPESCRIPT HINT',
      },
    ],
  ],
  markdown: {
    slugify: customSlugifyToHandleBadges,
    toc: {
      slugify: customSlugifyToHandleBadges,
    },
  },
  themeConfig: {
    repo: 'dwightjack/vue-types',
    docsDir: 'docs',
    sidebarDepth: 2,
    smoothScroll: true,
    lastUpdated: 'Last Updated',
    nav: [
      {
        text: 'v1.x Docs',
        link: 'https://github.com/dwightjack/vue-types/blob/v1/README.md',
      },
    ],
    sidebar: [
      ['/', 'Introduction'],
      {
        title: 'Guide',
        collapsable: false,
        children: [
          '/guide/installation',
          ['/guide/validators', 'Using VueTypes'],
          '/guide/namespaced',
          '/guide/configuration',
          '/guide/troubleshooting',
        ],
      },
      {
        title: 'Advanced',
        collapsable: false,
        children: [
          '/advanced/extending-vue-types',
          '/advanced/custom-instance',
          '/advanced/typescript',
        ],
      },
    ],
  },
})
