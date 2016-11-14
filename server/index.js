const path = require('path')
const express = require('express')
const serveIndex = require('serve-index')

const rootPath = path.join(__dirname, '..')
const app = express()

app.use(express.static(rootPath))
app.use(serveIndex(rootPath))

app.listen(8080, function () {
  console.log('started a server on http://localhost:8080')
})
