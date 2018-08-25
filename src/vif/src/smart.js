
export default function smart(options) {
    const {
        lifecycle,
        actions,
        state
    } = options;

    return function(Component) {
        return {
            isSmart: typeof actions === 'object',
            name: Component,
            lifecycle,
            actions,
            state
        }
    }
}
