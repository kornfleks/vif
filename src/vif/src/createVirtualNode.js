
export default function createVirtualNode(name, props, partial) {
    return {
        name,
        key: props.key,
        props: {},
        children: [],
        isGhost: false,
        isOpen: false,
        isText: false,
        lifecycle: {},
        __vif: true,
        ...partial
    }
}
