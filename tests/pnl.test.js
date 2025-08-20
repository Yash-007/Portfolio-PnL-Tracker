const { portfolio, currentPrices, processTrade } = require('../utils');

// clearing portfolio before each test
beforeEach(() => {
    Object.keys(portfolio).forEach(key => delete portfolio[key]);
});

describe('PnL Calculations', () => {
    test('should correctly calculate unrealized PnL', () => {
        // buy 1 BTC at 1000000
        processTrade({
            symbol: 'BTC',
            side: 'buy',
            quantity: 1,
            price: 1000000
        });

        const position = portfolio.BTC;
        const marketValue = position.totalQty * currentPrices.BTC;
        const purchasedCost = position.totalQty * position.avgPrice;
        const unrealizedPnl = marketValue - purchasedCost;

        expect(unrealizedPnl).toBe(8000000); // (9000000 - 1000000) * 1
    });

    test('should accumulate realized PnL across multiple trades', () => {
        // buy 2 BTC at 1000000
        processTrade({
            symbol: 'BTC',
            side: 'buy',
            quantity: 2,
            price: 1000000
        });

        // sell 1 BTC at 1500000
        processTrade({
            symbol: 'BTC',
            side: 'sell',
            quantity: 1,
            price: 1500000
        });

        // sell remaining 1 BTC at 2000000
        processTrade({
            symbol: 'BTC',
            side: 'sell',
            quantity: 1,
            price: 2000000
        });

        expect(portfolio.BTC.realizedPnl).toBe(1500000); // (1500000-1000000) + (2000000-1000000)
    });

    test('should maintain realized PnL after position is closed', () => {
        // buy 1 BTC at 1000000
        processTrade({
            symbol: 'BTC',
            side: 'buy',
            quantity: 1,
            price: 1000000
        });

        // sell 1 BTC at 1500000
        processTrade({
            symbol: 'BTC',
            side: 'sell',
            quantity: 1,
            price: 1500000
        });

        expect(portfolio.BTC.totalQty).toBe(0);
        expect(portfolio.BTC.realizedPnl).toBe(500000);

        // buy another 1 BTC at 2000000
        processTrade({
            symbol: 'BTC',
            side: 'buy',
            quantity: 1,
            price: 2000000
        });

        expect(portfolio.BTC.realizedPnl).toBe(500000); // Previous PnL should be maintained
    });

    test('should handle multiple symbols independently', () => {
        // buy 1 BTC and 1 ETH
        processTrade({
            symbol: 'BTC',
            side: 'buy',
            quantity: 1,
            price: 1000000
        });

        processTrade({
            symbol: 'ETH',
            side: 'buy',
            quantity: 1,
            price: 50000
        });

        // sell both at profit
        processTrade({
            symbol: 'BTC',
            side: 'sell',
            quantity: 1,
            price: 1500000
        });

        processTrade({
            symbol: 'ETH',
            side: 'sell',
            quantity: 1,
            price: 55000
        });

        expect(portfolio.BTC.realizedPnl).toBe(500000);
        expect(portfolio.ETH.realizedPnl).toBe(5000);
    });
});
