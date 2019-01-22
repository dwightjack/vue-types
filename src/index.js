import Validator from './validator'
import Shim from './shim'

const VueTypes = process.env.NODE_ENV === 'production' ? Shim : Validator

export default VueTypes
