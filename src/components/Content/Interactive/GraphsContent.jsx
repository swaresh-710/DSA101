import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import GraphsVisualizer from '../../Visualizer/GraphsVisualizer';

const GraphsContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Graphs</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    A Graph is a non-linear data structure consisting of nodes (vertices) and edges. They are used to model networks like social connections, maps, etc.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>BFS Traversal</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Breadth-First Search (BFS) explores all neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <GraphsVisualizer />
                </div>
            </section>
        </div>
    );
};

export default GraphsContent;
