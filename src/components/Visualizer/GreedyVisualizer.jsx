import React, { useState } from 'react';

const GreedyVisualizer = () => {
    // Activity Selection Problem
    // Start, End
    const [activities] = useState([
        { id: 1, s: 1, e: 4 },
        { id: 2, s: 3, e: 5 },
        { id: 3, s: 0, e: 6 },
        { id: 4, s: 5, e: 7 },
        { id: 5, s: 8, e: 9 },
        { id: 6, s: 5, e: 9 },
    ]);
    const [sorted, setSorted] = useState([]);
    const [selected, setSelected] = useState([]);
    const [stepVal, setStepVal] = useState(0);
    const [lastEndTime, setLastEndTime] = useState(-1);
    const [message, setMessage] = useState('Goal: Maximize activities. Step 1: Sort by End Time.');

    const step = () => {
        if (stepVal === 0) {
            // Sort
            const sortedActs = [...activities].sort((a, b) => a.e - b.e);
            setSorted(sortedActs);
            setMessage('Sorted by End Time. Now pick first.');
            setStepVal(1);
        } else if (stepVal <= sorted.length) {
            const idx = stepVal - 1;
            const act = sorted[idx];

            if (act.s >= lastEndTime) {
                // Select
                setSelected(prev => [...prev, act]);
                setLastEndTime(act.e);
                setMessage(`Selected Activity ${act.id} [${act.s}-${act.e}] (Starts after ${lastEndTime})`);
            } else {
                setMessage(`Skipped Activity ${act.id} [${act.s}-${act.e}] (Overlap!)`);
            }
            setStepVal(prev => prev + 1);
        } else {
            setMessage('Finished!');
        }
    };

    const reset = () => {
        setSorted([]);
        setSelected([]);
        setStepVal(0);
        setLastEndTime(-1);
        setMessage('Reset.');
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--accent-secondary)' }}>{message}</p>
                <button onClick={step} disabled={stepVal > sorted.length && stepVal !== 0} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '6px', marginRight: '1rem' }}>
                    Next Step
                </button>
                <button onClick={reset} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '6px' }}>
                    Reset
                </button>
            </div>

            <div style={{ padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '1rem' }}>Activities (Green = Selected, Red = Skipped)</h4>
                {(sorted.length > 0 ? sorted : activities).map((act, i) => {
                    const isProcessed = i < stepVal - 1;
                    const isSelected = selected.find(a => a.id === act.id);
                    const color = isProcessed ? (isSelected ? 'var(--accent-primary)' : 'rgba(255, 99, 71, 0.5)') : 'var(--bg-secondary)';

                    return (
                        <div key={act.id} style={{
                            display: 'inline-block',
                            padding: '10px',
                            margin: '5px',
                            background: color,
                            borderRadius: '4px',
                            border: '1px solid #555'
                        }}>
                            #{act.id} [{act.s} - {act.e}]
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GreedyVisualizer;
