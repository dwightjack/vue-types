import VueTypes, {
  VueTypesInterface,
  VueTypeDef,
  VueTypeValidableDef,
} from 'vue-types'

interface ProjectTypes extends VueTypesInterface {
  //VueTypeDef accepts the prop expected type as argument
  maxLength(max: number): VueTypeDef<string>
  // use VueTypeValidableDef if the new type is going to support the `validate` method.
  positive: VueTypeValidableDef<number>
}

export default VueTypes.extend<ProjectTypes>([
  {
    name: 'maxLength',
    type: String,
    validator: (max: number, v: string) => v.length <= max,
  },
  {
    name: 'positive',
    getter: true,
    type: Number,
    validator: (v: number) => v > 0,
  },
])
