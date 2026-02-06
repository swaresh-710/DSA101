import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LCSVisualizer = () => {
    const [text1, setText1] = useState("abcde");
    const [text2, setText2] = useState("ace");

    // dp[i][j] grid
    const [dp, setDp] = useState([]);
    const [i, setI] = useState(0);
    const [j, setJ] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [message, setMessage] = useState('Click Start to find LCS.');

    const reset = () => {
        setDp([]);
        setI(0);
        setJ(0);
        setIsFinished(false);
        setMessage('Ready.');
    };

    const handleStep = () => {
        if (isFinished) return;

        const m = text1.length;
        const n = text2.length;

        // Init phase
        if (dp.length === 0) {
            // Need (m+1) x (n+1) grid
            const grid = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
            setDp(grid);
            setI(1);
            setJ(1);
            setMessage('Initialized DP table with 0s. Starting from i=1, j=1.');
            return;
        }

        if (i <= m) {
            if (j <= n) {
                // Logic
                const char1 = text1[i - 1];
                const char2 = text2[j - 1];

                const newDp = dp.map(row => [...row]);
                let msg = `Comparing ${char1} (text1[${i - 1}]) and ${char2} (text2[${j - 1}]). `;

                if (char1 === char2) {
                    newDp[i][j] = dp[i - 1][j - 1] + 1;
                    msg += `Match! dp[${i}][${j}] = 1 + dp[${i - 1}][${j - 1}] (${dp[i - 1][j - 1]}) = ${newDp[i][j]}.`;
                } else {
                    newDp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                    msg += `No match. dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = ${newDp[i][j]}.`;
                }

                setDp(newDp);
                setMessage(msg);

                if (j < n) {
                    setJ(j + 1);
                } else {
                    setJ(1);
                    setI(i + 1);
                }
            } else {
                // Should be handled by if (j < n) branch? 
                // Wait, if j increments to n+1, we reset to 1 and increment i.
                // But the loop condition enters here when i resets?
                // Actually my step logic above handles j=n case by setting next state.
            }
        } else {
            setMessage(`Finished! LCS Length: ${dp[m][n]}.`);
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
                    {(dp.length === 0) ? 'Start' : 'Next Cell'}
                </button>
                <button
                    onClick={reset}
                    style={{ padding: '0.5rem 1rem', background: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                >
                    Reset
                </button>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <label>String 1:</label>
                    <input
                        type="text"
                        value={text1}
                        onChange={(e) => { setText1(e.target.value); reset(); }}
                        style={{ width: '60px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                    <label>String 2:</label>
                    <input
                        type="text"
                        value={text2}
                        onChange={(e) => { setText2(e.target.value); reset(); }}
                        style={{ width: '60px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #555', background: '#222', color: 'white' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap', color: 'var(--accent-secondary)' }}>
                {message}
            </div>

            {dp.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: `50px repeat(${text2.length + 1}, 50px)`, gap: '2px' }}>
                    {/* Header Row */}
                    <div style={{ background: '#333', padding: '10px' }}></div>
                    <div style={{ background: '#333', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>""</div>
                    {text2.split('').map((c, idx) => (
                        <div key={idx} style={{ background: '#333', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>{c}</div>
                    ))}

                    {/* Rows */}
                    {dp.map((row, rIdx) => (
                        <React.Fragment key={rIdx}>
                            <div style={{ background: '#333', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                {rIdx === 0 ? '""' : text1[rIdx - 1]}
                            </div>
                            {row.map((val, cIdx) => {
                                const isCurrent = rIdx === i && cIdx === j && !isFinished;
                                return (
                                    <motion.div
                                        key={cIdx}
                                        animate={{
                                            backgroundColor: isCurrent ? 'var(--accent-primary)' : '#222',
                                            scale: isCurrent ? 1.1 : 1
                                        }}
                                        style={{
                                            padding: '10px',
                                            textAlign: 'center',
                                            border: '1px solid #444',
                                            color: val > 0 ? 'white' : '#666'
                                        }}
                                    >
                                        {val}
                                    </motion.div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LCSVisualizer;
