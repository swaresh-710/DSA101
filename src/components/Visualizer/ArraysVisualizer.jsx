import React, { useState } from 'react';

const ArraysVisualizer = () => {
    const [array, setArray] = useState([10, 20, 30, 40, 50]);
    const [capacity, setCapacity] = useState(5);
    const [explanation, setExplanation] = useState('A static array of size 5.');

    const pushBack = () => {
        if (array.length < capacity) {
            setExplanation('Added element. Size is within capacity.');
            // This case won't happen in this simplified demo unless we add delete, 
            // but let's simulate dynamic array behavior
        } else {
            // Resize needed
            setExplanation('Capacity reached! 1. Allocating new array with double capacity. 2. Copying elements. 3. Deleting old array.');
            setCapacity(prev => prev * 2);
        }

        const newVal = Math.floor(Math.random() * 100);
        setArray(prev => [...prev, newVal]);
    };

    const reset = () => {
        setArray([10, 20, 30, 40, 50]);
        setCapacity(5);
        setExplanation('Reset to initial state.');
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                <p>{explanation}</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={pushBack} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '6px' }}>
                        Connect.push_back()
                    </button>
                    <button onClick={reset} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '6px' }}>
                        Reset
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Size: {array.length} | Capacity: {capacity}
            </div>

            <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', padding: '1rem 0', minHeight: '80px' }}>
                {/* Render Actual Elements */}
                {array.map((val, idx) => (
                    <div key={idx} style={{
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--accent-primary)',
                        background: 'rgba(80, 40, 150, 0.3)',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        {val}
                    </div>
                ))}

                {/* Render Empty Capacity Slots */}
                {[...Array(capacity - array.length)].map((_, idx) => (
                    <div key={`empty-${idx}`} style={{
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px dashed var(--glass-border)',
                        background: 'transparent',
                        borderRadius: '4px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem'
                    }}>
                        ?
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default ArraysVisualizer;
