import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MaxProductSubarrayVisualizer = () => {
    const [nums, setNums] = useState([2, 3, -2, 4]);
    const [currentMax, setCurrentMax] = useState(1);
    const [currentMin, setCurrentMin] = useState(1);
    const [globalMax, setGlobalMax] = useState(-Infinity);
    const [currentIndex, setCurrentIndex] = useState(-1);

    // For storing previous state to visualize transitions
    const [prevMax, setPrevMax] = useState(null);
    const [prevMin, setPrevMin] = useState(null);

    const [message, setMessage] = useState('Click Start to run.');
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setCurrentMax(1);
        setCurrentMin(1);
        setGlobalMax(-Infinity);
        setCurrentIndex(-1);
        setPrevMax(null);
        setPrevMin(null);
        setMessage('Ready.');
        setIsFinished(false);
    };

    const handleStep = () => {
        if (isFinished) return;

        let nextIndex = currentIndex + 1;
        if (currentIndex === -1) {
            // Initialization
            // Actually, for product, we often iterate from 0 to n-1. 
            // First element init:
            const val = nums[0];
            setCurrentIndex(0);
            setCurrentMax(val);
            setCurrentMin(val);
            setGlobalMax(val);
            setMessage(`Initialized with first element ${val}.`);
            return;
        }

        if (nextIndex >= nums.length) {
            setMessage(`Finished! Maximum Product Subarray is ${globalMax}.`);
            setIsFinished(true);
            return;
        }

        setCurrentIndex(nextIndex);
        const val = nums[nextIndex];

        // Save previous for display
        const pMax = currentMax;
        const pMin = currentMin;
        setPrevMax(pMax);
        setPrevMin(pMin);

        // Logic
        // candidates: val, val * currentMax, val * currentMin
        const cand1 = val;
        const cand2 = val * pMax;
        const cand3 = val * pMin;

        const newMax = Math.max(cand1, Math.max(cand2, cand3));
        const newMin = Math.min(cand1, Math.min(cand2, cand3));

        setCurrentMax(newMax);
        setCurrentMin(newMin);

        let msg = `Value: ${val}. Candidates: (${cand1}, ${cand2}, ${cand3}). New Max: ${newMax}, New Min: ${newMin}. `;

        if (newMax > globalMax) {
            setGlobalMax(newMax);
            msg += `New Global Max Found!`;
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
                    {currentIndex === -1 ? 'Start' : 'Next Element'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <button
                    onClick={() => { setNums([-2, 0, -1]); reset(); }}
                    style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', color: '#aaa' }}
                >
                    Case: [-2,0,-1]
                </button>
                <button
                    onClick={() => { setNums([2, 3, -2, 4]); reset(); }}
                    style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', color: '#aaa' }}
                >
                    Case: [2,3,-2,4]
                </button>
            </div>

            <div style={{ marginBottom: '1rem', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ background: '#222', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>Prev Max * Val</div>
                    <div style={{ fontSize: '1.2rem', color: '#aaa' }}>
                        {prevMax !== null ? `${prevMax} * ${nums[currentIndex]} = ${prevMax * nums[currentIndex]}` : '-'}
                    </div>
                </div>
                <div style={{ background: '#222', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>Prev Min * Val</div>
                    <div style={{ fontSize: '1.2rem', color: '#aaa' }}>
                        {prevMin !== null ? `${prevMin} * ${nums[currentIndex]} = ${prevMin * nums[currentIndex]}` : '-'}
                    </div>
                </div>
            </div>

            <div className="responsive-flex" style={{ gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ background: 'rgba(46, 204, 113, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>Current Max</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2ecc71' }}>
                        {currentIndex === -1 ? '-' : currentMax}
                    </div>
                </div>
                <div style={{ background: 'rgba(255, 107, 107, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 107, 107, 0.3)' }}>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>Current Min</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF6B6B' }}>
                        {currentIndex === -1 ? '-' : currentMin}
                    </div>
                </div>
                <div style={{ background: '#222', padding: '1rem', borderRadius: '8px', border: '1px solid #444' }}>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>Global Max</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                        {globalMax === -Infinity ? '-' : globalMax}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {nums.map((val, idx) => {
                    const isProcessing = idx === currentIndex;
                    return (
                        <motion.div
                            key={idx}
                            animate={{
                                scale: isProcessing ? 1.2 : 1,
                                borderColor: isProcessing ? 'var(--accent-primary)' : 'transparent',
                                backgroundColor: isProcessing ? '#333' : '#222'
                            }}
                            style={{
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '2px solid transparent',
                                borderRadius: '8px',
                                background: '#222',
                                fontWeight: 'bold',
                                position: 'relative'
                            }}
                        >
                            {val}
                            <div style={{ position: 'absolute', top: '-25px', fontSize: '0.7rem', color: '#555' }}>{idx}</div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default MaxProductSubarrayVisualizer;
