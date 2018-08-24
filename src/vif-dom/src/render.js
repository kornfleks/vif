import { render as renderEffect } from './Effects'
import VifScheduler from '../../vif-scheduler'

export default function render(node, container) {
    VifScheduler.scheduleTask(
        renderEffect,
        node,
        container
    )
}