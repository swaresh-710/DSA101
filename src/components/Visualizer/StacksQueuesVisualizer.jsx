import React, { useState } from 'react';

const StacksQueuesVisualizer = () => {
    const [mode, setMode] = useState('stack'); // 'stack' or 'queue'
    const [items, setItems] = useState([10, 20, 30]);
    const [message, setMessage] = useState('Ready.');

    const push = () => {
        const newVal = Math.floor(Math.random() * 100);
        setItems(prev => [...prev, newVal]);
        setMessage(mode === 'stack' ? `Pushed ${newVal} to top.` : `Enqueued ${newVal} to rear.`);
    };

    const pop = () => {
        if (items.length === 0) {
            setMessage('Underflow! Cannot pop from empty structure.');
            return;
        }

        if (mode === 'stack') {
            const popped = items[items.length - 1];
            setItems(prev => prev.slice(0, prev.length - 1));
            setMessage(`Popped ${popped} from top.`);
        } else {
            // Queue Dequeue (remove from front)
            const popped = items[0];
            setItems(prev => prev.slice(1));
            setMessage(`Dequeued ${popped} from front.`);
        }
    };

    const clear = () => {
        setItems([]);
        setMessage('Cleared.');
    };

    return (
        <div className="visualizer-container">
            {/* Mode Switcher */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '5px', borderRadius: '8px', display: 'flex' }}>
                    <button
                        onClick={() => { setMode('stack'); setItems([10, 20]); setMessage('Switched to Stack.'); }}
                        style={{
                            padding: '0.5rem 1.5rem',
                            background: mode === 'stack' ? 'var(--accent-primary)' : 'transparent',
                            color: mode === 'stack' ? 'white' : 'var(--text-secondary)',
                            borderRadius: '6px'
                        }}
                    >
                        Stack (LIFO)
                    </button>
                    <button
                        onClick={() => { setMode('queue'); setItems([10, 20]); setMessage('Switched to Queue.'); }}
                        style={{
                            padding: '0.5rem 1.5rem',
                            background: mode === 'queue' ? 'var(--accent-secondary)' : 'transparent',
                            color: mode === 'queue' ? 'white' : 'var(--text-secondary)',
                            borderRadius: '6px'
                        }}
                    >
                        Queue (FIFO)
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexDirection: 'column', alignItems: 'center' }}>
                <div>
                    <button onClick={push} style={{ padding: '0.5rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', marginRight: '1rem' }}>
                        {mode === 'stack' ? 'Push' : 'Enqueue'}
                    </button>
                    <button onClick={pop} style={{ padding: '0.5rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', marginRight: '1rem' }}>
                        {mode === 'stack' ? 'Pop' : 'Dequeue'}
                    </button>
                    <button onClick={clear} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '6px' }}>
                        Clear
                    </button>
                </div>
                <p style={{ marginTop: '0.5rem', color: 'var(--accent-primary)' }}>{message}</p>
            </div>

            {/* Visualization Container */}
            <div style={{
                minHeight: '200px',
                display: 'flex',
                flexDirection: mode === 'stack' ? 'column-reverse' : 'row',
                alignItems: 'center',
                justifyContent: mode === 'queue' ? 'flex-start' : 'center',
                gap: '5px',
                padding: '1rem',
                border: '1px dashed var(--glass-border)',
                borderRadius: '8px',
                overflowX: 'auto'
            }}>
                {items.length === 0 && <div style={{ color: 'var(--text-secondary)', width: '100%', textAlign: 'center' }}>Empty</div>}

                {items.map((val, idx) => (
                    <div key={idx} style={{
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--glass-border)',
                        background: mode === 'stack' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        color: 'white',
                        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        {val}
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.5); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default StacksQueuesVisualizer;
