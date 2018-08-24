
export function mountComponent(component) {
    const { onMount } = component.lifecycles
    if (onMount) {
        onMount({
            props: component.props,
            state: component.state
        })
    }
}

export function unmountComponent(component) {
    const { onUnmount } = component.lifecycles
    if (onUnmount) {
        onUnmount({
            props: component.props,
            state: component.state
        })
    }
}

export function updateComponent(lastComponent, nextComponent) {
    const { onUpdate } = nextComponent.lifecycles
    if (onUpdate) {
        onUpdate({
            lastProps: lastComponent.props,
            nextProps: nextComponent.props,
            lastState: lastComponent.state,
            nextState: nextComponent.state
        })
    }
}
