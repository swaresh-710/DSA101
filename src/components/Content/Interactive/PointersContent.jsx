import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import PointersVisualizer from '../../Visualizer/PointersVisualizer';

const PointersContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Pointers & Memory Visualization</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Visualizing how pointers work is the key to mastering C++. A pointer is simply a variable that stores the memory address of another variable.
                </p>
            </div>

            <section style={{ marginBottom: '4rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Live Memory View</h3>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <PointersVisualizer />
                </div>
            </section>

            <section>
                <h3>Reference Syntax</h3>
                <CodeBlock code={`int a = 10;
int* ptr = &a; // ptr stores address of a

// Dereferencing
*ptr = 20; // Changes value at address stored in ptr (which is a)
// a is now 20

int b = 42;
ptr = &b; // ptr now stores address of b
*ptr = 100; // Changes b to 100`} />
            </section>
        </div>
    );
};

export default PointersContent;
