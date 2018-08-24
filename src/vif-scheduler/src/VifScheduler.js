const queue = []
let pendingRequest = false

function handleQueue(deadline) {
    while(queue.length !== 0 && deadline.timeRemaining() > 1) {
        const {
            callback,
            args
        } = queue.shift()
        callback.apply(null, args)
    }
    if (queue.length > 0) {
        requestIdleCallback(handleQueue)
    } else {
        pendingRequest = false
    }
}

function scheduleTask(callback) {
    queue.push({
        callback,
        args: Array.prototype.slice.call(arguments, 1)
    })

    if (!pendingRequest) {
        pendingRequest = true
        requestIdleCallback(handleQueue)
    }
}

export default {
    scheduleTask
}
