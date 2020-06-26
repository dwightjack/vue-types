export function checkRequired(type: any) {
  expect(type.isRequired).toEqual(
    jasmine.objectContaining({
      required: true,
    }),
  )
}

// Vue.js does keep the context for validators, so there is no `this`
export const forceNoContext = (validator) => validator.bind(undefined)

export function getDescriptors<T extends object>(type: T): T {
  const descriptors = {} as { [P in keyof T]: any }
  Object.getOwnPropertyNames(type).forEach((key) => {
    descriptors[key as keyof T] = Object.getOwnPropertyDescriptor(type, key)
  })
  return descriptors
}
