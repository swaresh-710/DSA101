import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SpiralMatrixVisualizer = () => {
    const [grid] = useState([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16]
    ]);
    const [visited, setVisited] = useState(new Set()); // "r-c"
    const [path, setPath] = useState([]); // Array of visited values in order
    const [message, setMessage] = useState('Click Start to run spiral traversal.');
    const [isFinished, setIsFinished] = useState(false);
    const [activeCell, setActiveCell] = useState(null); // "r-c"
    const [isRunning, setIsRunning] = useState(false);

    const m = grid.length;
    const n = grid[0].length;

    const reset = () => {
        setVisited(new Set());
        setPath([]);
        setActiveCell(null);
        setIsFinished(false);
        setIsRunning(false);
        setMessage('Ready.');
    };

    const runVisualizer = async () => {
        reset();
        setIsRunning(true);
        setMessage('Starting traversal...');

        const newVisited = new Set();
        const newPath = [];
        let top = 0;
        let bottom = m - 1;
        let left = 0;
        let right = n - 1;

        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const delay = 300;

        while (top <= bottom && left <= right) {
            // Traverse Right
            for (let i = left; i <= right; i++) {
                setActiveCell(`${top}-${i}`);
                newVisited.add(`${top}-${i}`);
                setVisited(new Set(newVisited));
                newPath.push(grid[top][i]);
                setPath([...newPath]);
                setMessage(`Go Right: Visiting [${top},${i}]`);
                await sleep(delay);
            }
            top++;

            // Traverse Down
            for (let i = top; i <= bottom; i++) {
                setActiveCell(`${i}-${right}`);
                newVisited.add(`${i}-${right}`);
                setVisited(new Set(newVisited));
                newPath.push(grid[i][right]);
                setPath([...newPath]);
                setMessage(`Go Down: Visiting [${i},${right}]`);
                await sleep(delay);
            }
            right--;

            // Traverse Left
            if (top <= bottom) {
                for (let i = right; i >= left; i--) {
                    setActiveCell(`${bottom}-${i}`);
                    newVisited.add(`${bottom}-${i}`);
                    setVisited(new Set(newVisited));
                    newPath.push(grid[bottom][i]);
                    setPath([...newPath]);
                    setMessage(`Go Left: Visiting [${bottom},${i}]`);
                    await sleep(delay);
                }
                bottom--;
            }

            // Traverse Up
            if (left <= right) {
                for (let i = bottom; i >= top; i--) {
                    setActiveCell(`${i}-${left}`);
                    newVisited.add(`${i}-${left}`);
                    setVisited(new Set(newVisited));
                    newPath.push(grid[i][left]);
                    setPath([...newPath]);
                    setMessage(`Go Up: Visiting [${i},${left}]`);
                    await sleep(delay);
                }
                left++;
            }
        }

        setActiveCell(null);
        setIsRunning(false);
        setIsFinished(true);
        setMessage('Spiral Traversal Finished!');
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <button
                    onClick={runVisualizer}
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
                    Start Spiral
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
            </div>

            <div style={{ marginBottom: '2rem', height: '1.5rem', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 50px)`, gap: '4px' }}>
                    {grid.map((row, r) => (
                        row.map((val, c) => {
                            const key = `${r}-${c}`;
                            const isVisited = visited.has(key);
                            const isActive = activeCell === key;

                            return (
                                <motion.div
                                    key={key}
                                    animate={{
                                        scale: isActive ? 1.2 : 1,
                                        backgroundColor: isActive ? '#f1c40f' : (isVisited ? '#34495e' : '#2c3e50'), // Yellow active, dark processed, base default
                                        color: isActive ? '#000' : '#fff',
                                        border: isActive ? '2px solid white' : '1px solid #333'
                                    }}
                                    style={{
                                        width: '50px', height: '50px',
                                        borderRadius: '4px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {val}
                                </motion.div>
                            );
                        })
                    ))}
                </div>

                <div style={{ width: '200px', padding: '1rem', border: '1px solid #333', borderRadius: '4px' }}>
                    <h4 style={{ margin: '0 0 1rem 0' }}>Output Order:</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {path.map((val, idx) => (
                            <motion.span
                                key={idx}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    padding: '4px 8px',
                                    background: '#7f8c8d',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {val}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpiralMatrixVisualizer;
