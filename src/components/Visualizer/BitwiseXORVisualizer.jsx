import React, { useState } from 'react';

const BitwiseXORVisualizer = () => {
    // Problem: Find the single number in array where every other number appears twice.
    const [array] = useState([4, 1, 2, 1, 2]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [runningXor, setRunningXor] = useState(0);
    const [history, setHistory] = useState([]); // Stores steps
    const [done, setDone] = useState(false);

    const step = () => {
        if (done) return;

        const idx = currentIndex + 1;
        if (idx >= array.length) {
            setDone(true);
            return;
        }

        const val = array[idx];
        const newXor = runningXor ^ val;

        setHistory(prev => [...prev, `${runningXor} ^ ${val} = ${newXor}`]);
        setRunningXor(newXor);
        setCurrentIndex(idx);
    };

    const reset = () => {
        setCurrentIndex(-1);
        setRunningXor(0);
        setHistory([]);
        setDone(false);
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Find the single number using XOR (A ^ A = 0)</p>
                <div style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    Current XOR: <span style={{ color: 'var(--accent-primary)' }}>{runningXor}</span>
                </div>
                <button onClick={step} disabled={done} style={{ padding: '0.5rem 1rem', background: 'var(--accent-secondary)', color: 'white', borderRadius: '6px', marginRight: '1rem' }}>
                    Next Step
                </button>
                <button onClick={reset} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '6px' }}>
                    Reset
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '2rem' }}>
                {array.map((val, idx) => (
                    <div key={idx} style={{
                        width: '50px', height: '50px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: idx === currentIndex ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                        background: 'var(--bg-secondary)',
                        borderRadius: '8px',
                        opacity: idx <= currentIndex ? 0.5 : 1
                    }}>
                        {val}
                    </div>
                ))}
            </div>

            <div style={{ maxHeight: '150px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                {history.map((h, i) => (
                    <div key={i} style={{ fontFamily: 'monospace', color: '#ccc' }}>{h}</div>
                ))}
                {done && <div style={{ color: 'var(--accent-primary)', fontWeight: 'bold', marginTop: '5px' }}>Result: {runningXor} (Unique Number)</div>}
            </div>
        </div>
    );
};

export default BitwiseXORVisualizer;
