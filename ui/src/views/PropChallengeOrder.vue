<template>
  <div
    id="order-section"
    class="mx-auto flex w-(--container) scroll-mt-(--header-scroll-mt) items-start gap-5"
  >
    <div class="border-stroke bg-main-black-bg flex flex-1 flex-col gap-10 rounded-3xl border p-10">
      <div class="flex gap-4">
        <div class="text-28-semibold">1.</div>
        <div class="flex-1">
          <h2 class="text-28-semibold mb-1">Choose challenge phases</h2>
          <div class="text-main-secondary mb-6">
            Select how many demo phases you want to complete before trading real funds.
          </div>
          <div class="flex gap-2">
            <div class="card relative flex flex-1 items-center gap-3">
              <SvgIcon :size="28" class="w-5" color="native" name="ui/flash-1" />
              <div>
                <div class="text-16-semibold mb-0.5">Two Phases</div>
                <div class="text-14-regular text-main-secondary">Low Risk</div>
              </div>
              <div
                class="bg-main-strong-bg/10 absolute inset-0 flex items-center justify-center rounded-2xl border border-transparent backdrop-blur-xs"
              >
                <SvgIcon :size="24" name="ui/lock-icon" />
              </div>
            </div>
            <div class="card card--active flex flex-1 items-center gap-3">
              <SvgIcon :size="28" class="w-8" color="native" name="ui/flash-2" />
              <div>
                <div class="text-16-semibold mb-0.5">One Phase</div>
                <div class="text-14-regular text-main-secondary">Medium Risk</div>
              </div>
            </div>
            <div class="card relative flex flex-1 items-center gap-3">
              <SvgIcon :size="28" class="w-10.5" color="native" name="ui/flash-3" />
              <div>
                <div class="text-16-semibold mb-0.5">Instant Funding</div>
                <div class="text-14-regular text-main-secondary">High Risk</div>
              </div>
              <div
                class="bg-main-strong-bg/10 absolute inset-0 flex items-center justify-center rounded-2xl border border-transparent backdrop-blur-xs"
              >
                <SvgIcon :size="24" name="ui/lock-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-4">
        <div class="text-28-semibold">2.</div>
        <div class="flex-1">
          <h2 class="text-28-semibold mb-1">Select starting balance</h2>
          <div class="text-main-secondary mb-6">
            Choose your demo capital — it defines the scale of your challenge.
          </div>
          <BalanceSlider @change="(v) => (toPay = v)" />
        </div>
      </div>

      <div class="flex gap-4">
        <div class="text-28-semibold">3.</div>
        <div class="flex-1">
          <h2 class="text-28-semibold mb-11">Challenge details for your setup</h2>

          <div class="cards flex w-full gap-2">
            <div class="card flex-10 p-4 pt-10">
              <div class="text-20-semibold text-center">$100,000</div>
              <div class="text-14-semibold text-main-secondary mb-7 text-center">
                Mifunder Evaluation
              </div>
              <div class="item">Initial Leverage</div>
              <div class="item">Trading Period</div>
              <div class="item">Min Trading Days</div>
              <div class="item">Max Daily Loss</div>
              <div class="item">Max Loss</div>
              <div class="item">Profit Target</div>
              <div class="item">Profit Split</div>
              <div class="item">Fee</div>
            </div>

            <div class="card relative flex-8 p-4 pt-10 text-center">
              <div
                class="bg-accent-blue border-main-black-bg absolute top-0 left-1/2 -translate-1/2 rounded-full border-8 p-2.5"
              >
                <SvgIcon :size="20" class="flex" name="ui/phase1" />
              </div>
              <div class="text-20-semibold">Phase 1</div>
              <div class="text-14-semibold text-main-secondary mb-7">Challenge</div>
              <div class="item">1:100</div>
              <div class="item">Unlimited</div>
              <div class="item">No Minimum</div>
              <div class="item">$5,000 (5%)</div>
              <div class="item">$10,000 (10%)</div>
              <div class="item">$8,000 (8%)</div>
              <div class="item">
                <SvgIcon :size="16" class="text-main-secondary" name="ui/prohibition" />
              </div>
              <div class="item">$100</div>
            </div>

            <div class="card glow-1 relative flex-8 p-4 pt-10 text-center">
              <div
                class="bg-accent-blue border-main-black-bg absolute top-0 left-1/2 -translate-1/2 rounded-full border-8 p-2.5"
              >
                <SvgIcon :size="20" class="flex" name="ui/cup" />
              </div>
              <div class="text-20-semibold">Funded</div>
              <div class="text-14-semibold text-main-secondary mb-7">Live Account</div>
              <div class="item">1:100</div>
              <div class="item">Unlimited</div>
              <div class="item">No Minimum</div>
              <div class="item">$5,000 (5%)</div>
              <div class="item">$10,000 (10%)</div>
              <div class="item">$8,000 (8%)</div>
              <div class="item">80%</div>
              <div class="item">
                <SvgIcon :size="16" class="text-main-secondary" name="ui/prohibition" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card card--active w-[397px] items-center p-6">
      <div class="mb-1 flex justify-between">
        <div class="text-16-semibold">To pay</div>
        <UiNum class="text-18-semibold" prefix="$">{{ toPay }}</UiNum>
      </div>
      <div class="item text-14-regular flex items-center justify-between">
        <div class="text-main-secondary">Discount</div>
        <div class="text-accent-green">–$25.00</div>
      </div>
      <div class="mb-6 flex items-center justify-between">
        <div class="text-20-semibold">Total</div>
        <UiNum class="text-18-semibold" prefix="$">{{ toPay - 25 }}</UiNum>
      </div>
      <UiButton class="w-full" end-icon="ui/arrow-right-02" @click="gotoProp">Get funded</UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BalanceSlider from '@/components/ui/BalanceSlider.vue'
import SvgIcon from '@/components/ui/icons/SvgIcon.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiNum from '@/components/ui/UiNum.vue'
import useWallet from '@/composables/useWallet.ts'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { isConnected, showModal } = useWallet()
const router = useRouter()
const toPay = ref(0)

async function gotoProp() {
  if (isConnected.value || (await showModal())) {
    router.push({ name: 'propTerminal' })
  }
}
</script>

<style scoped>
.cards > :first-child .item::after {
  background-image: linear-gradient(90deg, rgb(255 255 255 / 10%) 0%, rgb(255 255 255 / 1%) 100%);
}

.item:not(:last-child) {
  position: relative;
  margin-bottom: 16px;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    display: block;
    width: 100%;
    height: 1px;
    background-image: linear-gradient(
      90deg,
      rgb(255 255 255 / 1%) 0%,
      rgb(255 255 255 / 10%) 50%,
      rgb(255 255 255 / 1%) 100%
    );
  }
}
</style>
