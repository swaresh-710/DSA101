import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import TwoHeapsVisualizer from '../../Visualizer/TwoHeapsVisualizer';

const TwoHeapsContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Two Heaps Pattern</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    This pattern is used to find variables like the **Median** of a number stream efficiently. It uses two heaps: a Max Heap to store the smaller half of numbers, and a Min Heap for the larger half.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Median Finding Visualizer</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Insert numbers to see how they are distributed between the two heaps to maintain balance. The median is always derived from the roots of the heaps.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <TwoHeapsVisualizer />
                </div>
            </section>
        </div>
    );
};

export default TwoHeapsContent;
