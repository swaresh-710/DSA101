import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import DPVisualizer from '../../Visualizer/DPVisualizer';

const DPContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Dynamic Programming</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    DP is an optimization technique that solves complex problems by breaking them into simpler subproblems. It stores the results of subproblems to avoid re-computation.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>0/1 Knapsack Visualization</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Building the DP table bottom-up. Each cell represents the maximum value for a given capacity and subset of items.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <DPVisualizer />
                </div>
            </section>
        </div>
    );
};

export default DPContent;
