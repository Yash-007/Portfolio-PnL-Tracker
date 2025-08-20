# Portfolio Tracker

Backend service for tracking trading positions and P&L calculations.

## Running It

### Direct with Node
```bash
npm install
node server.js
```
Runs on port 3000.

### With Docker
```bash
docker build -t portfolio-tracker .
docker run -p 3000:3000 portfolio-tracker
```

## API Endpoints

### 1. Create Trade
```bash
POST /trade
Content-Type: application/json

Request:
{
    "symbol": "BTC",
    "side": "buy",
    "quantity": 1,
    "price": 1000000
}

Response: (201 Created)
{
    "success": true,
    "message": "Trade occurred successfully",
    "data": {
        "id": 1,
        "symbol": "BTC",
        "side": "buy",
        "price": 1000000,
        "quantity": 1,
        "createdAt": "2024-03-20T10:30:00.000Z"
    }
}
```

### 2. Get Portfolio
```bash
GET /portfolio

Response: (200 OK)
{
    "success": true,
    "message": "Portfolio fetched successfully",
    "data": {
        "BTC": {
            "quantity": 1,
            "avgEntryPrice": 1000000.00,
            "currentPrice": 9000000,
            "marketValue": 9000000.00,
            "purchasedCost": 1000000.00,
            "unrealizedPnl": 8000000.00,
            "realizedPnl": 0.00
        }
    }
}
```

### 3. Get PnL
```bash
GET /pnl

Response: (200 OK)
{
    "success": true,
    "message": "PnL fetched successfully",
    "data": {
        "summary": {
            "totalRealizedPnl": 0.00,
            "totalUnrealizedPnl": 8000000.00
        },
        "breakdown": {
            "BTC": {
                "realizedPnl": 0.00,
                "unrealizedPnl": 8000000.00,
                "status": "OPEN"
            }
        }
    }
}
```

## My Approach

**Core Logic**: Main focus is getting the portfolio state updates right. average price calculations when buying more, and tracking realized P&L on sales.

**P&L Logic**: Portfolio shows active positions only P&L shows everything including closed positions. Realized P&L accumulates over time per symbol (doesn't reset when you close and reopen positions) while unrealized P&L only applies to current holdings.


### Tech Choices
- **Node, Express**
- **JavaScript over TypeScript** - Could've used TypeScript or Go for better type safety, but as its a simple project so went with JS.
- **In-memory storage**

### Code Flow
Pretty straightforward:
- `processTrade()` handles the math for updating positions
- Average price calculation when you buy more of the same thing
- Realized P&L gets calculated and stored when you sell
- Portfolio endpoint only shows stuff you currently own
- P&L endpoint shows everything including closed positions

## Assumptions I Made

Since this is a simplified version, I assumed:

1. **Three coins only** - Hardcoded BTC/ETH/SOL validation
2. **Hardcoded prices** - `{BTC: 9000000, ETH: 60000, SOL: 30000}`


## Testing

Pretty thorough test coverage:
- Portfolio math (average prices, buys/sells)
- PnL tracking (both realized and unrealized)
- Edge cases like selling more than you own

Run them with:
```bash
# run once
npm test

# auto-rerun on changes
npm run test:watch
```

## API Response Format
All endpoints return JSON with:
```json
{
  "success": true/false,
  "message": "description",
  "data": { actual_data }
}
```