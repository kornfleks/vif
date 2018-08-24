
export const NODE_EFFECTS = {
    insert: 'insert',
    append: 'append',
    render: 'render',
    setText: 'setText',
    updateAttribute: 'updateAttribute',
    remove: 'remove'
}

export function copy(object) {
    if (object instanceof Array) {
        return object.slice()
    }
    const newObject = {}
    for (const key in object) {
        newObject[key] = object[key]
    }
    return newObject
}

export function isFalsyNode(node) {
    return node === null || node === undefined || node === false || node === '' || node === true
}

export function arePropsEquals(props1, props2, checkChildren) {
    for (const key in props1) {
        if (key === 'children' && checkChildren) {
            const node1Children = props1.children
            const node2Children = props2.children
            for (let i = 0; i < node2Children.length; i++) {
                if (typeof node1Children[i] === 'object') {
                    if (!areNodeEquals(node1Children[i], node2Children[i])) {
                        return false;
                    }
                } else  {
                    if (node1Children[i] !== node2Children[i]) {
                        return false
                    }
                }
            }
        } else if (props1[key] !== props2[key]) {
            return false;
        }
    }
    return true;
}

export function areNodeEquals(node1, node2) {
    if (node1.isGhost !== node2.isGhost || node1.isText !== node2.isText) {
        return false
    }

    if (node2.isText) {
        return node1.value === node2.value
    }
    const props1 = node1.props
    const props2 = node2.props

    const { isOpen } = node2
    if (!arePropsEquals(props1, props2, isOpen)) {
        return false;
    } else if (!arePropsEquals(props2, props1, isOpen)) {
        return false;
    } else if (!isOpen) {
        return arePropsEquals({ children: node1.children }, { children: node2.children }, true)
    }
    return true;
}

export function getDiffObject(object1, object2) {
    const diffObject = {}

    if (typeof object1 === 'object') {
        for (const key in object1) {
            diffObject[key] = false
        }
    }

    if (typeof object2 === 'object') {
        for (const key in object2) {
            diffObject[key] = true
        }
    }

    return diffObject
}