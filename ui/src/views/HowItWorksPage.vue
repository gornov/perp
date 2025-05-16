<template>
  <div class="mx-auto w-(--container)">
    <div class="mb-[150px] max-w-[774px]">
      <h1 class="text-40-semibold">How it Works</h1>
      <div class="text-22-regular text-main-secondary mb-6">
        We give you a demo prop trading account to prove your skills in our 1-Phase Evaluation.
        After successfully completing the Evaluation, you get funded and start earning real money.
      </div>
      <a href="#order-section">
        <UiButton end-icon="ui/arrow-right-02" size="L">Start new challenge</UiButton>
      </a>
    </div>
    <div class="relative flex gap-5">
      <svg
        class="absolute -top-[364px] -left-[161px] pointer-events-none"
        fill="none"
        height="394"
        viewBox="0 0 1542 394"
        width="1542"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1238.5 141C1427 119 1434.5 25.5 1541.5 1" stroke="#518DF9" stroke-width="2" />
        <path
          d="M312.5 341C172.5 323 137 402.501 1 392.001M404.5 341C543 325.001 526 216.501 729.5 241"
          stroke="#518DF9"
          stroke-width="2"
        />
        <path
          d="M821.5 241C941.5 229.501 943 123.999 1146.5 141"
          stroke="#518DF9"
          stroke-width="2"
        />
      </svg>
      <div class="relative flex flex-col items-center text-center">
        <UiPicture :img-data="c1" alt="" />
        <div class="absolute inset-0 p-6">
          <div
            class="bg-accent-blue text-20-semibold absolute -top-[20px] left-1/2 flex size-15 -translate-1/2 items-center justify-center rounded-full"
          >
            01
          </div>
          <UiPicture :img-data="trophy" alt="" class="mt-2.5" />
          <div class="text-28-semibold mb-1">Join the Challenge</div>
          <div class="text-main-secondary">
            Start with a demo balance. Pay the entry fee and begin your journey to funded trading
          </div>
        </div>
      </div>

      <div class="relative -top-[100px] flex flex-col items-center text-center">
        <UiPicture :img-data="c2" alt="" />
        <div class="absolute inset-0 p-6">
          <div
            class="bg-accent-blue text-20-semibold absolute -top-[20px] left-1/2 flex size-15 -translate-1/2 items-center justify-center rounded-full"
          >
            02
          </div>
          <UiPicture :img-data="candles" alt="" class="mt-2.5" />
          <div class="text-28-semibold mb-1">Prove Your Skills</div>
          <div class="text-main-secondary">
            Hit the profit target within the set time. Follow risk rules and show consistent
            performance
          </div>
        </div>
      </div>

      <div class="relative -top-[200px] flex flex-col items-center text-center">
        <UiPicture :img-data="c3" alt="" />
        <div class="absolute inset-0 p-6">
          <div
            class="bg-accent-blue text-20-semibold absolute -top-[20px] left-1/2 flex size-15 -translate-1/2 items-center justify-center rounded-full"
          >
            03
          </div>
          <UiPicture :img-data="coins" alt="" class="mt-2.5" />
          <div class="text-28-semibold mb-1">Get Funded</div>
          <div class="text-main-secondary">
            Pass the challenge to unlock real trading and earn without risking your own funds
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import candles from '@/assets/img-src/candles.png?w=240&as=picture'
import coins from '@/assets/img-src/coins.png?w=240&as=picture'
import c1 from '@/assets/img-src/hiw-card-bg-1.png?w=397&as=picture'
import c2 from '@/assets/img-src/hiw-card-bg-2.png?w=397&as=picture'
import c3 from '@/assets/img-src/hiw-card-bg-3.png?w=397&as=picture'
import trophy from '@/assets/img-src/trophy.png?w=240&as=picture'
import UiButton from '@/components/ui/UiButton.vue'

import UiPicture from '@/components/ui/UiPicture.vue'
</script>
