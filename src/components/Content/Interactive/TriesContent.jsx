import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import TriesVisualizer from '../../Visualizer/TriesVisualizer';

const TriesContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Tries (Prefix Trees)</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    A Trie is a tree-like data structure used to store a dynamic set or associative array where the keys are usually strings. It is optimized for prefix-based searches (like autocomplete).
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualization</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Insert words like "CAT", "CAR", "DOG". Notice how common prefixes share the same nodes path. Orange nodes mark the End of Word.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <TriesVisualizer />
                </div>
            </section>
        </div>
    );
};

export default TriesContent;
