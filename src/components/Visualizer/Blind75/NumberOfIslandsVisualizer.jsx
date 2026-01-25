import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NumberOfIslandsVisualizer = () => {
    // 1 = Land, 0 = Water
    const [grid, setGrid] = useState([
        [1, 1, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 1]
    ]);
    const [visited, setVisited] = useState(new Set()); // "r-c"
    const [islandCount, setIslandCount] = useState(0);
    const [message, setMessage] = useState('Click cells to toggle land. Click Start to count islands.');
    const [isFinished, setIsFinished] = useState(false);
    const [activeCell, setActiveCell] = useState(null); // "r-c"

    const m = grid.length;
    const n = grid[0].length;

    const reset = () => {
        setVisited(new Set());
        setIslandCount(0);
        setActiveCell(null);
        setIsFinished(false);
        setMessage('Ready.');
    };

    const toggleCell = (r, c) => {
        if (isFinished) return;
        const newGrid = grid.map(row => [...row]);
        newGrid[r][c] = newGrid[r][c] === 1 ? 0 : 1;
        setGrid(newGrid);
        reset(); // Reset visited state if grid changes
    };

    const runCount = async () => {
        reset();
        await new Promise(r => setTimeout(r, 100)); // Allow reset to render

        setIsFinished(false);
        const visitedSet = new Set();
        let count = 0;

        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));

        const bfs = async (startR, startC) => {
            const queue = [[startR, startC]];
            visitedSet.add(`${startR}-${startC}`);
            setVisited(new Set(visitedSet));

            while (queue.length > 0) {
                const [r, c] = queue.shift();
                setActiveCell(`${r}-${c}`);
                await sleep(50); // Fast expansion

                for (let [dr, dc] of directions) {
                    const nr = r + dr;
                    const nc = c + dc;
                    const key = `${nr}-${nc}`;

                    if (nr >= 0 && nr < m && nc >= 0 && nc < n &&
                        grid[nr][nc] === 1 && !visitedSet.has(key)) {
                        visitedSet.add(key);
                        queue.push([nr, nc]);
                        setVisited(new Set(visitedSet));
                    }
                }
            }
        };

        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (grid[i][j] === 1 && !visitedSet.has(`${i}-${j}`)) {
                    count++;
                    setIslandCount(count);
                    setMessage(`Found Island #${count} starting at [${i},${j}]. Exploring...`);
                    await bfs(i, j);
                }
            }
        }

        setActiveCell(null);
        setIsFinished(true);
        setMessage(`Finished! Total Islands: ${count}`);
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <button
                    onClick={runCount}
                    disabled={isFinished || activeCell !== null} // Simple lock
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: (isFinished || activeCell) ? 0.5 : 1 }}
                >
                    Start Count
                </button>
                <button
                    onClick={() => {
                        setGrid([
                            [1, 1, 0, 0, 0],
                            [1, 1, 0, 0, 0],
                            [0, 0, 1, 0, 0],
                            [0, 0, 0, 1, 1]
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

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 50px)`, gap: '4px', justifyContent: 'center' }}>
                {grid.map((row, r) => (
                    row.map((val, c) => {
                        const key = `${r}-${c}`;
                        // Visual Logic:
                        // Land (1) = Green
                        // Water (0) = Dark Blue
                        // Visited Land = Highlighted Green

                        let bg = val === 1 ? '#2ecc71' : '#2c3e50';
                        if (val === 1 && visited.has(key)) {
                            bg = '#27ae60'; // Darker green/processed
                        }

                        const isActive = activeCell === key;

                        return (
                            <motion.div
                                key={key}
                                onClick={() => toggleCell(r, c)}
                                animate={{
                                    scale: isActive ? 1.2 : 1,
                                    backgroundColor: bg,
                                    border: isActive ? '2px solid white' : '1px solid #333'
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
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
                Click cells to toggle Land (Green)/Water (Blue).
            </div>
        </div>
    );
};

export default NumberOfIslandsVisualizer;
