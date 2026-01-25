import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NonOverlappingIntervalsVisualizer = () => {
    // Input: [[1,2],[2,3],[3,4],[1,3]]
    // Sorted by End: [1,2], [2,3], [3,4], [1,3] <- Wait, [1,3] end is 3. Sort: [1,2], [2,3], [1,3], [3,4] (Stable sort/Start tiebreak)
    // Actually Greedy Strategy: Sort by END time.
    // [1,2] (End 2)
    // [2,3] (End 3)
    // [1,3] (End 3)
    // [3,4] (End 4)

    // Step 1: Pick [1,2]. End = 2.
    // Step 2: Next [2,3]. Start 2 >= End 2. Compatible. Pick. End = 3.
    // Step 3: Next [1,3]. Start 1 < End 3. Conflict. Remove. (Count = 1)
    // Step 4: Next [3,4]. Start 3 >= End 3. Compatible. Pick. End = 4.
    // Result: Removed 1.

    const [input, setInput] = useState([[1, 2], [2, 3], [3, 4], [1, 3]]);
    const [sortedInput, setSortedInput] = useState([]);
    const [removedCount, setRemovedCount] = useState(0);
    const [keptIntervals, setKeptIntervals] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(-1);
    const [lastEnd, setLastEnd] = useState(-Infinity);
    const [message, setMessage] = useState('Click Start to count removals.');
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setSortedInput([]);
        setRemovedCount(0);
        setKeptIntervals([]);
        setCurrentIdx(-1);
        setLastEnd(-Infinity);
        setIsFinished(false);
        setIsRunning(false);
        setMessage('Ready.');
    };

    const runGreedy = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setRemovedCount(0);
        setKeptIntervals([]);

        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const delay = 1000;

        setMessage('Sorting intervals by END time...');
        const sorted = [...input].sort((a, b) => a[1] - b[1]);
        setSortedInput(sorted);
        await sleep(delay);

        let end = -Infinity;
        let count = 0;
        const kept = [];

        for (let i = 0; i < sorted.length; i++) {
            setCurrentIdx(i);
            const current = sorted[i];

            if (current[0] >= end) {
                // Compatible
                setMessage(`[${current.join(',')}] starts after last end (${end}). KEPT.`);
                end = current[1];
                setLastEnd(end);
                kept.push(current);
                setKeptIntervals([...kept]);
            } else {
                // Overlap
                setMessage(`[${current.join(',')}] overlaps with last end (${end}). REMOVE.`);
                count++;
                setRemovedCount(count);
            }
            await sleep(delay);
        }

        setMessage(`Finished! Total removed: ${count}.`);
        setIsFinished(true);
        setIsRunning(false);
        setCurrentIdx(-1);
    };

    const scale = (val) => val * 50 + 20;

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <button onClick={runGreedy} disabled={isRunning || isFinished} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: (isRunning || isFinished) ? 0.5 : 1, color: 'black', fontWeight: 'bold' }}>
                    Start Greedy
                </button>
                <button onClick={reset} style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '1rem', height: '3rem', color: 'var(--accent-secondary)' }}>{message}</div>

            <div style={{ height: '350px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden', padding: '20px' }}>
                <div style={{ marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Sorted by End Time:</div>
                    <svg width="100%" height="60">
                        <line x1="10" y1="50" x2="580" y2="50" stroke="#444" strokeWidth="1" />
                        {(sortedInput.length > 0 ? sortedInput : input).map((int, idx) => {
                            const isActive = idx === currentIdx;
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

                <div>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Kept Intervals:</div>
                    <svg width="100%" height="60">
                        <line x1="10" y1="50" x2="580" y2="50" stroke="#444" strokeWidth="1" />
                        {keptIntervals.map((int, idx) => (
                            <motion.g key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                                <rect
                                    x={scale(int[0])} y="15"
                                    width={scale(int[1]) - scale(int[0])} height="30"
                                    fill="#2ecc71"
                                    rx="4"
                                />
                                <text x={scale(int[0]) + (scale(int[1]) - scale(int[0])) / 2} y="35" textAnchor="middle" fill="black" fontWeight="bold" fontSize="12px">{`[${int[0]},${int[1]}]`}</text>
                            </motion.g>
                        ))}
                    </svg>
                </div>

                <div style={{ marginTop: '20px', fontSize: '1.2rem', fontWeight: 'bold', color: '#e74c3c' }}>
                    Removed Count: {removedCount}
                </div>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
                Greedy Choice: Always pick interval with earliest end time to maximize remaining space.
            </div>
        </div>
    );
};

export default NonOverlappingIntervalsVisualizer;
