import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import KWayMergeVisualizer from '../../Visualizer/KWayMergeVisualizer';

const KWayMergeContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>K-way Merge</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    This pattern helps eliminate the problem of merging K sorted lists/arrays. We use a **Min Heap** to efficiently keep track of the smallest element among all K lists.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    At each step, we pick the smallest element from the heads of the lists and add it to the result.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <KWayMergeVisualizer />
                </div>
            </section>
        </div>
    );
};

export default KWayMergeContent;
