import React, { useState } from 'react';

const TopKElementsVisualizer = () => {
    // Problem: Find K largest elements
    const [stream] = useState([10, 5, 20, 8, 30, 15, 2]);
    const [minHeap, setMinHeap] = useState([]);
    const [k] = useState(3);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [message, setMessage] = useState(`Find Top ${k} elements. Click Next.`);
    const [done, setDone] = useState(false);

    const step = () => {
        if (done) return;

        const idx = currentIndex + 1;
        if (idx >= stream.length) {
            setMessage(`Done! The Top ${k} elements are in the heap.`);
            setDone(true);
            return;
        }

        const num = stream[idx];
        let newHeap = [...minHeap];

        if (newHeap.length < k) {
            newHeap.push(num);
            newHeap.sort((a, b) => a - b);
            setMessage(`Heap size < K. Pushed ${num}.`);
        } else if (num > newHeap[0]) {
            setMessage(`Heap full. ${num} > Min (${newHeap[0]}). Pop Min, Push ${num}.`);
            newHeap.shift(); // Remove min
            newHeap.push(num);
            newHeap.sort((a, b) => a - b);
        } else {
            setMessage(`Heap full. ${num} <= Min (${newHeap[0]}). Ignore ${num}.`);
        }

        setMinHeap(newHeap);
        setCurrentIndex(idx);
    };

    const reset = () => {
        setMinHeap([]);
        setCurrentIndex(-1);
        setDone(false);
        setMessage(`Find Top ${k} elements.`);
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>{message}</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={step} disabled={done} style={{ padding: '0.5rem 1rem', background: 'var(--accent-secondary)', color: 'white', borderRadius: '6px' }}>
                        Next Step
                    </button>
                    <button onClick={reset} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '6px' }}>
                        Reset
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ marginBottom: '0.5rem' }}>Stream</div>
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                    {stream.map((val, idx) => (
                        <div key={idx} style={{
                            padding: '10px',
                            background: idx === currentIndex ? 'var(--accent-secondary)' : 'var(--bg-secondary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '4px',
                            color: idx === currentIndex ? 'black' : 'white',
                            fontWeight: idx === currentIndex ? 'bold' : 'normal'
                        }}>
                            {val}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '0.5rem' }}>Min Heap (Size K={k})</div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', minHeight: '50px' }}>
                    {minHeap.map((val, idx) => (
                        <div key={idx} style={{
                            width: '50px', height: '50px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'var(--accent-primary)',
                            borderRadius: '50%',
                            fontWeight: 'bold',
                            border: '2px solid white'
                        }}>
                            {val}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopKElementsVisualizer;
