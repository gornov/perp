import useUserStore from '@/stores/user.ts'
import formatNum from '@/utils/formatNum.ts'
import { computed } from 'vue'

export default function useStatistics() {
  const u = useUserStore()
  const statistics = computed(
    () =>
      ({
        BALANCE: {
          color: 'green',
          icon: 'ui/dollar-02',
          label: 'Balance',
          value: '$' + formatNum(u.balance),
        },
        EQUITY: {
          color: 'green',
          icon: 'ui/briefcase-dollar',
          label: 'Equity',
          value: '$' + formatNum(u.equity),
        },
        FREE_FUNDS: {
          color: 'blue',
          icon: 'ui/affiliate',
          label: 'Free Funds',
          value: '$' + formatNum(u.freeFunds),
          progress: u.freeFunds / u.equity,
        },
        MARGIN: {
          color: 'blue',
          icon: 'ui/pie-chart',
          label: 'Margin',
          value: '$' + formatNum(u.totalMargin),
          progress: 0.1,
        },
        WIN_RATIO: {
          color: 'green',
          icon: 'ui/percent',
          label: 'Win Ratio',
          value: '50%',
          progress: 0.5,
        },
        PNL: {
          color: 'green',
          icon: 'ui/coins-dollar',
          label: 'PnL',
          value: '$' + formatNum(u.totalPl),
        },
        MARGIN_LEVEL: {
          color: 'green',
          icon: 'ui/divide-sign',
          label: 'Margin Level',
          value: formatNum(u.marginLevel, 0) + '%',
        },
        NO_OF_TRADES: {
          color: 'blue',
          icon: 'ui/text-number-sign',
          label: 'No. Of  Trades',
          value: '1',
        },
        AVERAGE_PROFIT: {
          color: 'green',
          icon: 'ui/trade-up',
          label: 'Average Profit',
          value: '$0.00',
        },
        AVERAGE_LOSS: {
          color: 'red',
          icon: 'ui/trade-down',
          label: 'Average Loss',
          value: '$0.00',
        },
      }) as const,
  )

  function getItems(items: (keyof typeof statistics.value)[]) {
    return computed(() => items.map((item) => statistics.value[item]))
  }

  return { statistics, getItems }
}
