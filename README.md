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

## Quick Test
```bash
# Add a trade
curl -X POST localhost:3000/trade -H "Content-Type: application/json" \
  -d '{"symbol":"BTC","side":"buy","quantity":1,"price":1000000}'

# Check what you own
curl localhost:3000/portfolio

# See P&L
curl localhost:3000/pnl
```

## My Approach

**Core Logic**: Main focus is getting the portfolio state updates right. average price calculations when buying more, and tracking realized P&L on sales.

**Code Structure**: Separated the business logic into `processTrade()` so the API endpoints just handle validation and responses.

**P&L Logic**: Portfolio shows active positions only P&L shows everything including closed positions. Realized P&L accumulates over time per symbol (doesn't reset when you close and reopen positions) while unrealized P&L only applies to current holdings.

**PnL Method**: Average cost instead of FIFO

### Tech Choices
- **Node, Express**
- **JavaScript over TypeScript** - Could've used TypeScript or Go for better type safety, but as its a simple project so went with JS.
- **In-memory storage**

### Code Structure
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


## API Response Format
All endpoints return JSON with:
```json
{
  "success": true/false,
  "message": "description",
  "data": { actual_data }
}
```