import { ModalCloseReason, useModal } from '@/stores/modal.ts'
import DashboardPage from '@/views/DashboardPage.vue'
import EarnPage from '@/views/EarnPage.vue'
import PortalPropPage from '@/views/PortalPropPage.vue'
import PropTerminalPage from '@/views/PropTerminalPage.vue'
import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

let previousStatePosition = 0
let isTriggeredByBackButton = false

function watchBackButtonClick() {
  if (history.state?.position != undefined) {
    isTriggeredByBackButton = history.state.position < previousStatePosition
    previousStatePosition = history.state.position
  }
}

window.addEventListener('popstate', watchBackButtonClick)

const routes = [
  { path: '/dashboard', component: DashboardPage, name: 'dashboard' },
  { path: '/earn', component: EarnPage, name: 'earn' },
  { path: '/portal/prop', component: PortalPropPage, name: 'portalProp' },
  { path: '/prop/:symbol?', alias: '/', component: PropTerminalPage, name: 'propTerminal' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeResolve(async () => {
  return isModalGuardPassed()
})

function isModalGuardPassed(): boolean {
  const { isModalOpen } = useModal()
  if (isModalOpen) {
    const modalCloseReason = isTriggeredByBackButton
      ? ModalCloseReason.BACK
      : ModalCloseReason.NAVIGATION
    useModal().internalClose(modalCloseReason)
    return !isTriggeredByBackButton
  }
  return true
}

function dropBackButtonFlag() {
  if (history.state?.position) {
    previousStatePosition = history.state.position
  }
  nextTick(() => (isTriggeredByBackButton = false))
}

router.afterEach(dropBackButtonFlag)

export default router
