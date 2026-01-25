import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import SubsetsVisualizer from '../../Visualizer/SubsetsVisualizer';

const SubsetsContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Subsets & Backtracking</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    **Backtracking** is an algorithmic-technique for solving problems recursively by trying to build a solution incrementally, one piece at a time, removing those solutions that fail to satisfy the constraints.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: N-Queens Problem</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    The goal is to place N queens on an NxN chessboard such that no two queens attack each other. Watch the algorithm place a queen, check validity, and backtrack if it gets stuck.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <SubsetsVisualizer />
                </div>
            </section>
        </div>
    );
};

export default SubsetsContent;
