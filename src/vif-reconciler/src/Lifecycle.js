
export function mountComponent(component) {
    const { onMount } = component.lifecycles
    if (onMount) {
        onMount(component.props)
    }
}

export function unmountComponent(component) {
    const { onUnmount } = component.lifecycles
    if (onUnmount) {
        onUnmount(component.props)
    }
}

export function updateComponent(lastComponent, nextComponent) {
    const { onUpdate } = nextComponent.lifecycles
    if (onUpdate) {
        onUpdate(
            lastComponent.props,
            nextComponent.props,
            lastComponent.state,
            nextComponent.state
        )
    }
}
