import { applyChildren } from './VifChildren'
import { wireSmartNode } from './VifSmartElement'
import createVirtualNode from './createVirtualNode'
import { copy } from '../../vif-utils'

export function createElement(name, props) {
    props = props || {}
    let children = Array(arguments.length - 2)

    for (let i = 2; i < arguments.length; i += 1) {
        children[i - 2] = arguments[i]
    }
    const virtualNode = createVirtualNode(
        name,
        props,
        {},
        copy(props),
        copy(children)
    )

    for (const propKey in props) {
        if (propKey !== 'key') {
            virtualNode.props[propKey] = props[propKey]
        }
    }

    if (typeof name === 'function') {
        virtualNode.isOpen = children.length > 0
        virtualNode.isComponent = true
    } else if (typeof name === 'object') {
        wireSmartNode(virtualNode)
        virtualNode.isOpen = children.length > 0
        virtualNode.isComponent = true
    }

    applyChildren(children, null)
    virtualNode.children = children

    return virtualNode
}