import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import GreedyVisualizer from '../../Visualizer/GreedyVisualizer';

const GreedyContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Greedy Algorithms</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Greedy algorithms make the locally optimal choice at each step with the hope of finding a global optimum. They are often fast but don't always yield the perfect solution (though they do for Activity Selection!).
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Activity Selection Problem</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Sort activities by finish time. Always pick the next activity that finishes earliest and doesn't overlap with the previous one.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <GreedyVisualizer />
                </div>
            </section>
        </div>
    );
};

export default GreedyContent;
