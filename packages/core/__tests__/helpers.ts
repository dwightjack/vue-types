export function checkRequired(type: any) {
  expect(type.isRequired).toEqual(
    expect.objectContaining({
      required: true,
    }),
  )
}

// Vue.js does keep the context for validators, so there is no `this`
export const forceNoContext = <T extends (..._args: any[]) => any>(
  validator: T,
): T => validator.bind(undefined)

export function getDescriptors<T extends { [key: string]: any }>(type: T): T {
  const descriptors = {} as { [P in keyof T]: any }
  Object.getOwnPropertyNames(type).forEach((key) => {
    descriptors[key as keyof T] = Object.getOwnPropertyDescriptor(type, key)
  })
  return descriptors
}

export function getExpectDescriptors<T extends { [key: string]: any }>(
  type: T,
): any {
  const descriptors = {} as { [P in keyof T]: any }
  Object.getOwnPropertyNames(type).forEach((key) => {
    const descr = Object.getOwnPropertyDescriptor(type, key)
    if (typeof descr.get === 'function') {
      descr.get = expect.any(Function) as any
    }
    if (typeof descr.value === 'function') {
      descr.value = expect.any(Function) as any
    }
    descriptors[key as keyof T] = descr
  })
  return descriptors
}
