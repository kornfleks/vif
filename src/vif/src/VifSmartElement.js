import VifReconcilier from '../../vif-reconciler'
import { copy } from '../../vif-utils'

function createStateUpdater(virtualNode) {
    function applyPartialState(partialState) {
        const nextState = copy(virtualNode.state)
        let shouldPatch = false

        for (const key in partialState) {
            if (nextState[key] !== partialState[key]) {
                shouldPatch = true
            }
            nextState[key] = partialState[key]
        }

        if (shouldPatch) {
            const nextNode = copy(virtualNode)
            nextNode.state = nextState

            VifReconcilier.patch(virtualNode, nextNode, true)
        }
    }

    return function updateState(action) {
        const partialState = action.apply(null, Array.prototype.slice.call(arguments, 1))

        if (partialState instanceof Promise) {
            return partialState.then(applyPartialState);
        }

        if (typeof partialState === 'function') {
            return updateState(partialState, virtualNode.props, virtualNode.state)
        }

        applyPartialState(partialState)
    }
}

export function wireSmartNode(virtualNode) {
    let finalName;
    const {
        isSmart,
        actions,
        state,
        lifecycles,
        name
    } = virtualNode.name;

    if (isSmart) {
        const wiredActions = {}
        const updateState = createStateUpdater(virtualNode)
        for (const key in actions) {
            wiredActions[key] = function() {
                updateState.apply(null, [actions[key], ...arguments])
            }
        }
        finalName = name(wiredActions)
    } else {
        finalName = name
    }

    if (typeof lifecycles === 'object') {
        virtualNode.lifecycles = lifecycles
    }

    virtualNode.state = {}

    if (typeof state === 'function') {
        virtualNode.state = state(virtualNode.props)
    } else if (typeof state === 'object') {
        virtualNode.state = copy(state)
    }

    virtualNode.name = finalName;
    virtualNode.isSmart = true;
}
