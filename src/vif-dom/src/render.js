import { render as renderEffect } from './Effects'
import VifScheduler from '../../vif-scheduler'

export default function render(node, container) {
    console.log('intiial', node)
    VifScheduler.scheduleTask(
        renderEffect,
        node,
        container
    )
}