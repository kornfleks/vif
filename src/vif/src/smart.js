
export default function smart(options) {
    const {
        lifecycles,
        actions,
        state
    } = options;

    return function(Component) {
        return {
            isSmart: typeof actions === 'object',
            name: Component,
            lifecycles,
            actions,
            state
        }
    }
}
