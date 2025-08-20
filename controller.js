const { trades, portfolio, currentPrices, processTrade } = require('./utils');

// Trade Controller
const createTrade = (req, res) => {
    let {symbol, side, quantity, price} = req.body;

    if (!symbol || !side || !price || !quantity) {
        return res.status(400).json({
            success: false,
            error: "Missing required fields: symbol, side, price, quantity" 
        });
    }

    const allowedSides = ["buy", "sell"];
    side = side.toLowerCase();

    if (!allowedSides.includes(side)){
        return res.status(400).json({
            success: false,
            error: "Invalid side. Allowed values: buy, sell"
        });
    }

    if (quantity <= 0 || price <= 0){
        return res.status(400).json({
            success: false,
            error: "Quantity and Price must be positive"
        });
    }

    symbol = symbol.toUpperCase();
    if (symbol !== "BTC" && symbol !== "ETH" && symbol !== "SOL"){
        return res.status(400).json({
            success: false,
            error: "Invalid symbol. Allowed values: BTC, ETH, SOL"
        });
    }

    try {
        const trade = {
            id: trades.length + 1,
            symbol,
            side,
            price: parseFloat(price),
            quantity: parseFloat(quantity),
            createdAt: new Date().toISOString()
        }

        processTrade(trade);
        trades.push(trade);

        res.status(201).json({
            success: true,
            message: "Trade occurred successfully",
            data: trade 
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }  
};

// Portfolio Controller
const getPortfolio = (req, res) => {
    const portfolioData = {};

    for (const [symbol, position] of Object.entries(portfolio)){
        if (position.totalQty > 0) {
            const currentPrice = currentPrices[symbol];
            const marketValue = position.totalQty * currentPrice;
            const purchasedCost = position.totalQty * position.avgPrice;
            const unrealizedPnl = marketValue - purchasedCost;

            portfolioData[symbol] = {
                quantity: position.totalQty,
                avgEntryPrice: Number(position.avgPrice.toFixed(2)),
                currentPrice,
                marketValue: Number(marketValue.toFixed(2)),
                purchasedCost: Number(purchasedCost.toFixed(2)),
                unrealizedPnl: Number(unrealizedPnl.toFixed(2)),
                realizedPnl: Number(position.realizedPnl.toFixed(2)),
            }
        }
    }

    res.status(200).json({
        success: true,
        message: "Portfolio fetched successfully",
        data: portfolioData
    });
};

// PnL Controller
const getPnL = (req, res) => {
    let totalRealizedPnl = 0;
    let totalUnrealizedPnl = 0;
    const individualPnl = {};

    for (const [symbol, position] of Object.entries(portfolio)){
        const currentPrice = currentPrices[symbol];
        const marketValue = position.totalQty * currentPrice;
        const purchasedCost = position.totalQty * position.avgPrice;
        const unrealizedPnl = marketValue - purchasedCost;

        totalRealizedPnl += position.realizedPnl;
        totalUnrealizedPnl += unrealizedPnl;

        individualPnl[symbol] = {
            realizedPnl: Number(position.realizedPnl.toFixed(2)),
            unrealizedPnl: Number(unrealizedPnl.toFixed(2)),
            status: position.totalQty > 0 ? "OPEN" : "CLOSED"
        }
    }

    res.status(200).json({
        success: true,
        message: "PnL fetched successfully",
        data: {
            summary: {
                totalRealizedPnl: Number(totalRealizedPnl.toFixed(2)),
                totalUnrealizedPnl: Number(totalUnrealizedPnl.toFixed(2)),
            },
            breakdown: individualPnl,
        }
    });
};

module.exports = {
    createTrade,
    getPortfolio,
    getPnL
};
