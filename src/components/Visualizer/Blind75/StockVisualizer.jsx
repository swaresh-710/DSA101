import React, { useState } from 'react';
import { motion } from 'framer-motion';

const StockVisualizer = () => {
    // Default: prices = [7,1,5,3,6,4]
    const [prices, setPrices] = useState([7, 1, 5, 3, 6, 4]);
    const [minPrice, setMinPrice] = useState(Infinity);
    const [maxProfit, setMaxProfit] = useState(0);
    const [currentDay, setCurrentDay] = useState(-1);
    const [buyDay, setBuyDay] = useState(-1); // Index of minPrice
    const [sellDay, setSellDay] = useState(-1); // Index of current max profit sell
    const [message, setMessage] = useState('Click Start to simulate.');
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setMinPrice(Infinity);
        setMaxProfit(0);
        setCurrentDay(-1);
        setBuyDay(-1);
        setSellDay(-1);
        setMessage('Ready.');
        setIsFinished(false);
    };

    const handleStep = () => {
        if (isFinished) return;

        let nextDay = currentDay + 1;
        if (currentDay === -1) {
            nextDay = 0;
            setMinPrice(prices[0]);
            setBuyDay(0);
            setCurrentDay(0);
            setMessage(`Day 0: Price is ${prices[0]}. Initial Min Price set.`);
            return;
        }

        if (nextDay >= prices.length) {
            setMessage(`Finished! Max Profit is ${maxProfit}.`);
            setIsFinished(true);
            return;
        }

        const currentPrice = prices[nextDay];
        setCurrentDay(nextDay);

        let newMinPrice = minPrice;
        let newBuyDay = buyDay;
        let newMaxProfit = maxProfit;
        let newSellDay = sellDay;
        let msg = `Day ${nextDay} (Price: ${currentPrice}): `;

        if (currentPrice < minPrice) {
            newMinPrice = currentPrice;
            newBuyDay = nextDay;
            msg += `Found new lowest price! Update Min Price to ${currentPrice}.`;
        } else {
            const profit = currentPrice - newMinPrice;
            msg += `Profit if sold today: ${currentPrice} - ${newMinPrice} = ${profit}. `;
            if (profit > maxProfit) {
                newMaxProfit = profit;
                newSellDay = nextDay; // Effectively we bought at newBuyDay (stored in minPrice logic) and sold here
                msg += `New Max Profit!`;
            } else {
                msg += `Not better than max profit (${maxProfit}).`;
            }
        }

        setMinPrice(newMinPrice);
        setMaxProfit(newMaxProfit);
        setBuyDay(newBuyDay);
        // We only update sellDay if we found a better profit.
        // Actually, to visualize the specific Pair that gives MaxProfit, we need to track bestBuyIndex and bestSellIndex.
        // The current logic tracks 'minPrice' encountered SO FAR.
        // Let's refine state to visualize the "Best Transaction" vs "Current Calculation".
        if (currentPrice - newMinPrice > maxProfit) {
            setSellDay(nextDay);
            // We also need to remember WHICH buy day gave this profit. 
            // Since 'newMinPrice' caused this profit, the buy day associated with 'newMinPrice' is the one.
            // But 'newMinPrice' tracks absolute minimum so far. 
            // Yes, if (price - minPrice > maxProfit), then the transaction is (minPrice_index, current_index).
        }

        setMessage(msg);
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div className="visualizer-controls">
                <button
                    onClick={handleStep}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    {currentDay === -1 ? 'Start' : 'Next Day'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '1rem', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ background: '#222', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>Min Price So Far</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF6B6B' }}>
                        {minPrice === Infinity ? '-' : minPrice}
                    </div>
                </div>
                <div style={{ background: '#222', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>Max Profit</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2ecc71' }}>
                        {maxProfit}
                    </div>
                </div>
            </div>

            {/* Chart Visualization */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '15px',
                height: '250px',
                padding: '20px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '12px'
            }}>
                {prices.map((price, idx) => {
                    // Determine bar color
                    let barColor = '#555'; // Default
                    if (idx === currentDay) barColor = '#fff'; // Being processed
                    if (idx === buyDay && currentDay >= idx) barColor = '#FF6B6B'; // Current Minimum Price Index

                    // If we finished, highlight the best transaction
                    // (This logic needs robust tracking of best pair, but simplifying for now)

                    return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                            <div style={{ marginBottom: '5px', color: '#aaa', fontWeight: 'bold' }}>{price}</div>
                            <motion.div
                                animate={{
                                    height: `${price * 25}px`,
                                    backgroundColor: barColor,
                                    opacity: (idx > currentDay && currentDay !== -1) ? 0.3 : 1
                                }}
                                style={{
                                    width: '100%',
                                    borderRadius: '4px 4px 0 0',
                                    maxWidth: '40px'
                                }}
                            />
                            <div style={{ marginTop: '5px', color: '#666', fontSize: '0.8rem' }}>Day {idx}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StockVisualizer;
