// import { slugify as vuePressSlugify } from '@vuepress/shared-utils'
import { defineConfig } from 'vitepress'
import container from 'markdown-it-container'

// https://github.com/vuejs/vuepress/issues/1985#issuecomment-704924046
// function customSlugifyToHandleBadges(str) {
//   // Remove badges and use original slugify function
//   return vuePressSlugify(str.replace(/<Badge[^>]*\/>/, ''))
// }

export default defineConfig({
  title: 'VueTypes',
  base: process.env.NODE_ENV === 'production' ? '/vue-types/' : '/',
  // plugins: [
  //   [
  //     'container',
  //     {
  //       type: 'ts',
  //       defaultTitle: 'TYPESCRIPT HINT',
  //     },
  //   ],
  // ],
  // markdown: {
  //   slugify: customSlugifyToHandleBadges,
  //   toc: {
  //     slugify: customSlugifyToHandleBadges,
  //   },
  // },
  lastUpdated: true,
  markdown: {
    config(md) {
      md.use(container, 'ts', {
        render(tokens, idx) {
          const token = tokens[idx]
          if (token.nesting === 1) {
            return `<div class="ts custom-block"><p class="custom-block-title">${md.renderInline(
              token.info.trim().slice(2).trim() || 'TYPESCRIPT HINT',
            )}</p>\n`
          } else {
            return '</div>'
          }
        },
      })
    },
  },
  themeConfig: {
    editLink: {
      pattern:
        'https://github.com/dwightjack/vue-types/edit/main/packages/docs/:path',
    },
    nav: [
      {
        text: 'v1.x Docs',
        link: 'https://github.com/dwightjack/vue-types/blob/v1/README.md',
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dwightjack/vue-types' },
    ],
    outline: [2, 3],
    sidebar: [
      {
        text: 'Guide',
        collapsable: false,
        items: [
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Using VueTypes', link: '/guide/validators' },
          { text: 'Namespaced Usage', link: '/guide/namespaced' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Troubleshooting', link: '/guide/troubleshooting' },
        ],
      },
      {
        text: 'Advanced',
        collapsable: false,
        items: [
          { text: 'Extending VueTypes', link: '/advanced/extending-vue-types' },
          {
            text: 'Custom namespaced instance',
            link: '/advanced/custom-instance',
          },
          { text: 'TypeScript Usage', link: '/advanced/typescript' },
        ],
      },
    ],
  },
})
