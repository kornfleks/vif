
export function mountComponent(component) {
    const { mounts } = component.lifecycle
    if (!mounts) return;
    for (let i = 0; i < mounts.length; i++) {
        const mount = mounts[i];
        const unmount = mount({
            props: component.props,
            state: component.state
        })
        if (typeof unmount === 'function') {
            component.lifecycle.unmounts.push(unmount);
        }
    }
}

export function unmountComponent(component) {
    const { unmounts } = component.lifecycle
    if (!unmounts) return;
    for (let i = 0; i < unmounts.length; i++) {
        const unmount = unmounts[i];
        unmount({
            props: component.props,
            state: component.state
        })
    }
}

export function updateComponent(lastComponent, nextComponent) {
    const { updates } = nextComponent.lifecycle
    if (!updates) return;
    for (let i = 0; i < updates.length; i++) {
        const update = updates[i];
        update({
            lastProps: lastComponent.props,
            nextProps: nextComponent.props,
            lastState: lastComponent.state,
            nextState: nextComponent.state
        })
    }
}
