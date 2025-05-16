<template>
  <div class="card2">
    <div class="mb-4 flex items-center justify-between">
      <div class="text-20-semibold">Challenge Progress</div>
      <TabsComponent v-model="period" theme="ghost">
        <TabItem tab-key="day">Day</TabItem>
        <TabItem tab-key="week">Week</TabItem>
        <TabItem tab-key="month">Month</TabItem>
        <TabItem tab-key="year">Year</TabItem>
        <TabItem tab-key="all">All</TabItem>
      </TabsComponent>
    </div>
    <VueApexCharts :options="options" :series="series" height="85%" type="area" />
  </div>
</template>

<script lang="ts" setup>
import TabItem from '@/components/ui/tabs/TabItem.vue'
import TabsComponent from '@/components/ui/tabs/TabsComponent.vue'
import type { ApexOptions } from 'apexcharts'
import { computed, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const period = ref<'day' | 'week' | 'month' | 'year' | 'all'>('all')

const options = computed<ApexOptions>(() => ({
  chart: {
    toolbar: {
      show: false,
    },
    zoom: { enabled: false },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: '#868c9b',
        fontSize: '12px',
      },
    },
  },
  yaxis: {
    min: 90000,
    max: 108000,
    tickAmount: 9,
    labels: {
      formatter: (value: number) => '$' + (value / 1000).toFixed(0) + 'k',
      style: {
        colors: '#868c9b',
        fontSize: '12px',
      },
    },
  },
  grid: {
    show: true,
    borderColor: '#31333a',
    padding: {
      top: 30,
      right: 0,
      bottom: 0,
      left: 20,
    },
  },
  annotations: {
    yaxis: [
      {
        y: 108000,
        borderColor: '#20644ccc',
        strokeDashArray: 2,
        label: {
          borderColor: '#20644ccc',
          style: {
            color: '#dcfef2',
            background: '#103226',
          },
          text: 'Profit Target',
        },
      },
      {
        y: 100000,
        borderColor: '#203864cc',
        strokeDashArray: 2,
        label: {
          borderColor: '#203864cc',
          style: {
            color: '#dce8fe',
            background: '#101c32',
          },
          text: 'Initial Balance',
        },
      },
      {
        y: 90000,
        borderColor: '#64203acc',
        strokeDashArray: 2,
        label: {
          borderColor: '#64203acc',
          style: {
            color: '#fedce9',
            background: '#32101d',
          },
          text: 'Max Loss',
        },
      },
    ],
  },
  stroke: {
    width: 2,
    curve: 'straight',
  },
  markers: {
    size: 0,
  },
  tooltip: {
    theme: 'dark',
    enabled: true,
    y: {
      formatter: (value: number) => '$' + value.toLocaleString(),
    },
  },
}))

const series = computed<ApexOptions['series']>(() => [
  {
    name: 'Balance',
    color: '#fff',
    type: 'area',
    data: Array(140)
      .fill(null)
      .map((_, i) => [(i + 1) / 10, 95000 + Math.random() * 10000]),
  },
])
</script>
