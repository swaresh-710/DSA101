import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import TopologicalSortVisualizer from '../../Visualizer/TopologicalSortVisualizer';

const TopologicalSortContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Topological Sort (Graph)</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Topological Sort is used to find a linear ordering of elements that have dependencies on each other. Common in scheduling, build systems, etc. Uses **Kahn's Algorithm** (BFS with In-degrees).
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We repeatedly remove nodes with 0 in-degree (dependency count) and reduce the in-degree of their neighbors.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <TopologicalSortVisualizer />
                </div>
            </section>
        </div>
    );
};

export default TopologicalSortContent;
