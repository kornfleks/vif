
export function mountComponent(component) {
    const { onMount } = component.lifecycle
    if (onMount) {
        onMount({
            props: component.props,
            state: component.state
        })
    }
}

export function unmountComponent(component) {
    const { onUnmount } = component.lifecycle
    if (onUnmount) {
        onUnmount({
            props: component.props,
            state: component.state
        })
    }
}

export function updateComponent(lastComponent, nextComponent) {
    const { onUpdate } = nextComponent.lifecycle
    if (onUpdate) {
        onUpdate({
            lastProps: lastComponent.props,
            nextProps: nextComponent.props,
            lastState: lastComponent.state,
            nextState: nextComponent.state
        })
    }
}
