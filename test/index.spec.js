import expect from 'expect'

import vueProps from '../src/index'

describe('index.js', () => {

  it('should go', () => {

    expect(vueProps.array.type).toBe(Array)

  })

})
