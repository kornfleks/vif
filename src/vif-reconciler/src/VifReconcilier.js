import * as lifecycle from './Lifecycle'
import patch, { setEffects } from './patch'

const reconcilier = {
    lifecycle,
    patch,
    setEffects
}

export default reconcilier
