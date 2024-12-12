/**
 * Support globalThis in E2019 and lower
 * @see https://mathiasbynens.be/notes/globalthis
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
;(function () {
  if (typeof globalThis === 'object') return
  Object.defineProperty(Object.prototype, '__magic__', {
    get: function () {
      return this
    },
    configurable: true, // This makes it possible to `delete` the getter later.
  })
  // @ts-expect-error
  __magic__.globalThis = __magic__ // lolwat
  // @ts-expect-error
  delete Object.prototype.__magic__
})()
