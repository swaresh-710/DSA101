import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import BitwiseXORVisualizer from '../../Visualizer/BitwiseXORVisualizer';

const BitwiseXORContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Bitwise XOR Pattern</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    XOR (Exclusive OR) is a bitwise operator that returns 1 if bits are different, and 0 if they are same. Key property: <code>A ^ A = 0</code> and <code>A ^ 0 = A</code>. This is great for finding missing or unique numbers.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Find Single Number Visualizer</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    In an array where every number appears twice except one, XORing all of them will cancel out the duplicates, leaving only the unique number.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <BitwiseXORVisualizer />
                </div>
            </section>
        </div>
    );
};

export default BitwiseXORContent;
