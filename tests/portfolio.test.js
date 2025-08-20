const { portfolio, currentPrices, processTrade } = require('../utils');

// clearing portfolio before each test
beforeEach(() => {
    Object.keys(portfolio).forEach(key => delete portfolio[key]);
});

describe('Portfolio Management', () => {
    test('should correctly calculate average price after multiple buys', () => {
        // first buy: 1 BTC at 1000000
        processTrade({
            symbol: 'BTC',
            side: 'buy',
            quantity: 1,
            price: 1000000
        });

        // second buy: 2 BTC at 1500000
        processTrade({
            symbol: 'BTC',
            side: 'buy',
            quantity: 2,
            price: 1500000
        });

        expect(portfolio.BTC.totalQty).toBe(3);
        expect(portfolio.BTC.avgPrice).toBe(1333333.33); // (1*1000000 + 2*1500000) / 3
    });

    test('should correctly calculate realized PnL after selling', () => {
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

        expect(portfolio.BTC.totalQty).toBe(1);
        expect(portfolio.BTC.realizedPnl).toBe(500000); // (1500000 - 1000000) * 1
    });

    test('should throw error when selling more than owned', () => {
        // buy 1 BTC
        processTrade({
            symbol: 'BTC',
            side: 'buy',
            quantity: 1,
            price: 1000000
        });

        // try to sell 2 BTC
        expect(() => {
            processTrade({
                symbol: 'BTC',
                side: 'sell',
                quantity: 2,
                price: 1500000
            });
        }).toThrow('Insufficient quantity in portfolio');
    });

    test('should reset average price when position is closed', () => {
        // buy 1 BTC
        processTrade({
            symbol: 'BTC',
            side: 'buy',
            quantity: 1,
            price: 1000000
        });

        // sell 1 BTC
        processTrade({
            symbol: 'BTC',
            side: 'sell',
            quantity: 1,
            price: 1500000
        });

        expect(portfolio.BTC.totalQty).toBe(0);
        expect(portfolio.BTC.avgPrice).toBe(0);
    });
});
