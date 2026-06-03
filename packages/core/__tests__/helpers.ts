// oxlint-disable typescript/no-unsafe-type-assertion
export function checkRequired(type: any) {
  expect(type.isRequired).toEqual(
    expect.objectContaining({
      required: true,
    }),
  )
}

// Vue.js does keep the context for validators, so there is no `this`
export const forceNoContext = <T extends (..._args: any[]) => any>(
  validator?: T,
): T => validator?.bind(undefined) as T

export const getDescriptors = (type: unknown) =>
  Object.getOwnPropertyDescriptors(type)

export function getExpectDescriptors(type: unknown) {
  const descriptors = getDescriptors(type)
  Object.keys(descriptors).forEach((key) => {
    const descr = Object.getOwnPropertyDescriptor(type, key)
    if (!descr) {
      return
    }
    if (typeof descr?.get === 'function') {
      descr.get = expect.any(Function)
    }
    if (typeof descr?.value === 'function') {
      descr.value = expect.any(Function)
    }
    descriptors[key] = descr
  })
  return descriptors
}
