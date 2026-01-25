import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import HeapsVisualizer from '../../Visualizer/HeapsVisualizer';

const HeapsContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Heaps & Priority Queues</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    A Heap is a specialized tree-based data structure that satisfies the heap property. In a Max Heap, for any given node I, the value of I is greater than or equal to the values of its children.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Max Heap Visualization</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Visualized here as a linear array representation, but logically it forms a complete binary tree. The root (max element) is always at index 0.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <HeapsVisualizer />
                </div>
            </section>
        </div>
    );
};

export default HeapsContent;
