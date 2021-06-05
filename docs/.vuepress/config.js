module.exports = {
  title: 'VueTypes',
  base: process.env.NODE_ENV === 'production' ? '/vue-types/' : '/',
  plugins: [
    [
      'container',
      {
        type: 'ts',
        defaultTitle: 'TYPESCRIPT HINT',
      },
    ],
  ],
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
        ],
      },
      {
        title: 'Advanced',
        collapsable: false,
        children: [
          '/advanced/extending-vue-types',
          '/advanced/custom-instance',
        ],
      },
    ],
  },
}
