import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LISVisualizer = () => {
    const [nums, setNums] = useState([10, 9, 2, 5, 3, 7, 101, 18]);
    const [dp, setDp] = useState([1, 1, 1, 1, 1, 1, 1, 1]); // dp[i] = length of LIS ending at i
    const [prev, setPrev] = useState([-1, -1, -1, -1, -1, -1, -1, -1]); // For reconstructing path
    const [i, setI] = useState(0);
    const [j, setJ] = useState(-1); // Inner loop idx
    const [message, setMessage] = useState('Click Start to find LIS.');
    const [isFinished, setIsFinished] = useState(false);
    const [maxLen, setMaxLen] = useState(1);

    const reset = () => {
        setDp(Array(nums.length).fill(1));
        setPrev(Array(nums.length).fill(-1));
        setI(0);
        setJ(-1);
        setMaxLen(1);
        setIsFinished(false);
        setMessage('Ready.');
    };

    const handleStep = () => {
        if (isFinished) return;

        if (i === 0 && j === -1) {
            setMessage('Starting outer loop at i=0. dp[0]=1.');
            setI(1);
            setJ(0); // Start checking j=0 for i=1
            return;
        }

        if (i < nums.length) {
            // Inner loop logic
            if (j < i) {
                let msg = '';
                let newDp = [...dp];
                let newPrev = [...prev];
                let newMax = maxLen;

                if (nums[i] > nums[j]) {
                    msg = `nums[${i}] (${nums[i]}) > nums[${j}] (${nums[j]}). We can extend LIS ending at ${j}. `;
                    if (dp[j] + 1 > dp[i]) {
                        newDp[i] = dp[j] + 1;
                        newPrev[i] = j;
                        msg += `Update dp[${i}] to ${newDp[i]}.`;
                        newMax = Math.max(newMax, newDp[i]);
                    } else {
                        msg += `But 1 + dp[${j}] (${dp[j] + 1}) is not > dp[${i}] (${dp[i]}). No change.`;
                    }
                } else {
                    msg = `nums[${i}] (${nums[i]}) <= nums[${j}] (${nums[j]}). Cannot extend.`;
                }

                setDp(newDp);
                setPrev(newPrev);
                setMaxLen(newMax);
                setMessage(msg);

                setJ(j + 1);
            } else {
                // Inner loop done for this i
                setI(i + 1);
                setJ(0);
                setMessage(`Done checking predecessors for i=${i}. Moving to i=${i + 1}.`);
            }
        } else {
            setMessage(`Finished! Longest Increasing Subsequence Length: ${maxLen}.`);
            setIsFinished(true);
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
                    {i === 0 && j === -1 ? 'Start' : 'Next Step'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${nums.length}, 1fr)`, gap: '10px' }}>
                {nums.map((num, idx) => {
                    const isI = idx === i;
                    const isJ = idx === j && i < nums.length;

                    return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ marginBottom: '5px', fontSize: '0.8rem', color: '#888' }}>
                                {idx}
                            </div>
                            <motion.div
                                animate={{
                                    scale: isI ? 1.1 : 1,
                                    borderColor: isI ? 'var(--accent-primary)' : isJ ? '#f1c40f' : 'transparent',
                                    backgroundColor: (isI || isJ) ? 'rgba(255,255,255,0.1)' : '#222'
                                }}
                                style={{
                                    width: '100%',
                                    padding: '1rem 0',
                                    border: '2px solid transparent',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    color: 'white'
                                }}
                            >
                                {num}
                            </motion.div>
                            <div style={{ marginTop: '5px', color: '#aaa', fontSize: '0.9rem' }}>
                                dp: <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{dp[idx]}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LISVisualizer;
