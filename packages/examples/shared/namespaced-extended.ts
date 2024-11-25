import VueTypes, { toType } from 'vue-types'

export class VueTypesProject extends VueTypes {
  static maxLength(max: number) {
    return toType('maxLength', {
      type: String,
      validator: (v) => String(v).length <= max,
    })
  }

  static get positive() {
    return toType('psitive', {
      type: Number,
      validator: (v: number) => v > 0,
    })
  }
}
