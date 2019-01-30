
const VIF_HOOK_INTERNAL = {
  unmounts: [],
  states: [],
  actions: [],
  updates: [],
  mounts: []
}

export function clearVifHookInternal() {
  VIF_HOOK_INTERNAL.unmounts = [];
  VIF_HOOK_INTERNAL.states = [];
  VIF_HOOK_INTERNAL.actions = [];
  VIF_HOOK_INTERNAL.updates = [];
  VIF_HOOK_INTERNAL.mounts = []
} 

export default VIF_HOOK_INTERNAL;