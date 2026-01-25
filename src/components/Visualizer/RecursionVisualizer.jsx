import React, { useState, useEffect } from 'react';

// Factorial Logic
const RecursionVisualizer = () => {
    const [n, setN] = useState(5);
    const [stack, setStack] = useState([]);
    const [result, setResult] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    const startFactorial = () => {
        setStack([]);
        setResult(null);
        setIsRunning(true);
        simulateFactorial(n);
    };

    const simulateFactorial = async (num) => {
        // Build Stack phase
        const buildStack = async (curr) => {
            if (curr < 1) return 1;

            setStack(prev => [...prev, { n: curr, stage: 'Calling', val: '?' }]);
            await new Promise(r => setTimeout(r, 1000));

            const res = await buildStack(curr - 1);

            // Return phase
            setStack(prev => {
                const newStack = [...prev];
                const idx = newStack.findIndex(frame => frame.n === curr);
                if (idx !== -1) {
                    newStack[idx] = { n: curr, stage: 'Returning', val: curr * res };
                }
                return newStack;
            });
            await new Promise(r => setTimeout(r, 1000));

            setStack(prev => prev.filter(frame => frame.n !== curr)); // Pop
            return curr * res;
        };

        const final = await buildStack(num);
        setResult(final);
        setIsRunning(false);
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Computes n!</p>
                <div style={{ marginBottom: '1rem' }}>
                    Input n:
                    <input
                        type="number"
                        min="1" max="7"
                        value={n}
                        onChange={(e) => setN(parseInt(e.target.value))}
                        disabled={isRunning}
                        style={{ marginLeft: '10px', padding: '5px', width: '60px', borderRadius: '4px', border: '1px solid #333', background: '#222', color: 'white' }}
                    />
                </div>
                <button onClick={startFactorial} disabled={isRunning} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '6px', opacity: isRunning ? 0.5 : 1 }}>
                    Calculate Factorial
                </button>
                {result !== null && <span style={{ marginLeft: '1rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>Result: {result}</span>}
            </div>

            <div style={{
                minHeight: '300px',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column-reverse', // Stack grows up
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(0,0,0,0.1)'
            }}>
                <div style={{ color: '#666', fontSize: '0.8rem', borderTop: '1px solid #444', paddingTop: '5px', width: '100%', textAlign: 'center' }}>Base Logic</div>

                {stack.map((frame, idx) => (
                    <div key={frame.n} style={{
                        width: '200px',
                        padding: '1rem',
                        background: frame.stage === 'Calling' ? 'var(--bg-secondary)' : 'var(--accent-secondary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '6px',
                        textAlign: 'center',
                        color: frame.stage === 'Calling' ? '#fff' : '#000',
                        fontWeight: 'bold',
                        animation: 'slideUp 0.3s ease'
                    }}>
                        <div>factorial({frame.n})</div>
                        <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                            {frame.stage === 'Calling' ? 'Waiting...' : `Returning ${frame.val}`}
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default RecursionVisualizer;
