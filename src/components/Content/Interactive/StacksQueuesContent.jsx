import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import StacksQueuesVisualizer from '../../Visualizer/StacksQueuesVisualizer';

const StacksQueuesContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Stacks & Queues</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Fundamental linear data structures. **Stack** follows LIFO (Last In First Out), while **Queue** follows FIFO (First In First Out).
                </p>

                <div className="glass-panel" style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <h4 style={{ color: 'var(--accent-primary)' }}>Stack (LIFO)</h4>
                        <p style={{ fontSize: '0.8rem' }}>Insert at top, remove from top. Think: Stack of plates.</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--accent-secondary)' }}>Queue (FIFO)</h4>
                        <p style={{ fontSize: '0.8rem' }}>Insert at rear, remove from front. Think: Waiting line.</p>
                    </div>
                </div>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Interactive Playground</h3>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <StacksQueuesVisualizer />
                </div>
            </section>

            <section>
                <h3>C++ STL Implementation</h3>
                <CodeBlock code={`#include <stack>
#include <queue>

int main() {
    // Stack
    std::stack<int> s;
    s.push(10);
    s.push(20);
    int top = s.top(); // 20
    s.pop();           // Removes 20
    
    // Queue
    std::queue<int> q;
    q.push(10);
    q.push(20);
    int front = q.front(); // 10
    q.pop();               // Removes 10
}`} />
            </section>
        </div>
    );
};

export default StacksQueuesContent;
