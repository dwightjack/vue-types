module.exports = {
  title: 'VueTypes',
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
          ['/guide/validators', 'Validators'],
          '/guide/namespaced',
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
