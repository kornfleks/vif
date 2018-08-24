
export default function createVirtualNode(name, props, partial, _props, _children) {
    return {
        name,
        key: props.key,
        props: {},
        children: [],
        isGhost: false,
        isOpen: false,
        isText: false,
        lifecycles: {},
        _children,
        _props,
        ...partial
    }
}
