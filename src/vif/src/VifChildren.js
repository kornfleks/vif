import { isFalsyNode } from '../../vif-utils'
import createVirtualNode from './createVirtualNode'

function applyChild(child, key) {
    let partialChild = {
        props: {},
        key
    }

    if (isFalsyNode(child)) {
        partialChild.isGhost = true
    } else if (child instanceof Array) {
        partialChild.isGhost = true
        partialChild.children = child
    } else if (typeof child === 'object') {
        child.key = child.key || key
        return child
    } else {
        partialChild.isText = true
        partialChild.value = '' + child
    }
    child = child || {}

    return createVirtualNode(child.name, {}, partialChild)
}

export function applyChildren(children) {
    for (let i = 0; i < children.length; i++) {
        if (children[i] instanceof Array) {
            children[i] = applyChild(
                applyChildren(children[i]),
                `__vif-${i}`
            )
        } else {
            children[i] = applyChild(
                children[i],
                `__vif-${i}`
            )
        }
    }
    return children
}

export function getChildrenProp(childrenProps, children) {
    if (children.length > 0) return children
    if (childrenProps) return childrenProps
    return []
}
