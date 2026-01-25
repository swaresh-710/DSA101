import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import InPlaceReversalVisualizer from '../../Visualizer/InPlaceReversalVisualizer';

const InPlaceReversalContent = () => {
    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2>In-place Reversal of Linked List</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Reversing a linked list without using extra memory (like correct stack) requires careful pointer manipulation. We iterate through the list keeping track of <code>prev</code>, <code>curr</code>, and <code>next</code> nodes.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer</h3>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <InPlaceReversalVisualizer />
                </div>
            </section>

            <section>
                <h3>C++ Code</h3>
                <CodeBlock code={`ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr;
    ListNode *curr = head;
    
    while (curr != nullptr) {
        ListNode *next = curr->next; // Save next
        curr->next = prev;           // Reverse link
        prev = curr;                 // Move prev
        curr = next;                 // Move curr
    }
    return prev; // New head
}`} />
            </section>
        </div>
    );
};

export default InPlaceReversalContent;
