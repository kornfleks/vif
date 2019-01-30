import VifReconcilier from '../../vif-reconciler'

let queue = []
let pendingRequest = false

function handleQueue(deadline) {
    while(queue.length !== 0 && deadline.timeRemaining() > 1) {
        const {
            callback,
            args,
            cancel
        } = queue.shift()
        if (!cancel) {
            callback.apply(null, args)
        }
    }
    if (queue.length > 0) {
        requestIdleCallback(handleQueue)
    } else {
        pendingRequest = false
    }
}

function scheduleTask(callback) {
    const task = {
        callback,
        args: Array.prototype.slice.call(arguments, 1)
    }
    callback.apply(null, task.args);
    return;
    for (let i = 0; i < queue.length; i += 1) {
        const queuedTask = queue[i];
        if (queuedTask.callback === callback && callback === VifReconcilier.patch && queuedTask.args[0] === task.args[0]) {
            queuedTask.cancel = true;
        }
    }
    queue.push(task)

    if (!pendingRequest) {
        pendingRequest = true
        requestIdleCallback(handleQueue)
    }
}

export default {
    scheduleTask
}
