import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MergeIntervalsVisualizer = () => {
    // Initial: [[1,3],[2,6],[8,10],[15,18]]
    // Sorted: Same.
    // Merge: [1,6], [8,10], [15,18]

    // Example 2: [[1,4],[4,5]] -> [[1,5]]

    const [input, setInput] = useState([[1, 3], [2, 6], [8, 10], [15, 18]]);
    const [sortedInput, setSortedInput] = useState([]);
    const [result, setResult] = useState([]);
    const [currentInterval, setCurrentInterval] = useState(null); // The one we are trying to merge into the last of result
    const [activeIdx, setActiveIdx] = useState(-1);
    const [message, setMessage] = useState('Click Start to merge intervals.');
    const [isFinished, setIsFinished] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const reset = () => {
        setSortedInput([]);
        setResult([]);
        setCurrentInterval(null);
        setActiveIdx(-1);
        setIsFinished(false);
        setIsRunning(false);
        setMessage('Ready.');
    };

    const runMerge = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setResult([]);
        setSortedInput([]);

        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const delay = 1000;

        // 1. Sort
        setMessage('Sorting intervals by start time...');
        const sorted = [...input].sort((a, b) => a[0] - b[0]);
        setSortedInput(sorted);
        await sleep(delay);

        if (sorted.length === 0) {
            setIsFinished(true);
            setIsRunning(false);
            return;
        }

        const res = [sorted[0]];
        setResult([...res]); // Initial result with first interval
        setMessage(`Initialized result with [${sorted[0].join(',')}].`);
        setActiveIdx(0);
        await sleep(delay);

        for (let i = 1; i < sorted.length; i++) {
            setActiveIdx(i);
            const current = sorted[i];
            const lastMerged = res[res.length - 1];

            setMessage(`Checking [${current.join(',')}] against last merged [${lastMerged.join(',')}].`);
            setCurrentInterval(current);
            await sleep(delay);

            if (current[0] <= lastMerged[1]) {
                // Overlap
                setMessage(`Overlap detected! (${current[0]} <= ${lastMerged[1]}). Merging...`);
                lastMerged[1] = Math.max(lastMerged[1], current[1]);
                // Visual update triggers automatically due to reference update in 'res', but we need to set state
                setResult([...res]);
            } else {
                // No overlap
                setMessage(`No overlap. Adding [${current.join(',')}] to result.`);
                res.push(current);
                setResult([...res]);
            }
            await sleep(delay);
        }

        setMessage('Merge Completed!');
        setIsFinished(true);
        setIsRunning(false);
        setActiveIdx(-1);
        setCurrentInterval(null);
    };

    const scale = (val) => val * 25 + 20;

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <button
                    onClick={runMerge}
                    disabled={isRunning || isFinished}
                    style={{
                        padding: '0.5rem 1rem',
                        background: 'var(--accent-primary)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        opacity: (isRunning || isFinished) ? 0.5 : 1,
                        color: 'black',
                        fontWeight: 'bold'
                    }}
                >
                    Merge
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '1rem', height: '3rem', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{
                height: '350px',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)',
                position: 'relative',
                overflow: 'hidden',
                padding: '20px'
            }}>
                {/* Sorted Input View */}
                <div style={{ marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Sorted Intervals (Processing Order):</div>
                    <svg width="100%" height="60">
                        <line x1="10" y1="50" x2="580" y2="50" stroke="#444" strokeWidth="1" />
                        {(sortedInput.length > 0 ? sortedInput : input).map((int, idx) => {
                            const isActive = idx === activeIdx && isRunning;
                            return (
                                <g key={idx}>
                                    <rect
                                        x={scale(int[0])} y="15"
                                        width={scale(int[1]) - scale(int[0])} height="30"
                                        fill={isActive ? '#e67e22' : '#3498db'}
                                        rx="4"
                                        opacity={isActive ? 1 : 0.6}
                                    />
                                    <text x={scale(int[0]) + (scale(int[1]) - scale(int[0])) / 2} y="35" textAnchor="middle" fill="white" fontSize="12px">{`[${int[0]},${int[1]}]`}</text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Result Construction View */}
                <div>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Result List (Merged):</div>
                    <svg width="100%" height="80">
                        <line x1="10" y1="50" x2="580" y2="50" stroke="#444" strokeWidth="1" />
                        {result.map((int, idx) => {
                            // Last interval in result is potentially being merged into
                            const isMergingTarget = idx === result.length - 1 && isRunning && activeIdx > 0;
                            return (
                                <motion.g key={idx} layout>
                                    <rect
                                        x={scale(int[0])} y="15"
                                        width={scale(int[1]) - scale(int[0])} height="30"
                                        fill={isMergingTarget ? '#f1c40f' : '#2ecc71'}
                                        rx="4"
                                    />
                                    <text x={scale(int[0]) + (scale(int[1]) - scale(int[0])) / 2} y="35" textAnchor="middle" fill="black" fontWeight="bold" fontSize="12px">{`[${int[0]},${int[1]}]`}</text>
                                </motion.g>
                            );
                        })}
                    </svg>
                </div>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
                X-Axis Scale: 1 unit = 25px
            </div>
        </div>
    );
};

export default MergeIntervalsVisualizer;
