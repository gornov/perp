enum ChallengeType {
  DEFAULT = 0,
  COMPETITION = 1,
}

interface Challenge {
  challengeId: string
  brokerId: number
  name: string
  currency: string
  description: string
  branch: {
    uuid: string
    name: string
  }
  system: {
    uuid: string
    name: string
  }
  operation: {
    uuid: string
    name: string
  }
  isHidden: boolean
  challengeStatisticsEnabled: boolean
  fee: number
  phases: {
    id: string
    phaseStep: number
    phaseName: string
    isFunded: boolean
    profitSplitPercentages: {
      broker: number
      trader: number
    }
    groupName: string
    initialBalance: number
    initialLeverage: number
    tradingPeriod: number
    minimumTradingPeriod: number
    maxDailyLossPercentage: number
    maxLossPercentage: number
    profitTargetPercentage: number
    maxDailyLossCalculationType: string
    autoEvaluationEnabled: boolean
    offerUuid: string
    kycRequired: boolean
    lockAccountOnWithdrawalRequested: boolean
  }[]
}
