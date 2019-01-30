import { isFalsyNode, copy } from '../../vif-utils'
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
        } else if (typeof child === 'function') {
            
        } else {
            children[i] = applyChild(
                children[i],
                `__vif-${i}`
            )
        }
    }
    return children
}

function getChildrenProp(node) {
    if (node.children.length > 0) return node.children
    if (node.props.children instanceof Array) return node.props.children
    return []
}


export function getComponentChildren(node) {
    const childProp = getChildrenProp(node)
    const props = copy(node.props)
    props.children = childProp
                
    for (const propKey in props) {
        if (props[propKey] && props[propKey].__vif) {
            props[propKey] = copy(props[propKey])
        }
    }
    
    const child = node.name(props, node.state)
    return node.children = applyChildren([child])
}
