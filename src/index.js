import Vif from './vif'
import VifDOM from './vif-dom'

const smart = Vif.smart
const useAction = Vif.useAction
const useState = Vif.useState
const useUpdate = Vif.useUpdate
const useMount = Vif.useMount
const copyNode = Vif.copyNode
const render = VifDOM.render

export {
    smart,
    render,
    useState,
    useAction,
    useUpdate,
    useMount,
    copyNode
}

export default Vif
