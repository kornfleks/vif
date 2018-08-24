import Vif from '../../vif'
import VifScheduler from '../../vif-scheduler'
import {
    getDiffObject,
    areNodeEquals,
    copy
} from '../../vif-utils'
import {
    unmountComponent,
    updateComponent,
    mountComponent
} from './Lifecycle'

let effects

export function setEffects(clientEffects) {
    effects = clientEffects
}

function removeChildren(node) {
    for (let i = 0; i < node.children.length; i++) {
        if (node.children[i]) {
            removeChildren(node.children[i])
        }
    }
    unmountComponent(node)
}

function createChild(node, container, nextElement) {
    if (node.isGhost) {
        return
    }
    if (node.isComponent) {
        const childProp = Vif.Children.getChildrenProp(node._props.children, node._children)
        const props = copy(node.props)
        props.children = childProp

        const child = node.name(props, node.state)
        const children = [child]

        Vif.Children.applyChildren(children)

        node.children = children
        node._ref = createChild(
            child,
            container,
            nextElement,
            true
        )
        mountComponent(node)
    } else {
        node._ref = effects.create(node)
        VifScheduler.scheduleTask(
            effects.render,
            node,
            container,
            false,
            nextElement,
            node._ref
        )
    }

    return node._ref
}

function patchChildren(lastNode, nextNode, element, previousElement) {
    const lastChildren = lastNode.children
    const nextChildren = nextNode.children
    const lastKeys = {}
    const nextKeys = {}
    let shouldReorder = false

    for (let i = 0; i < lastChildren.length; i++) {
        const lastChild = lastChildren[i]
        lastKeys[lastChild.key] = lastChild
    }

    let lastChildElement = previousElement
    for (let i = nextChildren.length - 1; i > -1; i--) {
        const nextChild = nextChildren[i]
        const lastChild = lastKeys[nextChild.key]
        const {
            isGhost,
            isComponent
        } = nextChild

        if (lastChildren[i] && nextChild.key !== lastChildren[i].key) {
            shouldReorder = true
        }

        if (lastChild && lastChild._ref) {
            if (!isGhost) {
                nextKeys[nextChild.key] = nextChild
                patch(
                    lastChild,
                    nextChild
                )
            }

            if (shouldReorder) {
                if (lastChildElement) {
                    VifScheduler.scheduleTask(
                        effects.insert,
                        lastChild._ref,
                        lastChildElement,
                    )
                } else if (previousElement) {
                    VifScheduler.scheduleTask(
                        effects.insert,
                        lastChild._ref,
                        previousElement,
                    )
                } else {
                    VifScheduler.scheduleTask(
                        effects.append,
                        element,
                        lastChild._ref
                    )
                }
            }

            if (!isGhost) {
                lastChildElement = lastChild._ref
            }
        } else if (!isGhost) {
            nextKeys[nextChild.key] = nextChild
            const siliblingElement = (i !== nextChildren.length - 1) && lastChildElement
                ? lastChildElement
                : previousElement

            const newElement = createChild(
                nextChild,
                element,
                siliblingElement
            )
            lastChildElement = newElement
        } else {
            nextKeys[nextChild.key] = nextChild
            lastChildElement = patchChildren(
                lastChild,
                nextChild,
                element,
                lastChildElement
            )
        }
    }

    for (let i = 0; i < lastChildren.length; i++) {
        const lastChild = lastChildren[i]
        if (!nextKeys[lastChild.key] && !lastChild.isGhost && !lastChild.isComponent) {
            removeChildren(lastChild)
            const parent = lastNode._ref || element
            VifScheduler.scheduleTask(
                effects.remove,
                parent,
                lastChild._ref
            )
        }
    }
    return lastChildElement
}

export default function patch(lastNode, nextNode, forced) {
    nextNode._ref = lastNode._ref
    const lastProps = lastNode.props
    const nextProps = nextNode.props

    if (nextNode.isComponent) {
        if (!forced) {
            nextNode.state = lastNode.state
            if (areNodeEquals(lastNode, nextNode)) {
                nextNode.children[0] = lastNode.children[0]
                return;
            }
        }

        const childProp = Vif.Children.getChildrenProp(
            nextNode._props.children,
            nextNode._children
        )
        const props = { ...nextNode.props, children: childProp }
        const child = nextNode.name(props, nextNode.state)
        const children = [child]

        Vif.Children.applyChildren(children, null)
        nextNode.children = children
        patch(
            lastNode.children[0],
            nextNode.children[0],
            false
        )
        updateComponent(lastNode, nextNode)
    } else {
        const element = lastNode._ref
        if (lastNode.isText !== nextNode.isText) {
            nextNode._ref = createChild(
                nextNode,
                element.parentElement,
                element.nextSibling
            );
            VifScheduler.scheduleTask(
                effects.remove,
                element.parentElement,
                element
            )
        } else if (nextNode.isText && element.textContent !== nextNode.value) {
            VifScheduler.scheduleTask(
                effects.setTextContent,
                element,
                nextNode.value
            )
            return;
        } else {
            for (const propKey in getDiffObject(lastProps, nextProps)) {
                const lastValue = lastProps[propKey]
                const nextValue = nextProps[propKey]
                if (lastValue !== nextValue) {
                    VifScheduler.scheduleTask(
                        effects.updateAttribute,
                        element,
                        propKey,
                        lastValue,
                        nextValue
                    )
                }
            }
            patchChildren(
                lastNode,
                nextNode,
                lastNode._ref
            )
        }
    }

    function transferProperties() {
        for (const key in nextNode) {
            lastNode[key] = nextNode[key]
        }
    }

    VifScheduler.scheduleTask(transferProperties)

}
