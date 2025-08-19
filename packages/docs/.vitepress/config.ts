import { defineConfig } from 'vitepress'
import container from 'markdown-it-container'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { version } from '../../core/package.json'

export default defineConfig({
  title: 'VueTypes',
  base: '/',
  lastUpdated: true,
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
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
    search: {
      provider: 'local',
    },
    siteTitle: 'VueTypes v' + version,
    editLink: {
      pattern:
        'https://github.com/dwightjack/vue-types/edit/main/packages/docs/:path',
    },
    nav: [
      {
        text: 'v1.x Docs',
        link: 'https://github.com/dwightjack/vue-types/blob/v1/README.md',
      },
      {
        text: 'v2 ~ v5.x Docs',
        link: 'https://vue-types-v5.codeful.dev',
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

          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Nuxt', link: '/guide/nuxt' },
        ],
      },
      {
        text: 'Advanced',
        collapsable: false,
        items: [
          { text: 'Custom Validators', link: '/advanced/custom-validators' },

          { text: 'TypeScript Usage', link: '/advanced/typescript' },
        ],
      },
      {
        text: 'Namespaced Usage',
        collapsable: true,
        items: [
          { text: 'Getting started', link: '/namespaced-usage/index' },
          {
            text: 'Extending VueTypes',
            link: '/namespaced-usage/extend',
          },
          {
            text: 'Custom instance',
            link: '/namespaced-usage/custom-instance',
          },
        ],
      },
    ],
  },
})
