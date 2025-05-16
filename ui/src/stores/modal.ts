import asleep from '@/utils/asleep'
import Deferred from '@/utils/deferred'
import typedAssign from '@/utils/typedAssign'
import { defineStore } from 'pinia'
import { type Component, markRaw, reactive, toRefs } from 'vue'

interface Modal {
  isModalOpen: boolean
  component: Component
  properties: Record<string, unknown>
  modalProperties: ModalProperties
}

interface ModalProperties {
  canBeClosed?: boolean
  fixed?: boolean // cannot be overlapped till closed
  instant?: boolean // skip open animation
}

const defaultState: Modal = {
  isModalOpen: false,
  component: {},
  properties: {},
  modalProperties: {
    canBeClosed: true,
  },
}

export const enum ModalCloseReason {
  CODE = 'code', // from code
  OVERLAY = 'overlay', // click to overlay
  CROSS = 'cross', // click to cross
  OVERLAP = 'overlap', // another modal was opened
  NAVIGATION = 'navigation', // route changed
  BACK = 'back', // back button pressed
}

export interface ModalResolveData<T = unknown> {
  reason: ModalCloseReason
  detail?: T
}

let modalDeferred: null | Deferred<ModalResolveData> = null

export const useModal = defineStore('modal', () => {
  const state = reactive({ ...defaultState })

  async function open<R = unknown, T extends object = object>(
    component: Component<T>,
    properties?: Partial<T> /* Partial is workaround for VLS ExtractPropTypes */,
    modalProperties: ModalProperties = {},
  ) {
    while (
      state.isModalOpen &&
      state.modalProperties.fixed &&
      modalDeferred &&
      modalDeferred.status === 'pending'
    ) {
      await modalDeferred.promise // don't overlap fixed modals
    }
    internalClose(ModalCloseReason.OVERLAP)

    modalDeferred = new Deferred()
    state.isModalOpen = true
    state.properties = properties || {}
    state.component = markRaw(component)
    state.modalProperties = Object.assign({}, defaultState.modalProperties, modalProperties)
    return modalDeferred.promise as Promise<ModalResolveData<R>>
  }

  function close(detail?: unknown) {
    return internalClose(ModalCloseReason.CODE, detail)
  }

  function internalClose(reason: ModalCloseReason, detail?: unknown) {
    if (modalDeferred && modalDeferred.status === 'pending') {
      modalDeferred.resolve({ reason, detail })
    }
    if (state.isModalOpen) {
      typedAssign(state, { isModalOpen: false })
    }

    return asleep(0) // gives time for closing callback (on resolve)
  }

  return { open, close, internalClose, ...toRefs(state) }
})
