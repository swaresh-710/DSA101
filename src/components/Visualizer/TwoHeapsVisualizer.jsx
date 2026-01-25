import React, { useState } from 'react';

const TwoHeapsVisualizer = () => {
    // Left: Max Heap (Small half), Right: Min Heap (Large half)
    const [minHeap, setMinHeap] = useState([]); // Stores larger numbers
    const [maxHeap, setMaxHeap] = useState([]); // Stores smaller numbers
    const [median, setMedian] = useState(0);
    const [inputValue, setInputValue] = useState('');

    const insert = () => {
        const num = parseInt(inputValue);
        if (isNaN(num)) return;

        let left = [...maxHeap];
        let right = [...minHeap];

        // 1. Insert
        if (left.length === 0 || num <= left[0]) {
            left.push(num);
            left.sort((a, b) => b - a); // Simulating Max Heap sort
        } else {
            right.push(num);
            right.sort((a, b) => a - b); // Simulating Min Heap sort
        }

        // 2. Balance
        if (left.length > right.length + 1) {
            right.push(left.shift()); // Move root of max to min
            right.sort((a, b) => a - b);
        } else if (right.length > left.length) {
            left.push(right.shift()); // Move root of min to max
            left.sort((a, b) => b - a);
        }

        setMaxHeap(left);
        setMinHeap(right);

        // 3. Calc Median
        if (left.length === right.length) {
            setMedian((left[0] + right[0]) / 2.0);
        } else {
            setMedian(left[0]);
        }

        setInputValue('');
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Find Median in Data Stream</p>
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Num"
                    style={{ padding: '0.5rem', width: '80px', borderRadius: '4px', border: '1px solid #333', background: '#222', color: 'white', marginRight: '1rem' }}
                />
                <button onClick={insert} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '6px' }}>
                    Insert Number
                </button>
                <div style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    Median: <span style={{ color: 'var(--accent-secondary)' }}>{median}</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>Max Heap (Smaller Half)</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
                        {maxHeap.map((v, i) => (
                            <div key={i} style={{ padding: '10px', background: 'var(--bg-secondary)', borderRadius: '4px', border: i === 0 ? '2px solid var(--accent-primary)' : 'none' }}>
                                {v}
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>Min Heap (Larger Half)</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
                        {minHeap.map((v, i) => (
                            <div key={i} style={{ padding: '10px', background: 'var(--bg-secondary)', borderRadius: '4px', border: i === 0 ? '2px solid var(--accent-secondary)' : 'none' }}>
                                {v}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwoHeapsVisualizer;
