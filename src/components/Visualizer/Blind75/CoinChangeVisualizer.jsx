import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CoinChangeVisualizer = () => {
    const [amount, setAmount] = useState(11);
    const [coins, setCoins] = useState([1, 2, 5]);

    // dp[i] = min coins to make amount i
    // Initialize with amount + 1 (infinity)
    const [dp, setDp] = useState(() => Array(amount + 1).fill(amount + 1));
    const [currentAmount, setCurrentAmount] = useState(0); // Iterating through 1..amount
    const [message, setMessage] = useState('Click Start to find min coins.');
    const [isFinished, setIsFinished] = useState(false);

    // For visualization - which coin are we checking?
    const [currentCoinIdx, setCurrentCoinIdx] = useState(-1);

    const reset = () => {
        setDp(Array(amount + 1).fill(amount + 1).map((val, idx) => idx === 0 ? 0 : val));
        setCurrentAmount(0);
        setCurrentCoinIdx(-1);
        setIsFinished(false);
        setMessage('Ready.');
    };

    const handleStep = () => {
        if (isFinished) return;

        // Initial setup
        if (currentAmount === 0 && currentCoinIdx === -1) {
            const initDp = Array(amount + 1).fill(amount + 1);
            initDp[0] = 0;
            setDp(initDp);
            setCurrentAmount(1);
            setCurrentCoinIdx(0);
            setMessage('Initialized dp array. dp[0] = 0. Starting amount 1.');
            return;
        }

        // Main Loop
        if (currentAmount <= amount) {
            if (currentCoinIdx < coins.length) {
                const coin = coins[currentCoinIdx];

                // If coin <= currentAmount
                if (coin <= currentAmount) {
                    // Check if taking this coin reduces count
                    const prevVal = dp[currentAmount];
                    const potentialVal = dp[currentAmount - coin] + 1;

                    let msg = `Checking Amount ${currentAmount} using Coin ${coin}. `;
                    msg += `dp[${currentAmount} - ${coin}] + 1 = ${potentialVal}. `;

                    if (potentialVal < prevVal) {
                        msg += `New min found! Updating dp[${currentAmount}] to ${potentialVal}.`;
                        const newDp = [...dp];
                        newDp[currentAmount] = potentialVal;
                        setDp(newDp);
                    } else {
                        msg += `Current min ${prevVal} is smaller or equal. No update.`;
                    }
                    setMessage(msg);
                } else {
                    setMessage(`Coin ${coin} > Amount ${currentAmount}. Skipping.`);
                }

                // Move to next coin or next amount
                if (currentCoinIdx + 1 < coins.length) {
                    setCurrentCoinIdx(currentCoinIdx + 1);
                } else {
                    // Done with all coins for this amount
                    setCurrentCoinIdx(0);
                    setCurrentAmount(currentAmount + 1);
                }
            } else {
                // Should not reach here normally due to inner if logic
            }
        } else {
            // Finished
            const result = dp[amount] > amount ? -1 : dp[amount];
            setMessage(`Finished! Min coins for ${amount}: ${result}.`);
            setIsFinished(true);
        }
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <button
                    onClick={handleStep}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    {currentAmount === 0 ? 'Start' : 'Next Step'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>Amount:</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => { setAmount(parseInt(e.target.value) || 0); reset(); }}
                        style={{ width: '50px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                        min={1} max={20}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {/* DP Array */}
                <div>
                    <h4 style={{ color: '#888', marginBottom: '1rem' }}>DP Table (Min Coins)</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
                        {dp.map((val, idx) => {
                            const isCurrent = idx === currentAmount;
                            const isPrev = idx === currentAmount - coins[currentCoinIdx]; // Only approx valid for highlighting

                            return (
                                <motion.div
                                    key={idx}
                                    animate={{
                                        backgroundColor: isCurrent ? 'rgba(52, 152, 219, 0.3)' : '#222',
                                        borderColor: isCurrent ? 'var(--accent-primary)' : 'transparent'
                                    }}
                                    style={{
                                        padding: '0.5rem',
                                        border: '1px solid transparent',
                                        borderRadius: '4px',
                                        textAlign: 'center',
                                        minWidth: '40px'
                                    }}
                                >
                                    <div style={{ fontSize: '0.7rem', color: '#666' }}>{idx}</div>
                                    <div style={{ fontWeight: 'bold', color: val > amount ? '#555' : 'white' }}>
                                        {val > amount ? '∞' : val}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Coins */}
                <div>
                    <h4 style={{ color: '#888', marginBottom: '1rem' }}>Coins</h4>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {coins.map((c, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: '40px', height: '40px', borderRadius: '50%', background: '#f1c40f', color: '#222',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                                    border: idx === currentCoinIdx ? '3px solid white' : 'none',
                                    opacity: idx === currentCoinIdx ? 1 : 0.6,
                                    boxShadow: '0 0 10px rgba(241, 196, 15, 0.2)'
                                }}
                            >
                                {c}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoinChangeVisualizer;
