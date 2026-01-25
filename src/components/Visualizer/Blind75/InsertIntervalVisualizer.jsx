import React, { useState } from 'react';
import { motion } from 'framer-motion';

const InsertIntervalVisualizer = () => {
    // Initial intervals: [[1, 3], [6, 9]]
    // New Interval: [2, 5]
    // Expected Result: [[1, 5], [6, 9]]

    // Another case: [[1,2],[3,5],[6,7],[8,10],[12,16]], new: [4,8] -> [[1,2],[3,10],[12,16]]

    // Let's use a simpler case for clarity
    const [intervals, setIntervals] = useState([[1, 3], [6, 9]]);
    const [newInterval, setNewInterval] = useState([2, 5]);

    const [result, setResult] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); // Index in original intervals
    const [mergedInterval, setMergedInterval] = useState(null); // The accumulating new interval during merge
    const [message, setMessage] = useState('Click Start to insert new interval.');
    const [isFinished, setIsFinished] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const reset = () => {
        setResult([]);
        setCurrentIndex(0);
        setMergedInterval(null); // Reset to input newInterval at start of run
        setIsFinished(false);
        setIsRunning(false);
        setMessage('Ready.');
    };

    const runInsertion = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setResult([]);

        let i = 0;
        const n = intervals.length;
        let currentNew = [...newInterval]; // Local copy for logic
        setMergedInterval(currentNew);

        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const delay = 1000;

        setMessage(`Inserting [${currentNew.join(',')}] into sorted intervals...`);
        await sleep(delay);

        // 1. Add all intervals ending before newInterval starts
        while (i < n && intervals[i][1] < currentNew[0]) {
            setMessage(`Interval [${intervals[i].join(',')}] ends before [${currentNew.join(',')}] starts. Add to result.`);
            setCurrentIndex(i);
            setResult(prev => [...prev, intervals[i]]);
            i++;
            await sleep(delay);
        }

        // 2. Merge overlapping intervals
        while (i < n && intervals[i][0] <= currentNew[1]) {
            setMessage(`Overlapping [${intervals[i].join(',')}] with [${currentNew.join(',')}]. Merging...`);
            setCurrentIndex(i);

            // Visual merge effect
            currentNew[0] = Math.min(currentNew[0], intervals[i][0]);
            currentNew[1] = Math.max(currentNew[1], intervals[i][1]);
            setMergedInterval([...currentNew]); // Update visual

            i++;
            await sleep(delay);
        }
        setMessage(`No more overlaps. Added merged interval [${currentNew.join(',')}] to result.`);
        setResult(prev => [...prev, currentNew]);
        await sleep(delay);

        // 3. Add remaining intervals
        while (i < n) {
            setMessage(`Adding remaining interval [${intervals[i].join(',')}].`);
            setCurrentIndex(i);
            setResult(prev => [...prev, intervals[i]]);
            i++;
            await sleep(delay);
        }

        setMessage('Insertion Complete!');
        setIsFinished(true);
        setIsRunning(false);
        setCurrentIndex(-1);
    };

    // Scaling helper
    const scale = (val) => val * 40 + 20;

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <button
                    onClick={runInsertion}
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
                    Insert
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
                height: '300px',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)',
                position: 'relative',
                overflow: 'hidden',
                padding: '20px'
            }}>
                <div style={{ marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Input Intervals:</div>
                    <svg width="100%" height="60">
                        {/* Axis line */}
                        <line x1="10" y1="50" x2="580" y2="50" stroke="#444" strokeWidth="1" />
                        {intervals.map((int, idx) => {
                            const isActive = idx === currentIndex && isRunning;
                            return (
                                <g key={idx}>
                                    <rect
                                        x={scale(int[0])} y="15"
                                        width={scale(int[1]) - scale(int[0])} height="30"
                                        fill={isActive ? '#e67e22' : '#3498db'}
                                        rx="4"
                                    />
                                    <text x={scale(int[0]) + (scale(int[1]) - scale(int[0])) / 2} y="35" textAnchor="middle" fill="white" fontSize="12px">{`[${int[0]},${int[1]}]`}</text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                <div style={{ marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Processing New Interval / Merged State:</div>
                    <svg width="100%" height="60">
                        <line x1="10" y1="50" x2="580" y2="50" stroke="#444" strokeWidth="1" />
                        {(isRunning ? mergedInterval : newInterval) && (
                            <motion.g
                                animate={{
                                    x: 0 // Just using React state updates for position logic, simple enough
                                }}
                            >
                                {(() => {
                                    const int = isRunning && mergedInterval ? mergedInterval : newInterval;
                                    return (
                                        <g>
                                            <rect
                                                x={scale(int[0])} y="15"
                                                width={scale(int[1]) - scale(int[0])} height="30"
                                                fill="#f1c40f"
                                                rx="4"
                                            />
                                            <text x={scale(int[0]) + (scale(int[1]) - scale(int[0])) / 2} y="35" textAnchor="middle" fill="black" fontWeight="bold" fontSize="12px">{`[${int[0]},${int[1]}]`}</text>
                                        </g>
                                    );
                                })()}
                            </motion.g>
                        )}
                    </svg>
                </div>

                <div>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Result List:</div>
                    <svg width="100%" height="60">
                        <line x1="10" y1="50" x2="580" y2="50" stroke="#444" strokeWidth="1" />
                        {result.map((int, idx) => (
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
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
                X-Axis Scale: 1 unit = 40px
            </div>
        </div>
    );
};

export default InsertIntervalVisualizer;
