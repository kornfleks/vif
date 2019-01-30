
export default function smart(Component) {
    return {
        isSmart: true,
        name: Component,
        lifecycle: {
            unmounts: [],
            updates: []
        },
        actions: {},
        state: {}
    }
}

