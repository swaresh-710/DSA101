import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PacificAtlanticVisualizer = () => {
    const [grid, setGrid] = useState([
        [1, 2, 2, 3, 5],
        [3, 2, 3, 4, 4],
        [2, 4, 5, 3, 1],
        [6, 7, 1, 4, 5],
        [5, 1, 1, 2, 4]
    ]);
    const [pacificReachable, setPacificReachable] = useState([]); // Array of strings "r-c"
    const [atlanticReachable, setAtlanticReachable] = useState([]);
    const [phase, setPhase] = useState('idle'); // 'idle', 'pacific', 'atlantic', 'result'
    const [message, setMessage] = useState('Click Start to simulate water flow.');
    const [isFinished, setIsFinished] = useState(false);

    const m = grid.length;
    const n = grid[0].length;

    const reset = () => {
        setPacificReachable([]);
        setAtlanticReachable([]);
        setPhase('idle');
        setIsFinished(false);
        setMessage('Ready.');
    };

    const bfs = (starts) => {
        const queue = [...starts]; // [r, c]
        const reachable = new Set();
        starts.forEach(([r, c]) => reachable.add(`${r}-${c}`));

        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        const newReachable = [...starts.map(([r, c]) => `${r}-${c}`)];

        // We can't visualize step-by-step easily inside a sync function without a loop/generator.
        // For this visualizer, let's just compute the whole set for the phase to show the "Flow".
        // Or we could animate the flow. Let's compute it all but maybe show delay?
        // Simpler for now: calculate all reachable for this ocean.

        let head = 0;
        while (head < queue.length) {
            const [r, c] = queue[head++];

            for (let [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;

                if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                    const key = `${nr}-${nc}`;
                    if (!reachable.has(key)) {
                        // Water flows UPHILL from ocean (since we started at ocean)
                        // Wait, problem says water flows from high to low/equal.
                        // So if we start at ocean and go inwards, we must move to cells with height >= current.
                        if (grid[nr][nc] >= grid[r][c]) {
                            reachable.add(key);
                            queue.push([nr, nc]);
                            newReachable.push(key);
                        }
                    }
                }
            }
        }
        return newReachable;
    };

    const handleNext = () => {
        if (phase === 'idle') {
            setPhase('pacific');
            // Pacific starts: Top row and Left col
            const starts = [];
            for (let i = 0; i < m; i++) starts.push([i, 0]);
            for (let j = 0; j < n; j++) starts.push([0, j]); // 0,0 dup handled by Set logic if we used set, here we just push

            const reachable = bfs(starts);
            setPacificReachable(reachable);
            setMessage(`Processing Pacific Ocean (Blue). Water flows from Ocean (Top/Left) inwards to higher ground.\nFound ${reachable.length} reachable cells.`);
        } else if (phase === 'pacific') {
            setPhase('atlantic');
            // Atlantic starts: Bottom row and Right col
            const starts = [];
            for (let i = 0; i < m; i++) starts.push([i, n - 1]);
            for (let j = 0; j < n; j++) starts.push([m - 1, j]);

            const reachable = bfs(starts);
            setAtlanticReachable(reachable);
            setMessage(`Processing Atlantic Ocean (Red). Water flows from Ocean (Bottom/Right) inwards to higher ground.\nFound ${reachable.length} reachable cells.`);
        } else if (phase === 'atlantic') {
            setPhase('result');
            // Intersection
            const pSet = new Set(pacificReachable);
            const aSet = new Set(atlanticReachable);
            const intersection = [...pSet].filter(x => aSet.has(x));

            setMessage(`Finished! Intersection (Purple) cells can flow to BOTH oceans.\nCount: ${intersection.length}.`);
            setIsFinished(true);
        }
    };

    return (
        <div style={{ padding: '1rem', color: 'white' }}>
            <div className="visualizer-controls">
                <button
                    onClick={handleNext}
                    disabled={isFinished}
                    style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isFinished ? 0.5 : 1 }}
                >
                    {phase === 'idle' ? 'Start Pacific Flow' : phase === 'pacific' ? 'Start Atlantic Flow' : phase === 'atlantic' ? 'Show Result' : 'Finished'}
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

            <div style={{ position: 'relative', display: 'inline-block', padding: '20px' }}>
                {/* Pacific Borders */}
                <div style={{ position: 'absolute', top: 0, left: '20px', width: '100%', height: '5px', background: '#3498db' }}></div>
                <div style={{ position: 'absolute', top: '20px', left: 0, width: '5px', height: '100%', background: '#3498db' }}></div>

                {/* Atlantic Borders */}
                <div style={{ position: 'absolute', bottom: 0, left: '20px', width: '100%', height: '5px', background: '#e74c3c' }}></div>
                <div style={{ position: 'absolute', top: '20px', right: 0, width: '5px', height: '100%', background: '#e74c3c' }}></div>

                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 50px)`, gap: '4px', margin: '10px' }}>
                    {grid.map((row, r) => (
                        row.map((val, c) => {
                            const key = `${r}-${c}`;
                            const isPacific = pacificReachable.includes(key);
                            const isAtlantic = atlanticReachable.includes(key);

                            let bg = '#222';
                            if (phase === 'result') {
                                if (isPacific && isAtlantic) bg = '#9b59b6'; // Purple
                                else if (isPacific) bg = 'rgba(52, 152, 219, 0.3)';
                                else if (isAtlantic) bg = 'rgba(231, 76, 60, 0.3)';
                            } else {
                                if (phase === 'pacific' && isPacific) bg = '#3498db';
                                if (phase === 'atlantic' && isAtlantic) bg = '#e74c3c';
                                // During atlantic phase, keep pacific faint?
                                if (phase === 'atlantic' && isPacific) bg = 'rgba(52, 152, 219, 0.3)';
                            }

                            return (
                                <motion.div
                                    key={key}
                                    animate={{ backgroundColor: bg }}
                                    style={{
                                        width: '50px', height: '50px',
                                        borderRadius: '4px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 'bold', color: 'white',
                                        border: '1px solid #333'
                                    }}
                                >
                                    {val}
                                </motion.div>
                            );
                        })
                    ))}
                </div>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                Values represent height. Water flows to lower or equal height neighbors.<br />
                We solve backwards: Start from oceans and flow "uphill" to higher or equal neighbors.
            </div>
        </div>
    );
};

export default PacificAtlanticVisualizer;
