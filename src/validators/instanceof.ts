import { toType } from '../utils'
import { Constructor } from 'vue/types/options'

export default function instanceOf<C extends Constructor>(
  instanceConstructor: C,
) {
  return toType<InstanceType<C>>('instanceOf', {
    type: instanceConstructor,
  })
}
