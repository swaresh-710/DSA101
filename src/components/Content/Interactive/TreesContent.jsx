import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import TreesVisualizer from '../../Visualizer/TreesVisualizer';

const TreesContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Trees & Binary Search Trees (BST)</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    A Tree is a hierarchical data structure. A Binary Search Tree (BST) is a specific type of binary tree where the left child is smaller than the parent, and the right child is greater.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>BST Visualization</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Try inserting specific numbers to see how the tree balances (or doesn't!). In a standard BST, inserting sorted numbers (1, 2, 3...) creates a skewed tree (linked list).
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <TreesVisualizer />
                </div>
            </section>
        </div>
    );
};

export default TreesContent;
