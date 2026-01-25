import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import LinkedListVisualizer from '../../Visualizer/LinkedListVisualizer';

const LinkedListContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Linked Lists</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    A Linked List is a linear data structure where elements are not stored at contiguous memory locations. The elements are linked using pointers.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualization</h3>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <LinkedListVisualizer />
                </div>
            </section>

            <section>
                <h3>Node Structure in C++</h3>
                <CodeBlock code={`struct Node {
    int data;
    Node* next;
    
    Node(int val) : data(val), next(nullptr) {}
};

// Usage
Node* head = new Node(10);
head->next = new Node(20);`} />
            </section>
        </div>
    );
};

export default LinkedListContent;
