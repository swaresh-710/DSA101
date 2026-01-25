import React, { useState } from 'react';
import { motion } from 'framer-motion';

const HouseRobberVisualizer = () => {
    const [houses, setHouses] = useState([1, 2, 3, 1]);
    const [dp, setDp] = useState([]); // dp[i] = max loot ending at i
    const [i, setI] = useState(0);
    const [message, setMessage] = useState('Click Start to rob houses.');
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setDp([]);
        setI(0);
        setIsFinished(false);
        setMessage('Ready.');
    };

    const handleStep = () => {
        if (isFinished) return;

        // DP Init
        if (i === 0) {
            // Need at least dp array
            // Logic: dp[i] = max(nums[i] + dp[i-2], dp[i-1])
            // Just initialized
            setDp([houses[0]]); // dp[0] is just houses[0]
            setMessage(`House 0: Loot ${houses[0]}. Max so far: ${houses[0]}.`);
            setI(1);
            return;
        }

        if (i < houses.length) {
            const currentHouseVal = houses[i];
            const prev1 = dp[i - 1];
            const prev2 = i >= 2 ? dp[i - 2] : 0;

            const option1 = prev1; // Skip current
            const option2 = prev2 + currentHouseVal; // Rob current

            const maxVal = Math.max(option1, option2);

            const newDp = [...dp, maxVal];
            setDp(newDp);

            setMessage(`House ${i} (Value ${currentHouseVal}): \nOption 1 (Skip): Keep prev max (${prev1}). \nOption 2 (Rob): Current (${currentHouseVal}) + Max from House ${i - 2} (${prev2}) = ${option2}. \nDecision: ${maxVal}.`);

            setI(i + 1);
        } else {
            setMessage(`Finished! Max loot: ${dp[houses.length - 1]}.`);
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
                    {i === 0 ? 'Start' : 'Next House'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>Values (comma sep):</label>
                    <input
                        type="text"
                        value={houses.join(',')}
                        onChange={(e) => { setHouses(e.target.value.split(',').map(n => parseInt(n.trim()) || 0)); reset(); }}
                        style={{ width: '120px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '20px' }}>
                {houses.map((val, idx) => {
                    const isCurrent = idx === i;
                    const isRobbed = i > idx && (idx === i - 1 ? dp[idx] !== dp[idx - 1] : (dp[idx] === (houses[idx] + (idx >= 2 ? dp[idx - 2] : 0))));
                    // Note: reconstructing exact choice "isRobbed" from just DP array purely visually is tricky without extra state, but heuristic above:
                    // If dp[i] != dp[i-1], we must have robbed i.
                    // Actually, let's just highlight current.

                    const dpVal = dp[idx] !== undefined ? dp[idx] : '?';

                    return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>House {idx}</div>
                            <motion.div
                                animate={{
                                    scale: isCurrent ? 1.1 : 1,
                                    borderColor: isCurrent ? 'var(--accent-primary)' : 'transparent',
                                    boxShadow: isCurrent ? '0 0 15px rgba(255,255,255,0.1)' : 'none'
                                }}
                                style={{
                                    width: '60px', height: '60px', background: '#333',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    borderRadius: '8px', border: '2px solid transparent',
                                    position: 'relative'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{val}</span>
                                <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#2ecc71', color: 'black', borderRadius: '50%', width: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', opacity: dpVal !== '?' ? 1 : 0 }}>
                                    {dpVal}
                                </div>
                            </motion.div>
                            <div style={{ marginTop: '5px', fontSize: '0.8rem', color: '#888' }}>
                                Max: {dpVal}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HouseRobberVisualizer;
