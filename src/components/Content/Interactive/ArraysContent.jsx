import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import ArraysVisualizer from '../../Visualizer/ArraysVisualizer';

const ArraysContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Arrays & Dynamic Arrays</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Arrays store elements in contiguous memory locations. In C++, static arrays have fixed size, while <code>std::vector</code> is a dynamic array that resizes automatically.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Vector resizing Visualization</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    When a vector runs out of capacity, it creates a new larger array (usually 2x size), copies all elements, and deletes the old array. This is why <code>push_back</code> is efficient (amortized O(1)).
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <ArraysVisualizer />
                </div>
            </section>
        </div>
    );
};

export default ArraysContent;
