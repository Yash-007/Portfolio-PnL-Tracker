const trades = [];
const portfolio = {};

const currentPrices = {
    BTC: 9000000,
    ETH: 60000,
    SOL: 30000
}

function calculateAveragePrice(existingQty, existingPrice, newQty, newPrice){
    const totalValue = (existingQty * existingPrice) + (newQty * newPrice);
    const totalQty = existingQty + newQty;
    return totalValue / totalQty;
}

function processTrade(trade) {
    const {symbol, side, quantity, price} = trade;

    if (!portfolio[symbol]){
        portfolio[symbol] = {
            totalQty: 0,
            avgPrice: 0,
            realizedPnl: 0
        }
    }

    const position = portfolio[symbol];

    if (side === "buy"){
        const newAvgPrice = calculateAveragePrice(position.totalQty, position.avgPrice, quantity, price);
        position.avgPrice = Number(newAvgPrice.toFixed(2));
        position.totalQty += quantity;
    } else {
        if (position.totalQty < quantity){
            throw new Error("Insufficient quantity in portfolio");
        }

        const realizedPnl = (price - position.avgPrice) * quantity;
        position.realizedPnl += realizedPnl;
        position.totalQty -= quantity;

        if (position.totalQty === 0){
            position.avgPrice = 0;
        }
    }
}

module.exports = {
    trades,
    portfolio,
    currentPrices,
    processTrade
};
