import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SetMatrixZeroesVisualizer = () => {
    const [grid, setGrid] = useState([
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1]
    ]);
    const [zeroRows, setZeroRows] = useState(new Set());
    const [zeroCols, setZeroCols] = useState(new Set());
    const [message, setMessage] = useState('Click cells to toggle 0/1. Click Start to run.');
    const [isFinished, setIsFinished] = useState(false);
    const [activeCell, setActiveCell] = useState(null); // "r-c"
    const [scanning, setScanning] = useState(false);

    const m = grid.length;
    const n = grid[0].length;

    const reset = () => {
        setZeroRows(new Set());
        setZeroCols(new Set());
        setActiveCell(null);
        setIsFinished(false);
        setScanning(false);
        setMessage('Ready.');
    };

    const toggleCell = (r, c) => {
        if (scanning || isFinished) return;
        const newGrid = grid.map(row => [...row]);
        newGrid[r][c] = newGrid[r][c] === 1 ? 0 : 1;
        setGrid(newGrid);
        reset();
    };

    const runVisualizer = async () => {
        reset();
        setScanning(true);
        setMessage('Pass 1: Finding 0s...');

        const rows = new Set();
        const cols = new Set();
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));

        // Pass 1: Find Zeros
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                setActiveCell(`${i}-${j}`);
                await sleep(200);

                if (grid[i][j] === 0) {
                    rows.add(i);
                    cols.add(j);
                    setZeroRows(new Set(rows));
                    setZeroCols(new Set(cols));
                    setMessage(`Found 0 at [${i},${j}]. Marking Row ${i} and Col ${j}.`);
                    await sleep(400);
                }
            }
        }

        setMessage('Pass 2: Setting identified rows and cols to 0...');
        await sleep(500);

        // Pass 2: Set Zeros
        const newGrid = grid.map(row => [...row]);

        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                setActiveCell(`${i}-${j}`);

                if (rows.has(i) || cols.has(j)) {
                    if (newGrid[i][j] !== 0) {
                        newGrid[i][j] = 0;
                        setGrid([...newGrid]); // Trigger re-render
                        setMessage(`Setting [${i},${j}] to 0 because it's in a marked row/col.`);
                        await sleep(200);
                    }
                } else {
                    await sleep(50);
                }
            }
        }

        setActiveCell(null);
        setScanning(false);
        setIsFinished(true);
        setMessage('Finished!');
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <button
                    onClick={runVisualizer}
                    disabled={scanning || isFinished}
                    style={{
                        padding: '0.5rem 1rem',
                        background: 'var(--accent-primary)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        opacity: (scanning || isFinished) ? 0.5 : 1,
                        color: 'black',
                        fontWeight: 'bold'
                    }}
                >
                    Start
                </button>
                <button
                    onClick={() => {
                        setGrid([
                            [1, 1, 1],
                            [1, 0, 1],
                            [1, 1, 1]
                        ]);
                        reset();
                    }}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset Grid
                </button>
            </div>

            <div style={{ marginBottom: '2rem', height: '1.5rem', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 50px)`, gap: '4px' }}>
                    {grid.map((row, r) => (
                        row.map((val, c) => {
                            const key = `${r}-${c}`;
                            const isZero = val === 0;
                            const isMarked = zeroRows.has(r) || zeroCols.has(c);
                            const isActive = activeCell === key;

                            let bg = '#2c3e50'; // Default
                            if (isZero) bg = '#e74c3c'; // Red for original 0
                            else if (isMarked && isFinished) bg = '#e67e22'; // Orange if turned to 0

                            // While scanning, show potential targets
                            if (scanning && isMarked && !isZero) {
                                bg = '#34495e'; // Darker blue to indicate "will be 0"
                            }

                            if (val === 0 && isFinished) bg = '#e74c3c'; // Keep final zeros red? Or maybe orange? Let's stick to red for "is 0"

                            return (
                                <motion.div
                                    key={key}
                                    onClick={() => toggleCell(r, c)}
                                    animate={{
                                        scale: isActive ? 1.2 : 1,
                                        backgroundColor: val === 0 ? '#e74c3c' : (isMarked && scanning ? '#95a5a6' : '#2c3e50'), // Dynamic coloring
                                        opacity: (isMarked && !isZero) ? 0.7 : 1, // Dim rows/cols that will be zeroed
                                        border: isActive ? '2px solid white' : (zeroRows.has(r) || zeroCols.has(c) ? '2px dashed #f1c40f' : '1px solid #333')
                                    }}
                                    style={{
                                        width: '50px', height: '50px',
                                        borderRadius: '4px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 'bold', color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {val}
                                </motion.div>
                            );
                        })
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                <div style={{ color: '#f1c40f' }}>Marked Rows: {[...zeroRows].join(', ')}</div>
                <div style={{ color: '#f1c40f' }}>Marked Cols: {[...zeroCols].join(', ')}</div>
            </div>
        </div>
    );
};

export default SetMatrixZeroesVisualizer;
