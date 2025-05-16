// https://app.theneo.io/match-trade/broker-api/accounts/trading-accounts/get-trading-accounts

const enum AccountInChallengeStatus {
  ACTIVE_PARTICIPATING_IN_CHALLENGE = 0,
  ACTIVE_FUNDED = 1,
  CREATED_NOT_YET_PAID_CHALLENGE_FEE = 2,
  LOCKED_FAILED_CHALLENGE = 3,
  AWAITING_COMPETITION_START = 4,
  AWAITING_COMPETITION_FEE_NOT_PAID = 5,
  ACTIVE_COMPETITION = 6,
  LOCKED_FINISHED_COMPETITION = 7,
  LOCKED_FAILED_COMPETITION = 8,
}

const enum AccountEvaluationStatus {
  MAX_LOSS_REACHED = 0,
  MAX_DAILY_LOSS_REACHED = 1,
  PROFIT_TARGET_REACHED_OPEN_TRADES = 2,
  PROFIT_TARGET_REACHED_NO_OPEN_TRADES = 3,
}

interface PropTradingAccount {
  accountId: string
  login: number
  name: string
  email: string
  created: string // RFC3339
  challengeName: string
  challengeId: string
  phaseName: string
  phaseStep: number
  status: keyof typeof AccountInChallengeStatus
  tradingDays: number
}

interface TradingAccount {
  uuid: string
  login: string
  created: string // RFC3339
  accountInfo: {
    uuid: string
    email: string
  }
  offerUuid: string
  systemUuid: string
  commissionUuid: number
  group: string
  leverage: number
  access: string
  accountType: 'REAL' | 'DEMO'
  financeInfo: {
    balance: number
    equity: number
    profit: number
    netProfit: number
    margin: number
    freeMargin: number
    marginLevel: number
    credit: number
    currency: string // 'USD'
    currencyPrecision: number
  }
}

interface Account {
  uuid: string
  created: string
  updated: string
  email: string
  verificationStatus:
    | 'NEW'
    | 'REJECTED'
    | 'VERIFIED'
    | 'BLOCKED'
    | 'PENDING_VERIFICATION'
    | 'UNVERIFIED'
  type: 'RETAIL' | 'PROFESSIONAL' | 'EXPERIENCED'
  personalDetails: {
    firstname: string
    lastname: string
    dateOfBirth: string
    citizenship: string
    language: string
    maritalStatus: string
    passport: {
      number: string
      country: string
    }
    taxIdentificationNumber: string
  }
  contactDetails: {
    phoneNumber: string
    faxNumber: string
    toContact: {
      toContactDate: string
      alreadyContacted: false
    }
  }
  accountConfiguration: {
    partnerId: number
    branchUuid: string
    roleUuid: string
    accountManager: {
      uuid: string
      email: string
      name: string
    }
    ibParentTradingAccountUuid: string
    crmUserScope: {
      branchScope: string[]
      managerPools: string[]
    }
    accountTypeContact: false
  }
  addressDetails: {
    country: string
    state: string
    city: string
    postCode: string
    address: string
  }
  bankingDetails: {
    bankAddress: string
    bankSwiftCode: string
    bankAccount: string
    bankName: string
    accountName: string
  }
  leadDetails: {
    statusUuid: string
    source: string
    providerUuid: string
    becomeActiveClientTime: string
  }
}
