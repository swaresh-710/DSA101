import React, { useState } from 'react';
import { motion } from 'framer-motion';

const UniquePathsVisualizer = () => {
    const [m, setM] = useState(3);
    const [n, setN] = useState(7);
    const [dp, setDp] = useState([]); // 2D array
    const [row, setRow] = useState(0);
    const [col, setCol] = useState(0);
    const [message, setMessage] = useState('Click Start to count paths.');
    const [isFinished, setIsFinished] = useState(false);

    const reset = () => {
        setDp([]);
        setRow(0);
        setCol(0);
        setIsFinished(false);
        setMessage('Ready.');
    };

    const handleStep = () => {
        if (isFinished) return;

        // Init logic
        if (dp.length === 0) {
            const newDp = Array(m).fill().map(() => Array(n).fill(0));
            // Base case: first row and first col is 1
            // Actually standard DP: dp[i][j] = dp[i-1][j] + dp[i][j-1]
            // We can iterate row by row.
            // Let's visualize cell by cell.
            setDp(newDp);
            setRow(0);
            setCol(0);
            setMessage('Initialized Grid.');
            return;
        }

        if (row < m) {
            const newDp = dp.map(r => [...r]); // Copy grid

            if (row === 0 || col === 0) {
                newDp[row][col] = 1;
                setMessage(`Cell [${row}][${col}]: Base case (1 way).`);
            } else {
                const limitTop = newDp[row - 1][col];
                const limitLeft = newDp[row][col - 1];
                newDp[row][col] = limitTop + limitLeft;
                setMessage(`Cell [${row}][${col}]: Top (${limitTop}) + Left (${limitLeft}) = ${newDp[row][col]} ways.`);
            }

            setDp(newDp);

            // Next cell
            let nextCol = col + 1;
            let nextRow = row;
            if (nextCol >= n) {
                nextCol = 0;
                nextRow = row + 1;
            }

            setCol(nextCol);
            setRow(nextRow);

            if (nextRow >= m) {
                setIsFinished(true);
                // setMessage comes after specific update above, but we need final success message
                setTimeout(() => setMessage(`Finished! Total unique paths: ${newDp[m - 1][n - 1]}.`), 0);
            }
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
                    {dp.length === 0 ? 'Start' : 'Next Cell'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>Rows:</label>
                    <input
                        type="number"
                        value={m}
                        onChange={(e) => { setM(Math.min(10, Math.max(1, parseInt(e.target.value) || 1))); reset(); }}
                        style={{ width: '50px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                    <label>Cols:</label>
                    <input
                        type="number"
                        value={n}
                        onChange={(e) => { setN(Math.min(10, Math.max(1, parseInt(e.target.value) || 1))); reset(); }}
                        style={{ width: '50px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '2rem', height: '1.5rem', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            {/* Grid Visualization */}
            {dp.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 50px)`, gap: '4px' }}>
                    {dp.map((r, rIdx) => (
                        r.map((val, cIdx) => {
                            // Check if current processing
                            const isCurrent = rIdx === row && cIdx === col;
                            // Note: handleStep updates row/col for NEXT step, so we need to be careful with highlighting.
                            // Actually, row/col state points to the one ABOUT TO BE PROCESSED (or just processed if we update message).
                            // My logic updates val then moves row/col.
                            // So the one just updated is "prev" of current row/col state.

                            // Let's calculate "just updated" coordinates
                            let activeR = row;
                            let activeC = col;
                            if (activeC === 0 && activeR > 0) {
                                activeC = n - 1;
                                activeR = activeR - 1;
                            } else if (activeC > 0) {
                                activeC = activeC - 1;
                            } else if (dp.length > 0 && isFinished) {
                                activeR = m - 1;
                                activeC = n - 1;
                            } else {
                                // Start
                                activeR = -1;
                            }

                            const justUpdated = rIdx === activeR && cIdx === activeC;

                            return (
                                <motion.div
                                    key={`${rIdx}-${cIdx}`}
                                    animate={{
                                        scale: justUpdated ? 1.2 : 1,
                                        backgroundColor: val > 0 ? (justUpdated ? 'var(--accent-primary)' : '#444') : '#222',
                                    }}
                                    style={{
                                        width: '50px', height: '50px',
                                        borderRadius: '4px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 'bold', color: 'white',
                                        border: '1px solid #333'
                                    }}
                                >
                                    {val > 0 ? val : ''}
                                </motion.div>
                            );
                        })
                    ))}
                </div>
            )}
        </div>
    );
};

export default UniquePathsVisualizer;
