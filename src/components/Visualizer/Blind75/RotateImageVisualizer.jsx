import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RotateImageVisualizer = () => {
    // 4x4 Initial Matrix
    const initialGrid = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16]
    ];

    const [grid, setGrid] = useState(initialGrid);
    const [message, setMessage] = useState('Click Start to rotate 90 degrees clockwise.');
    const [isFinished, setIsFinished] = useState(false);
    const [activeCells, setActiveCells] = useState([]); // Array of "r-c" keys
    const [isRunning, setIsRunning] = useState(false);

    const n = grid.length;

    const reset = () => {
        setGrid([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 16]
        ]);
        setActiveCells([]);
        setIsFinished(false);
        setIsRunning(false);
        setMessage('Ready.');
    };

    const runRotation = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setMessage('Starting 90 degree clockwise rotation...');

        const currentGrid = grid.map(row => [...row]);
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const delay = 800;

        // Layer by layer
        let left = 0;
        let right = n - 1;

        while (left < right) {
            const top = left;
            const bottom = right;

            setMessage(`Processing Layer: Top:${top}, Bottom:${bottom}, Left:${left}, Right:${right}`);
            await sleep(500);

            for (let i = 0; i < (right - left); i++) {
                // Determine 4 coordinates involved in rotation
                // Top-Left: [top][left + i]
                // Top-Right: [top + i][right]
                // Bottom-Right: [bottom][right - i]
                // Bottom-Left: [bottom - i][left]

                const p1 = { r: top, c: left + i };
                const p2 = { r: top + i, c: right };
                const p3 = { r: bottom, c: right - i };
                const p4 = { r: bottom - i, c: left };

                setActiveCells([
                    `${p1.r}-${p1.c}`,
                    `${p2.r}-${p2.c}`,
                    `${p3.r}-${p3.c}`,
                    `${p4.r}-${p4.c}`
                ]);

                setMessage(`Rotating Group ${i + 1}: storing Top-Left (${currentGrid[p1.r][p1.c]}) in Temp.`);
                await sleep(delay);

                // Save top-left
                let topLeft = currentGrid[p1.r][p1.c];

                // Move bottom-left to top-left
                currentGrid[p1.r][p1.c] = currentGrid[p4.r][p4.c];
                setGrid(currentGrid.map(row => [...row]));
                setMessage('Moved Bottom-Left to Top-Left.');
                await sleep(delay / 2);

                // Move bottom-right to bottom-left
                currentGrid[p4.r][p4.c] = currentGrid[p3.r][p3.c];
                setGrid(currentGrid.map(row => [...row]));
                setMessage('Moved Bottom-Right to Bottom-Left.');
                await sleep(delay / 2);

                // Move top-right to bottom-right
                currentGrid[p3.r][p3.c] = currentGrid[p2.r][p2.c];
                setGrid(currentGrid.map(row => [...row]));
                setMessage('Moved Top-Right to Bottom-Right.');
                await sleep(delay / 2);

                // Move top-left (temp) to top-right
                currentGrid[p2.r][p2.c] = topLeft;
                setGrid(currentGrid.map(row => [...row]));
                setMessage('Moved Temp (Old Top-Left) to Top-Right.');
                await sleep(delay);
            }
            left++;
            right--;
        }

        setActiveCells([]);
        setIsRunning(false);
        setIsFinished(true);
        setMessage('Rotation Complete!');
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <button
                    onClick={runRotation}
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
                    Rotate 90&deg;
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

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 60px)`, gap: '4px' }}>
                    {grid.map((row, r) => (
                        row.map((val, c) => {
                            const key = `${r}-${c}`;
                            // Check if this cell is one of the 4 active rotating cells
                            const activeIndex = activeCells.indexOf(key);
                            const isActive = activeIndex !== -1;

                            // Assign different colors to the 4 corners of rotation for clarity
                            let bg = '#2c3e50';
                            let borderColor = '#333';

                            if (isActive) {
                                borderColor = 'white';
                                if (activeIndex === 0) bg = '#e74c3c'; // Top-Left (Red)
                                if (activeIndex === 1) bg = '#3498db'; // Top-Right (Blue)
                                if (activeIndex === 2) bg = '#f1c40f'; // Bottom-Right (Yellow)
                                if (activeIndex === 3) bg = '#2ecc71'; // Bottom-Left (Green)
                            }

                            if (isFinished) {
                                bg = '#8e44ad'; // Purple when done
                            }

                            return (
                                <motion.div
                                    key={key} // Key needs to be stable or item movement won't animate gracefully but here values change in place
                                    layout // This might help if we were moving components, but we are changing values. 
                                    animate={{
                                        scale: isActive ? 1.1 : 1,
                                        backgroundColor: bg,
                                        border: `2px solid ${borderColor}`
                                    }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        width: '60px', height: '60px',
                                        borderRadius: '4px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 'bold', fontSize: '1.2rem'
                                    }}
                                >
                                    {val}
                                </motion.div>
                            );
                        })
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#999' }}>
                Algorithm: Rotate layers from outside in (Layer by Layer approach)
            </div>
        </div>
    );
};

export default RotateImageVisualizer;
