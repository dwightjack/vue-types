module.exports = {
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
        children: ['/advanced/extending-vue-types'],
      },
    ],
  },
}
