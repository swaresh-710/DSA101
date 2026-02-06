import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NumberOf1BitsVisualizer = () => {
    const [num, setNum] = useState(11); // Binary 1011
    const [currNum, setCurrNum] = useState(11);
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState('Click Start to count 1 bits.');
    const [isFinished, setIsFinished] = useState(false);
    const [stepState, setStepState] = useState('INIT');

    const toBin = (n) => (n >>> 0).toString(2).padStart(32, '0');
    // Using 8 bits for display simplicity unless it's large
    const toBinDisplay = (n) => (n >>> 0).toString(2).padStart(8, '0');

    const reset = () => {
        setCurrNum(num);
        setCount(0);
        setMessage('Ready.');
        setIsFinished(false);
        setStepState('INIT');
    };

    const handleStep = () => {
        if (isFinished) return;

        if (stepState === 'INIT') {
            setMessage(`Starting with n = ${currNum} (Binary: ${toBinDisplay(currNum)}). Count = 0.`);
            setStepState('CHECK_ZERO');
            return;
        }

        if (stepState === 'CHECK_ZERO') {
            if (currNum === 0) {
                setMessage(`n is 0. Finished! Total 1 bits: ${count}.`);
                setIsFinished(true);
                return;
            }

            // Explain n & (n-1) trick or simple checking last bit
            // Let's visualize n & (n-1) optimization
            setMessage(`n is not 0. Perform n & (n - 1) to remove the rightmost set bit.`);
            setStepState('REMOVE_BIT');
            return;
        }

        if (stepState === 'REMOVE_BIT') {
            const nMinus1 = currNum - 1;
            const nextNum = currNum & nMinus1;

            setMessage(`n = ${toBinDisplay(currNum)} (${currNum})\nn-1 = ${toBinDisplay(nMinus1)} (${nMinus1})\nn & (n-1) = ${toBinDisplay(nextNum)} (${nextNum}).\nOne bit removed! Incrementing count.`);

            setCurrNum(nextNum);
            setCount(prev => prev + 1);
            setStepState('CHECK_ZERO'); // Go back to check
        }
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div className="visualizer-controls">
                <button
                    onClick={handleStep}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    {stepState === 'INIT' ? 'Start' : 'Next Step'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>Number:</label>
                    <input
                        type="number"
                        value={num}
                        onChange={(e) => { setNum(parseInt(e.target.value) || 0); reset(); }}
                        style={{ width: '60px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                <div style={{ background: '#222', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1rem', color: '#888', marginBottom: '1rem' }}>Current Number (n)</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '2.5rem', letterSpacing: '5px' }}>
                        {toBinDisplay(currNum).split('').map((bit, idx, arr) => {
                            // Highlight the rightmost set bit if we are about to remove it?
                            // It's hard to isolate purely visually without more state logic.
                            // Just color 1s differently.
                            return (
                                <span key={idx} style={{ color: bit === '1' ? '#2ecc71' : '#555' }}>{bit}</span>
                            );
                        })}
                    </div>
                </div>

                <div style={{ background: 'rgba(52, 152, 219, 0.1)', padding: '1.5rem', borderRadius: '12px', minWidth: '150px', textAlign: 'center', border: '1px solid rgba(52, 152, 219, 0.3)' }}>
                    <div style={{ fontSize: '0.9rem', color: '#3498db', marginBottom: '0.5rem' }}>Set Bits Count</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>{count}</div>
                </div>
            </div>
        </div>
    );
};

export default NumberOf1BitsVisualizer;
