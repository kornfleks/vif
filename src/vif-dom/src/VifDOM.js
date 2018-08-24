import VifReconciler from '../../vif-reconciler'
import {
    create,
    render,
    remove,
    insert,
    append,
    updateAttribute,
    setTextContent
} from './Effects'
import initialRender from './render'

const effects = {
    create,
    render,
    remove,
    insert,
    append,
    updateAttribute,
    setTextContent
}

VifReconciler.setEffects(effects)

const VifDOM = {
    render: initialRender
}

export default VifDOM
