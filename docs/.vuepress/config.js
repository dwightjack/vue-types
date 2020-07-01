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
      '/guide/installation',
      ['/guide/validators', 'Validators'],
      '/guide/namespaced',
      '/guide/advanced-usage',
    ],
  },
}
