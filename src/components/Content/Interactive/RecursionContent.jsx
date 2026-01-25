import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import RecursionVisualizer from '../../Visualizer/RecursionVisualizer';

const RecursionContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Recursion & Call Stack</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Recursion is a method where the solution to a problem depends on solutions to smaller instances of the same problem. Each function call is added to the **Call Stack**.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizing the Call Stack</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Watch how <code>factorial(n)</code> builds up the stack until it hits the base case, then unwinds returning values.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <RecursionVisualizer />
                </div>
            </section>

            <section>
                <h3>C++ Example</h3>
                <CodeBlock code={`int factorial(int n) {
    if (n <= 1) return 1; // Base case
    return n * factorial(n - 1); // Recursive step
}`} />
            </section>
        </div>
    );
};

export default RecursionContent;
