* GET http://localhost:8080/api/v1/candles?symbol=ETHUSDT&interval=1h&startTime=1714521600000&endTime=1714608000000
```json
[
    {
        "openTime": 1714521600000,
        "open": "3014.04000000",
        "high": "3023.24000000",
        "low": "2988.00000000",
        "close": "2999.05000000",
        "volume": "15150.67470000",
        "closeTime": 1714525199999
    },
]
```
* GET http://localhost:8080/api/v1/quote?symbol=BTCUSDT
```json
{
    "symbol": "BTCUSDT",
    "price": "104041.89000000"
}
```
* GET http://localhost:8080/api/v1/instruments
```json
[
    {
        "id": 1,
        "symbol": "BTCUSDT",
        "act": true
    },
    {
        "id": 2,
        "symbol": "ETHUSDT",
        "act": true
    }
]
```

* POST http://localhost:8080/api/v1/account
```json
{
}
```

*POST /api/v1/account/balance  
Authorization: Token Bearer XXXXXXXXX
```json
{
  "balance": "123.456789"
}
```

* GET http://localhost:8080/api/v1/account/balance  
Authorization: Token Bearer XXXXXXXXX
```json
{
  "balance": "123.456789"
}
```

* POST /api/v1/account/balance/adjust  
Authorization: Token Bearer XXXXXXXXX
```json
{
  "delta": "-50.123456"
}
```

* POST /api/v1/position  
Authorization: Token Bearer XXXXXXXXX
```json
{
  "symbol": "BTCUSDT",
  "amount": "1.5",
  "mult": 10,
  "side": "buy",
}
```

* GET /api/v1/positions?symbol=BTCUSDT&side=buy&status=0  
Authorization: Token Bearer XXXXXXXXX
```json
[
    {
        "id": 1,
        "instrument_id": 1,
        "amount": "1.5",
        "mult": 10,
        "created_at": "2025-05-15T20:26:35.884Z",
        "side": 1,
        "account_id": 1,
        "open_rate": null,
        "status": 0
    }
]
```

* POST /api/v1/position/close
Authorization: Token Bearer XXXXXXXXX
```json
{
  "position_id": 1234
}
```

* GET http://localhost:8080/api/v1/account/summary  
  Authorization: Token Bearer XXXXXXXXX
```json
{
    "balance": "7660",
    "total_pl": "-148.394312473481599241",
    "total_margin": "2340",
    "free_funds": "7511.605687526518400759",
    "equity": "9851.605687526518400759",
    "margin_level": "421.00879006523583"
}
```

* POST /api/v1/auth/nonce
```json
{
  "public_key": "base64-encoded-public-key"
}
```
```json
{
  "nonce": "generated-nonce-uuid"
}
```

* POST /api/v1/auth/verify
```json
{
  "public_key": "base64-encoded-public-key",
  "signature": "base64-encoded-signature"
}
```
```json
{
  "token": "session-token-uuid"
}
```