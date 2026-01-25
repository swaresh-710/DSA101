import React, { useState } from 'react';

const HeapsVisualizer = () => {
    const [heap, setHeap] = useState([]);
    const [msg, setMsg] = useState('Max Heap Property: Parent >= Children');

    const insert = () => {
        const val = Math.floor(Math.random() * 100);
        const newHeap = [...heap, val];
        heapifyUp(newHeap, newHeap.length - 1);
        setHeap(newHeap);
    };

    const heapifyUp = (arr, index) => {
        while (index > 0) {
            const parentIdx = Math.floor((index - 1) / 2);
            if (arr[parentIdx] < arr[index]) {
                // Swap
                [arr[parentIdx], arr[index]] = [arr[index], arr[parentIdx]];
                index = parentIdx;
            } else {
                break;
            }
        }
    };

    const extractMax = () => {
        if (heap.length === 0) return;
        const newHeap = [...heap];
        const max = newHeap[0];
        const last = newHeap.pop();

        if (newHeap.length > 0) {
            newHeap[0] = last;
            heapifyDown(newHeap, 0);
        }
        setHeap(newHeap);
        setMsg(`Extracted Max: ${max}`);
    };

    const heapifyDown = (arr, index) => {
        const length = arr.length;
        while (true) {
            let left = 2 * index + 1;
            let right = 2 * index + 2;
            let largest = index;

            if (left < length && arr[left] > arr[largest]) largest = left;
            if (right < length && arr[right] > arr[largest]) largest = right;

            if (largest !== index) {
                [arr[index], arr[largest]] = [arr[largest], arr[index]];
                index = largest;
            } else {
                break;
            }
        }
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--accent-secondary)' }}>{msg}</p>
                <button onClick={insert} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '6px', marginRight: '1rem' }}>
                    Insert Random
                </button>
                <button onClick={extractMax} style={{ padding: '0.5rem 1rem', background: 'var(--accent-secondary)', color: 'white', borderRadius: '6px', marginRight: '1rem' }}>
                    Extract Max
                </button>
                <button onClick={() => setHeap([])} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '6px' }}>
                    Clear
                </button>
            </div>

            {/* Tree View (Simplified Array Mapping) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', padding: '2rem' }}>
                {heap.map((val, idx) => (
                    <div key={idx} style={{
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--glass-border)',
                        background: idx === 0 ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        borderRadius: '50%',
                        fontWeight: 'bold',
                        position: 'relative'
                    }}>
                        {val}
                        <span style={{ fontSize: '0.7rem', color: '#888', position: 'absolute', bottom: '-20px' }}>{idx}</span>
                    </div>
                ))}
            </div>
            {heap.length === 0 && <div style={{ textAlign: 'center', color: '#666' }}>Empty Heap</div>}
        </div>
    );
};

export default HeapsVisualizer;
