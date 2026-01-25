import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import FastSlowPointersVisualizer from '../../Visualizer/FastSlowPointersVisualizer';

const FastSlowPointersContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Fast & Slow Pointers (Floyd's Cycle Detection)</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    The **Fast & Slow** pattern, also known as the **Hare & Tortoise** algorithm, is a pointer algorithm used to detect cycles in a linked list or array sequence.
                </p>
                <div className="glass-panel" style={{ padding: '1rem', borderLeft: '4px solid var(--accent-primary)' }}>
                    <p>
                        Both pointers move at different speeds. **Slow** moves 1 step at a time, while **Fast** moves 2 steps.
                        If there is a cycle, the Fast pointer will eventually catch up to the Slow pointer.
                    </p>
                </div>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Interactive Cycle Detection</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Watch the simulation below. The nodes 3 through 9 form a loop. See how the Fast pointer (F) laps the Slow pointer (S) and meets it inside the circle.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <FastSlowPointersVisualizer />
                </div>
            </section>

            <section>
                <h3>C++ Implementation</h3>
                <CodeBlock code={`bool hasCycle(ListNode *head) {
    if (!head || !head->next) return false;
    
    ListNode *slow = head;
    ListNode *fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;          // Move 1 step
        fast = fast->next->next;    // Move 2 steps
        
        if (slow == fast) {
            return true; // Cycle detected
        }
    }
    return false; // Reached end (nullptr)
}`} />
            </section>
        </div>
    );
};

export default FastSlowPointersContent;
