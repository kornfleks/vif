import VIF_HOOK_INTERNAL from './VifHookInternal';

function getScopedArgs(args) {
  const argsLength = args.length;
  let data = null;
  let scope = null;
  if (argsLength === 1) {
    data = args[0];
  } else if (argsLength === 2) {
    scope = args[0];
    data = args[1];
  } else {
    // todo throw error
  }
  return { scope, data }
}

export function useState() {
  const hook = getScopedArgs(arguments);
  VIF_HOOK_INTERNAL.states.push(hook);
}

export function useAction() {
  const {
    scope,
    data
  } = getScopedArgs(arguments);
  const hook = {
    callback: data,
    args: scope,
    dispatch: undefined, 
    action: function() {
      if (hook.dispatch === undefined) {
        throw 'Can not call action before mount';
      } else {
        hook.dispatch.apply(null, arguments);
      }
    }
  }
  VIF_HOOK_INTERNAL.actions.push(hook);
  return hook.action;
}

export function useUpdate(callback) {
  VIF_HOOK_INTERNAL.updates.push(callback);
}

export function useUnmount(callback) {
  VIF_HOOK_INTERNAL.unmounts.push(callback);
}

export function useMount(callback) {
  VIF_HOOK_INTERNAL.mounts.push(callback);
}