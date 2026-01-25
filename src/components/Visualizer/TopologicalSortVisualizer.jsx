import React, { useState } from 'react';

const TopologicalSortVisualizer = () => {
    // Graph: 5 -> 2, 5 -> 0, 4 -> 0, 4 -> 1, 2 -> 3, 3 -> 1
    // Vertices: 0, 1, 2, 3, 4, 5
    // In-degrees: 0:2, 1:2, 2:1, 3:1, 4:0, 5:0

    // Hardcoding initial state for simplicity of visual
    const initialInDegrees = { 0: 2, 1: 2, 2: 1, 3: 1, 4: 0, 5: 0 };
    const adj = {
        5: [2, 0],
        4: [0, 1],
        2: [3],
        3: [1],
        0: [], 1: []
    };

    const [inDegrees, setInDegrees] = useState(initialInDegrees);
    const [queue, setQueue] = useState([4, 5]); // Nodes with 0 in-degree
    const [sortedOrder, setSortedOrder] = useState([]);
    const [processed, setProcessed] = useState([]); // Nodes completely done
    const [message, setMessage] = useState('Start: Queue contains nodes with 0 in-degree [4, 5].');

    const nextStep = () => {
        if (queue.length === 0) {
            setMessage('Queue empty! Sort Complete.');
            return;
        }

        const u = queue[0];
        const newQueue = queue.slice(1);
        const newSorted = [...sortedOrder, u];
        const newProcessed = [...processed, u];
        const newInDegrees = { ...inDegrees };

        let msg = `Processed ${u}. Decrementing neighbors of ${u}: `;

        const neighbors = adj[u] || [];
        neighbors.forEach(v => {
            newInDegrees[v]--;
            msg += `${v} (new deg: ${newInDegrees[v]}), `;
            if (newInDegrees[v] === 0) {
                newQueue.push(v);
                msg += `[${v} added to Q], `;
            }
        });

        setQueue(newQueue);
        setSortedOrder(newSorted);
        setProcessed(newProcessed);
        setInDegrees(newInDegrees);
        setMessage(msg);
    };

    const reset = () => {
        setInDegrees(initialInDegrees);
        setQueue([4, 5]);
        setSortedOrder([]);
        setProcessed([]);
        setMessage('Reset.');
    };

    return (
        <div className="visualizer-container">
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--accent-secondary)' }}>{message}</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={nextStep} disabled={queue.length === 0} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '6px' }}>
                        Next Step
                    </button>
                    <button onClick={reset} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', color: 'white', borderRadius: '6px' }}>
                        Reset
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', marginBottom: '2rem' }}>
                {[0, 1, 2, 3, 4, 5].map(node => (
                    <div key={node} style={{
                        padding: '1rem',
                        border: processed.includes(node) ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                        background: 'var(--bg-secondary)',
                        borderRadius: '8px',
                        textAlign: 'center',
                        opacity: processed.includes(node) ? 0.5 : 1
                    }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{node}</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>In-Degree: {inDegrees[node]}</div>
                    </div>
                ))}
            </div>

            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <strong>Sorted Order:</strong> {sortedOrder.join(' -> ')}
            </div>
        </div>
    );
};

export default TopologicalSortVisualizer;
