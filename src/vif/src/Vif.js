import { createElement } from './VifElement'
import smart from './smart'
import * as Children from './VifChildren'
import { useState, useAction, useUnmount, useUpdate, useMount } from './Hooks';
import copyNode from './copyNode'

const Vif = {
    smart,
    createElement,
    Children,
    useState,
    useAction,
    useUnmount,
    useUpdate,
    useMount,
    copyNode
}

export {
    smart,
    createElement,
    Children,
    useState,
    useAction,
    useUnmount,
    useUpdate,
    useMount,
    copyNode
}

export default Vif
