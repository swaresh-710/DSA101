import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CountingBitsVisualizer = () => {
    const [n, setN] = useState(5);
    const [ans, setAns] = useState([]);
    const [currentI, setCurrentI] = useState(-1);
    const [message, setMessage] = useState('Click Start to generate bit counts.');
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setAns([]);
        setCurrentI(-1);
        setIsFinished(false);
        setMessage('Ready.');
    };

    const handleStep = () => {
        if (isFinished) return;

        if (currentI === -1) {
            setAns([0]);
            setCurrentI(1);
            setMessage('Base case: 0 has 0 set bits. Starting loop from i = 1.');
            return;
        }

        if (currentI > n) {
            setMessage(`Finished! Generated counts for 0 to ${n}.`);
            setIsFinished(true);
            return;
        }

        // Logic: dp[i] = dp[i >> 1] + (i & 1)
        const half = currentI >> 1;
        const isOdd = (currentI & 1);
        const val = ans[half] + isOdd;

        const nextAns = [...ans, val];
        setAns(nextAns);

        setMessage(`i = ${currentI}(Binary: ${(currentI).toString(2)}).\nUse count from i >> 1(${half}) which is ${ans[half]}.\nAdding last bit(${isOdd}).\nTotal: ${val}.`);

        setCurrentI(currentI + 1);
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div className="visualizer-controls">
                <button
                    onClick={handleStep}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    {currentI === -1 ? 'Start' : 'Next Number'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>n:</label>
                    <input
                        type="number"
                        value={n}
                        onChange={(e) => { setN(parseInt(e.target.value) || 0); reset(); }}
                        style={{ width: '50px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {ans.map((val, idx) => (
                    <motion.div
                        key={idx}
                        layout
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                            background: '#222',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            minWidth: '60px',
                            textAlign: 'center',
                            border: idx === currentI - 1 ? '1px solid var(--accent-primary)' : '1px solid transparent'
                        }}
                    >
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{idx}</div>
                        <div style={{ color: '#888', fontSize: '0.7rem' }}>{(idx).toString(2)}</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{val}</div>
                    </motion.div>
                ))}
                {currentI <= n && currentI !== -1 && (
                    <div style={{ padding: '0.5rem', minWidth: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                        ...
                    </div>
                )}
            </div>
        </div>
    );
};

export default CountingBitsVisualizer;
