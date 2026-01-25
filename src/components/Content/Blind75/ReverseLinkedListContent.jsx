import React from 'react';
import CodeBlock from '../../UI/CodeBlock';
import ReverseLinkedListVisualizer from '../../Visualizer/Blind75/ReverseLinkedListVisualizer';

const ReverseLinkedListContent = () => {
    const codeSnippet = `class Solution {
public:
    // Iterative Approach
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        
        while (curr != nullptr) {
            ListNode* nextTemp = curr->next; // Save next
            curr->next = prev;               // Reverse link
            prev = curr;                     // Move prev
            curr = nextTemp;                 // Move curr
        }
        
        return prev; // New head
    }
};`;

    return (
        <div className="interactive-content">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Reverse Linked List</h2>
                    <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        background: 'rgba(46, 204, 113, 0.2)', // Green for Easy
                        color: '#2ecc71',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        border: '1px solid rgba(46, 204, 113, 0.4)'
                    }}>
                        Easy
                    </span>
                    <a
                        href="https://leetcode.com/problems/reverse-linked-list/"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                        View on LeetCode ↗
                    </a>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    Given the <code>head</code> of a singly linked list, reverse the list, and return <em>the reversed list</em>.
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Visualizer: Iterative Reversal</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    We use 3 pointers: <code>Prev</code>, <code>Curr</code>, and <code>Next</code>.
                    We iterate through the list, changing the <code>current-&gt;next</code> pointer to point to <code>prev</code>. Then we shift all pointers forward.
                </p>
                <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                    <ReverseLinkedListVisualizer />
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h3>Complexity Analysis</h3>
                <ul style={{ paddingLeft: '1.2rem', color: '#888', marginBottom: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Time Complexity:</strong> <code>O(N)</code> - We visit every node once.</li>
                    <li><strong>Space Complexity:</strong> <code>O(1)</code> - Iterative solution uses constant space. (Recursive approach uses O(N) stack space).</li>
                </ul>
                <CodeBlock
                    code={codeSnippet}
                    language="cpp"
                    showLineNumbers={true}
                />
            </section>
        </div>
    );
};

export default ReverseLinkedListContent;
