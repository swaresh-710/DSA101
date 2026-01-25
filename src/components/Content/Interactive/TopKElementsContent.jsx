import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import TopKElementsVisualizer from '../../Visualizer/TopKElementsVisualizer';

const TopKElementsContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Top 'K' Elements</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    This pattern uses a **Heap** to find the top (smallest, largest, most frequent) K elements among a set of items.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: K Largest Elements</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We use a **Min Heap** of size K. If a new element is larger than the root (minimum of the top K), we remove the root and insert the new element.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <TopKElementsVisualizer />
                </div>
            </section>
        </div>
    );
};

export default TopKElementsContent;
