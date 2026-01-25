import React, { useState } from 'react';

const DPVisualizer = () => {
    // 0/1 Knapsack
    // Capacity: 5
    // Items: {w:2, v:6}, {w:2, v:10}, {w:3, v:12}
    const capacity = 5;
    const items = [
        { w: 2, v: 6 },
        { w: 2, v: 10 },
        { w: 3, v: 12 }
    ];

    // DP Table initialized manually for step-by-step logic
    const rows = items.length + 1;
    const cols = capacity + 1;
    const [dp, setDp] = useState(Array(rows).fill().map(() => Array(cols).fill(0)));
    const [currItem, setCurrItem] = useState(1); // 1-indexed i
    const [currCap, setCurrCap] = useState(1);   // 1-indexed c
    const [highlight, setHighlight] = useState({ r: -1, c: -1 });
    const [message, setMessage] = useState('Click Fill to compute cell.');
    const [done, setDone] = useState(false);

    const step = () => {
        if (done) return;

        const i = currItem;
        const c = currCap;
        const item = items[i - 1];

        let valWithout = dp[i - 1][c];
        let valWith = 0;

        if (item.w <= c) {
            valWith = item.v + dp[i - 1][c - item.w];
        }

        const maxVal = Math.max(valWithout, valWith);

        // Update table
        const newDp = dp.map(r => [...r]);
        newDp[i][c] = maxVal;
        setDp(newDp);
        setHighlight({ r: i, c: c });

        let msg = `For Item ${i} (w:${item.w}, v:${item.v}) at Cap ${c}: Max(${valWithout}, ${item.w <= c ? item.v + '+' + dp[i - 1][c - item.w] : 'Skip'}) = ${maxVal}`;
        setMessage(msg);

        // Advance indices
        if (c < capacity) {
            setCurrCap(c + 1);
        } else {
            if (i < items.length) {
                setCurrItem(i + 1);
                setCurrCap(1);
            } else {
                setDone(true);
                setMessage('Table Complete! Result: ' + maxVal);
            }
        }
    };

    const reset = () => {
        setDp(Array(rows).fill().map(() => Array(cols).fill(0)));
        setCurrItem(1);
        setCurrCap(1);
        setHighlight({ r: -1, c: -1 });
        setDone(false);
        setMessage('Reset.');
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                    Items (Weight, Value): [2, 6], [2, 10], [3, 12]. Max Cap: 5
                </div>
                <p style={{ marginBottom: '1rem', color: 'var(--accent-primary)', minHeight: '1.2em' }}>{message}</p>
                <button onClick={step} disabled={done} style={{ padding: '0.5rem 1rem', background: 'var(--accent-secondary)', color: 'white', borderRadius: '6px', marginRight: '1rem' }}>
                    Fill Next
                </button>
                <button onClick={reset} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '6px' }}>
                    Reset
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', color: 'white' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '8px', border: '1px solid #444' }}>I \ Cap</th>
                            {[0, 1, 2, 3, 4, 5].map(c => <th key={c} style={{ padding: '8px', border: '1px solid #444' }}>{c}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {dp.map((row, rIdx) => (
                            <tr key={rIdx}>
                                <td style={{ padding: '8px', border: '1px solid #444', fontWeight: 'bold' }}>
                                    {rIdx === 0 ? '0' : `Item ${rIdx}`}
                                </td>
                                {row.map((val, cIdx) => (
                                    <td key={cIdx} style={{
                                        padding: '8px',
                                        border: '1px solid #444',
                                        textAlign: 'center',
                                        background: (highlight.r === rIdx && highlight.c === cIdx) ? 'var(--accent-primary)' : 'transparent',
                                        transition: 'background 0.3s'
                                    }}>
                                        {val}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DPVisualizer;
