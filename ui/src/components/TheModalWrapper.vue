<template>
  <Transition :duration="modalProperties.instant ? 0 : 300" name="default-transition">
    <template v-if="isModalOpen">
      <div class="modal-wrapper">
        <div class="modal-wrapper-backdrop" @click="closeModal(ModalCloseReason.OVERLAY)" />
        <div class="modal-wrapper-content">
          <SvgIcon
            v-if="modalProperties.canBeClosed"
            :size="20"
            class="absolute top-0 right-0 z-[1] box-content p-4"
            name="ui/close"
            tag="button"
            @click="closeModal(ModalCloseReason.CROSS)"
          />
          <Component :is="component" v-bind="properties" />
        </div>
      </div>
    </template>
  </Transition>
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/ui/icons/SvgIcon.vue'
import { ModalCloseReason, useModal } from '@/stores/modal'
import { storeToRefs } from 'pinia'

const modal = useModal()
const { isModalOpen, component, modalProperties, properties } = storeToRefs(modal)

const closeModal = (source: ModalCloseReason) => {
  if (modalProperties.value.canBeClosed) {
    modal.internalClose(source)
  }
}
</script>

<style scoped>
@reference '@/assets/style/style.css'

.flex {
  display: flex;
}

.modal-wrapper {
  @apply fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden;

  .modal-wrapper-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background-color: var(--color-main-black-bg);
  }

  .modal-wrapper-content {
    position: relative;
    max-width: 80vw;
    width: fit-content;
    max-height: 80vh;
    background-color: var(--color-main-modal-bg);
    border-radius: 16px;
  }
}

.default-transition-enter-active .modal-wrapper-content {
  transform: scale(1);
  opacity: 1;
  transition: transform 300ms linear;
}

.default-transition-enter-from .modal-wrapper-content {
  transform: scale(0);
  opacity: 0;
}

.default-transition-leave-from,
.default-transition-leave-to {
  transform: scale(0);
  transition: all 0s linear;
}
</style>
