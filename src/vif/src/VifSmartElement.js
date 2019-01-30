import VifReconcilier from '../../vif-reconciler'
import VifScheduler from '../../vif-scheduler'
import { copy } from '../../vif-utils'
import VIF_HOOK_INTERNAL, { clearVifHookInternal } from './VifHookInternal'

function createStateUpdater(virtualNode) {
    function applyPartialState(partialState) {
        const nextState = copy(virtualNode.nextState)
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
            nextNode.nextState = nextState
            VifScheduler.scheduleTask(
                VifReconcilier.patch,
                virtualNode,
                nextNode,
                true
            )
        }
    }

    return function updateState(action) {
        const partialStateCandidate = action.apply(null, Array.prototype.slice.call(arguments, 1))

        function handlePartialState(partialState) {
            if (typeof partialState === 'function') {
                return updateState(partialState, virtualNode.props, virtualNode.nextState || virtualNode.state)
            }

            applyPartialState(partialState)
        }

        if (partialStateCandidate instanceof Promise) {
            return partialStateCandidate.then(handlePartialState);
        }

        handlePartialState(partialStateCandidate)
    }
}

export function wireSmartNode(virtualNode) {
    let finalName;
    const {
        state,
        lifecycle,
        isSmart,
        name
    } = virtualNode.name;

    if (isSmart) {
        const wiredActions = {}
        finalName = name(copy(virtualNode.props))
        const stateHooks = VIF_HOOK_INTERNAL.states;
        for (let i = 0; i < stateHooks.length; i += 1) {
            const { scope, data } = stateHooks[i];
            if (scope !== null) {
                state[scope] = data
            } else if (typeof data === 'object') {
                for (const key in data) {
                    state[key] = data[key]
                }
            }
        }
        const actionsHooks = VIF_HOOK_INTERNAL.actions
        const updateState = createStateUpdater(virtualNode)
        for (let i = 0; i < actionsHooks.length; i += 1) {
            const hook = actionsHooks[i];
            hook.dispatch = function() {
                updateState.apply(null, [hook.callback, ...arguments])
            }
        }
        virtualNode.actions = wiredActions;
    } else {
        finalName = name
    }

    if (typeof lifecycle === 'object') {
        virtualNode.lifecycle = {
            unmounts: VIF_HOOK_INTERNAL.unmounts.map(d => d),
            mounts: VIF_HOOK_INTERNAL.mounts.map(d => d),
            updates: VIF_HOOK_INTERNAL.updates.map(d => d)
        }
    }

    virtualNode.state = {}
    virtualNode.nextState = {}

    if (typeof state === 'object') {
        virtualNode.state = copy(state)
        virtualNode.nextState = copy(state)
    }

    virtualNode.name = finalName;
    virtualNode.isSmart = true;
    clearVifHookInternal(); 
}
